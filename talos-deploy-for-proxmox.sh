#!/bin/bash

# Idempotent Talos Linux Consciousness Federation for Proxmox
# Run this directly on your Proxmox host

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration for your homelab
TALOS_VERSION="v1.7.6"
KUBERNETES_VERSION="v1.30.3"
CLUSTER_NAME="consciousness-federation"
CLUSTER_ENDPOINT="https://10.1.1.120:6443"
DNS_SERVERS="10.1.1.11,10.1.1.10"
WORK_DIR="/tmp/talos-deploy"

# Your VM configuration
declare -A TALOS_NODES=(
    ["nexus"]="vmid=120 cores=8 memory=16384 disk=100 ip=10.1.1.120 role=controlplane"
    ["forge"]="vmid=121 cores=6 memory=12288 disk=80 ip=10.1.1.121 role=controlplane"  
    ["closet"]="vmid=1001 cores=4 memory=8192 disk=60 ip=10.1.1.122 role=worker"
    ["zephyr"]="vmid=1002 cores=6 memory=12288 disk=80 ip=10.1.1.123 role=worker"
)

log_step() { echo -e "${CYAN}[$(date '+%H:%M:%S')] $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check Proxmox environment
check_proxmox() {
    if ! command -v qm >/dev/null 2>&1; then
        log_error "Must run on Proxmox host with qm command"
        exit 1
    fi
    log_success "Running on Proxmox host"
}

# Install tools
install_tools() {
    log_step "Installing talosctl..."
    if ! command -v talosctl >/dev/null 2>&1; then
        curl -sLO "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/talosctl-linux-amd64"
        chmod +x talosctl-linux-amd64
        mv talosctl-linux-amd64 /usr/local/bin/talosctl
        log_success "talosctl installed"
    fi
    
    log_step "Downloading Talos ISO..."
    local iso_path="/var/lib/vz/template/iso/talos-${TALOS_VERSION}-amd64.iso"
    if [[ ! -f "$iso_path" ]]; then
        wget -O "$iso_path" "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/talos-amd64.iso"
        log_success "Talos ISO downloaded"
    fi
}

# Generate configuration
generate_config() {
    log_step "Generating Talos configuration..."
    mkdir -p ${WORK_DIR} && cd ${WORK_DIR}
    
    if [[ ! -f "secrets.yaml" ]]; then
        talosctl gen secrets
        talosctl gen config ${CLUSTER_NAME} ${CLUSTER_ENDPOINT} \
            --kubernetes-version=${KUBERNETES_VERSION} \
            --with-secrets secrets.yaml \
            --config-patch-control-plane @- <<EOF
machine:
  network:
    nameservers: [10.1.1.11, 10.1.1.10]
  install:
    disk: /dev/sda
    image: ghcr.io/siderolabs/installer:${TALOS_VERSION}
    wipe: true
EOF
        
        talosctl gen config ${CLUSTER_NAME} ${CLUSTER_ENDPOINT} \
            --kubernetes-version=${KUBERNETES_VERSION} \
            --with-secrets secrets.yaml \
            --config-patch-worker @- <<EOF
machine:
  network:
    nameservers: [10.1.1.11, 10.1.1.10]
  install:
    disk: /dev/sda
    image: ghcr.io/siderolabs/installer:${TALOS_VERSION}
    wipe: true
EOF
        log_success "Configuration generated"
    fi
}

# Deploy VM
deploy_vm() {
    local vm_name=$1
    local config_str=$2
    eval $config_str
    
    log_step "Deploying $vm_name (VMID: $vmid)..."
    
    # Clean slate
    if qm status $vmid >/dev/null 2>&1; then
        qm stop $vmid 2>/dev/null || true
        sleep 3
        qm destroy $vmid 2>/dev/null || true
    fi
    
    # Create VM
    qm create $vmid \
        --name $vm_name \
        --memory $memory \
        --cores $cores \
        --net0 virtio,bridge=vmbr0 \
        --scsi0 local-zfs:${disk},format=raw \
        --ide0 local:iso/talos-${TALOS_VERSION}-amd64.iso,media=cdrom \
        --boot order=ide0 \
        --serial0 socket \
        --vga serial0
    
    qm set $vmid --ipconfig0 ip=${ip}/24,gw=10.1.1.1
    qm set $vmid --nameserver ${DNS_SERVERS}
    qm start $vmid
    
    log_success "$vm_name created and started"
    
    # Wait and configure
    log_step "Waiting for $vm_name to boot..."
    sleep 90
    
    local config_file="controlplane.yaml"
    [[ "$role" == "worker" ]] && config_file="worker.yaml"
    
    log_step "Applying Talos config to $vm_name..."
    local attempts=5
    while [ $attempts -gt 0 ]; do
        if talosctl apply-config --insecure --nodes $ip --file $config_file 2>/dev/null; then
            log_success "$vm_name configured"
            break
        fi
        attempts=$((attempts - 1))
        sleep 15
    done
}

# Bootstrap cluster
bootstrap_cluster() {
    log_step "Bootstrapping Kubernetes cluster..."
    cd ${WORK_DIR}
    
    talosctl config endpoint 10.1.1.120
    talosctl config node 10.1.1.120
    
    sleep 30
    talosctl bootstrap --nodes 10.1.1.120
    
    log_step "Getting kubeconfig..."
    sleep 60
    talosctl kubeconfig kubeconfig
    export KUBECONFIG=${WORK_DIR}/kubeconfig
    
    kubectl wait --for=condition=Ready nodes --all --timeout=300s
    log_success "Cluster ready"
}

# Deploy workloads
deploy_workloads() {
    log_step "Deploying consciousness workloads..."
    export KUBECONFIG=${WORK_DIR}/kubeconfig
    
    kubectl create namespace consciousness-federation 2>/dev/null || true
    
    cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: consciousness-coordinator
  namespace: consciousness-federation
spec:
  replicas: 2
  selector:
    matchLabels:
      app: consciousness-coordinator
  template:
    metadata:
      labels:
        app: consciousness-coordinator
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      containers:
      - name: coordinator
        image: alpine:latest
        command: ["sleep", "infinity"]
        env:
        - name: NODE_ROLE
          value: "coordinator"
EOF
    
    log_success "Consciousness workloads deployed"
}

# Main execution
main() {
    echo "🤖 Talos Consciousness Federation for Proxmox"
    echo "============================================="
    echo "Deploying to VMs: nexus(120), forge(121), closet(1001), zephyr(1002)"
    echo
    
    check_proxmox
    install_tools
    generate_config
    
    # Deploy control planes first
    deploy_vm "nexus" "${TALOS_NODES[nexus]}"
    deploy_vm "forge" "${TALOS_NODES[forge]}"
    
    bootstrap_cluster
    
    # Deploy workers
    deploy_vm "closet" "${TALOS_NODES[closet]}"
    deploy_vm "zephyr" "${TALOS_NODES[zephyr]}"
    
    deploy_workloads
    
    log_success "Deployment complete!"
    echo
    echo "Management commands:"
    echo "  export KUBECONFIG=${WORK_DIR}/kubeconfig"
    echo "  kubectl get nodes"
    echo "  kubectl -n consciousness-federation get pods"
}

main "$@"