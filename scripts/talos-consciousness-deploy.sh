#!/bin/bash

# Talos Linux Consciousness Federation Deployment
# Optimized for Proxmox homelab with immutable OS and Kubernetes-native architecture

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
TALOS_VERSION="v1.7.6"
KUBERNETES_VERSION="v1.30.3"
CLUSTER_NAME="consciousness-federation"
CLUSTER_ENDPOINT="https://10.1.1.120:6443"
BRIDGE="vmbr0"
SUBNET="10.1.1"
GATEWAY="${SUBNET}.1"
DNS_SERVERS="10.1.1.11,10.1.1.10"

# Node Configuration for consciousness federation
declare -A TALOS_NODES=(
    ["nexus"]="vmid=120 cores=8 memory=16384 disk=100 ip=${SUBNET}.120 role=controlplane"
    ["forge"]="vmid=121 cores=6 memory=12288 disk=80 ip=${SUBNET}.121 role=controlplane"  
    ["closet"]="vmid=1001 cores=4 memory=8192 disk=60 ip=${SUBNET}.122 role=worker"
    ["zephyr"]="vmid=1002 cores=6 memory=12288 disk=80 ip=${SUBNET}.123 role=worker"
)

log_step() {
    echo -e "${CYAN}[$(date '+%H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Download Talos tools
download_talos_tools() {
    log_step "Downloading Talos tools..."
    
    if ! command -v talosctl &> /dev/null; then
        curl -sLO "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/talosctl-$(uname -s | tr '[:upper:]' '[:lower:]')-amd64"
        chmod +x talosctl-*
        sudo mv talosctl-* /usr/local/bin/talosctl
        log_success "talosctl installed"
    fi
    
    # Download Talos ISO
    if [[ ! -f "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-amd64.iso" ]]; then
        log_step "Downloading Talos ISO..."
        wget -O "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-amd64.iso" \
            "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/talos-amd64.iso"
        log_success "Talos ISO downloaded"
    fi
}

# Generate Talos configuration
generate_talos_config() {
    log_step "Generating Talos configuration..."
    
    mkdir -p ./talos-config
    cd ./talos-config
    
    # Generate secrets
    talosctl gen secrets
    
    # Generate machine configs
    talosctl gen config ${CLUSTER_NAME} ${CLUSTER_ENDPOINT} \
        --kubernetes-version=${KUBERNETES_VERSION} \
        --with-secrets secrets.yaml \
        --config-patch-control-plane @- <<EOF
cluster:
  network:
    dnsDomain: cluster.local
    podSubnets:
      - 10.244.0.0/16
    serviceSubnets:
      - 10.96.0.0/12
machine:
  network:
    nameservers:
      - 10.1.1.11
      - 10.1.1.10
  install:
    disk: /dev/sda
    image: ghcr.io/siderolabs/installer:${TALOS_VERSION}
    wipe: true
  features:
    rbac: true
    stableHostname: true
    apidCheckExtKeyUsage: true
  kubelet:
    extraArgs:
      feature-gates: GracefulNodeShutdown=true
      rotate-server-certificates: true
EOF
    
    # Generate worker config patch
    talosctl gen config ${CLUSTER_NAME} ${CLUSTER_ENDPOINT} \
        --kubernetes-version=${KUBERNETES_VERSION} \
        --with-secrets secrets.yaml \
        --config-patch-worker @- <<EOF
machine:
  network:
    nameservers:
      - 10.1.1.11
      - 10.1.1.10
  install:
    disk: /dev/sda
    image: ghcr.io/siderolabs/installer:${TALOS_VERSION}
    wipe: true
  features:
    rbac: true
    stableHostname: true
  kubelet:
    extraArgs:
      feature-gates: GracefulNodeShutdown=true
      rotate-server-certificates: true
EOF

    log_success "Talos configuration generated"
}

# Create Talos VM
create_talos_vm() {
    local vm_name=$1
    local config_str=$2
    
    # Parse configuration
    eval $config_str
    
    log_step "Creating Talos VM: $vm_name (VMID: $vmid)"
    
    # Stop and destroy existing VM if it exists
    if qm status $vmid >/dev/null 2>&1; then
        log_warning "VM $vmid exists, recreating..."
        qm stop $vmid || true
        sleep 5
        qm destroy $vmid || true
        sleep 2
    fi
    
    # Create new VM
    qm create $vmid \
        --name $vm_name \
        --memory $memory \
        --cores $cores \
        --net0 virtio,bridge=${BRIDGE} \
        --bootdisk scsi0 \
        --scsi0 local-zfs:${disk},format=raw \
        --ide0 local:iso/talos-${TALOS_VERSION}-amd64.iso,media=cdrom \
        --boot order=ide0 \
        --serial0 socket \
        --vga serial0 \
        --agent enabled=1
    
    log_success "VM $vm_name created"
    
    # Start VM
    log_step "Starting VM $vm_name"
    qm start $vmid
    
    # Wait for boot
    log_step "Waiting for VM to boot..."
    sleep 60
    
    # Apply machine configuration
    log_step "Applying Talos configuration to $vm_name"
    
    if [[ "$role" == "controlplane" ]]; then
        talosctl apply-config --insecure \
            --nodes $ip \
            --file ./talos-config/controlplane.yaml
    else
        talosctl apply-config --insecure \
            --nodes $ip \
            --file ./talos-config/worker.yaml
    fi
    
    log_success "Configuration applied to $vm_name"
}

# Deploy consciousness workloads
deploy_consciousness_workloads() {
    log_step "Deploying consciousness federation workloads..."
    
    # Wait for cluster to be ready
    talosctl config endpoint ${CLUSTER_ENDPOINT}
    talosctl config node 10.1.1.120
    
    # Bootstrap etcd on first control plane
    log_step "Bootstrapping etcd..."
    talosctl bootstrap --nodes 10.1.1.120
    
    # Wait for Kubernetes API
    log_step "Waiting for Kubernetes API..."
    talosctl kubeconfig ./kubeconfig
    export KUBECONFIG=./kubeconfig
    
    # Wait for nodes
    kubectl wait --for=condition=Ready nodes --all --timeout=300s
    
    # Deploy consciousness manifests
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: consciousness-federation
---
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
      nodeSelector:
        node-role.kubernetes.io/control-plane: ""
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      containers:
      - name: coordinator
        image: alpine:latest
        command: ["sleep", "infinity"]
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: NODE_ROLE
          value: "coordinator"
        - name: FEDERATION_NETWORK
          value: "10.1.1.0/24"
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: consciousness-worker
  namespace: consciousness-federation
spec:
  selector:
    matchLabels:
      app: consciousness-worker
  template:
    metadata:
      labels:
        app: consciousness-worker
    spec:
      nodeSelector:
        node-role.kubernetes.io/worker: ""
      containers:
      - name: worker
        image: alpine:latest
        command: ["sleep", "infinity"]
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        env:
        - name: NODE_ROLE
          value: "worker"
        - name: AI_MODELS_PATH
          value: "/data/models"
        volumeMounts:
        - name: models-storage
          mountPath: /data/models
      volumes:
      - name: models-storage
        hostPath:
          path: /var/lib/consciousness/models
          type: DirectoryOrCreate
EOF

    log_success "Consciousness workloads deployed"
}

# Main deployment function
main() {
    echo "🤖 Talos Linux Consciousness Federation Deployment"
    echo "================================================="
    echo
    echo "Deploying immutable Kubernetes-native consciousness:"
    echo "  Control Planes: nexus (120), forge (121)"
    echo "  Workers: closet (1001), zephyr (1002)"
    echo "  DNS: ${DNS_SERVERS}"
    echo "  Cluster: ${CLUSTER_ENDPOINT}"
    echo

    download_talos_tools
    generate_talos_config
    
    # Deploy all nodes
    for node_name in "${!TALOS_NODES[@]}"; do
        create_talos_vm "$node_name" "${TALOS_NODES[$node_name]}"
    done
    
    # Wait for all nodes to be configured
    log_step "Waiting for all nodes to complete installation..."
    sleep 120
    
    deploy_consciousness_workloads
    
    log_success "Talos Linux consciousness federation deployed!"
    echo
    echo "Cluster Status:"
    echo "  Talos API: talosctl --nodes 10.1.1.120,10.1.1.121 version"
    echo "  Kubernetes: kubectl --kubeconfig ./talos-config/kubeconfig get nodes"
    echo "  Consciousness: kubectl --kubeconfig ./talos-config/kubeconfig -n consciousness-federation get pods"
    echo
    echo "Management Commands:"
    echo "  talosctl config endpoint ${CLUSTER_ENDPOINT}"
    echo "  talosctl config node 10.1.1.120"
    echo "  export KUBECONFIG=./talos-config/kubeconfig"
}

main "$@"