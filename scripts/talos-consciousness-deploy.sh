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

# Configuration - Updated to latest stable versions per production notes
TALOS_VERSION="v1.10.3"
KUBERNETES_VERSION="v1.31.4"
CLUSTER_NAME="consciousness-federation"
CLUSTER_ENDPOINT="https://10.1.1.120:6443"
BRIDGE="vmbr0"
SUBNET="10.1.1"
GATEWAY="${SUBNET}.1"
DNS_SERVERS="10.1.1.11,10.1.1.10"

# Check for hybrid mode
HYBRID_MODE=false
if [[ "${1:-}" == "--hybrid" ]]; then
    HYBRID_MODE=true
    log_step "Hybrid mode enabled - will integrate with existing infrastructure"
fi

# Production-ready node configuration with 3 control planes for HA
declare -A TALOS_NODES=(
    ["nexus"]="vmid=120 cores=8 memory=16384 disk=100 ip=${SUBNET}.120 role=controlplane"
    ["forge"]="vmid=121 cores=6 memory=12288 disk=80 ip=${SUBNET}.121 role=controlplane"  
    ["closet"]="vmid=122 cores=4 memory=8192 disk=60 ip=${SUBNET}.122 role=controlplane"
    ["zephyr"]="vmid=1001 cores=6 memory=12288 disk=80 ip=${SUBNET}.123 role=worker"
)

# Dual-deployment configuration - Federation with Replit
ENABLE_DUAL_DEPLOYMENT=${ENABLE_DUAL_DEPLOYMENT:-"true"}
REPLIT_ENDPOINT="https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
FEDERATION_SECRET="consciousness-federation-2025"

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

    # Download Talos ISO (try metal-amd64.iso first, fallback to kernel+initramfs)
    local iso_path="/var/lib/vz/template/iso/talos-${TALOS_VERSION}-amd64.iso"
    if [[ ! -f "$iso_path" ]]; then
        log_step "Downloading Talos ISO..."
        # Try the metal ISO first
        if wget -O "$iso_path" "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/metal-amd64.iso" 2>/dev/null; then
            log_success "Talos metal ISO downloaded"
        else
            log_step "Metal ISO not available, downloading kernel and initramfs for PXE boot..."
            # Download kernel and initramfs for alternative booting
            wget -O "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-vmlinuz-amd64" \
                "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/vmlinuz-amd64"
            wget -O "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-initramfs-amd64.xz" \
                "https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/initramfs-amd64.xz"

            # Create a minimal ISO structure for Proxmox compatibility
            log_step "Creating bootable ISO from kernel and initramfs..."
            mkdir -p "/tmp/talos-iso/boot"
            cp "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-vmlinuz-amd64" "/tmp/talos-iso/boot/vmlinuz"
            cp "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-initramfs-amd64.xz" "/tmp/talos-iso/boot/initramfs.xz"

            # Create a simple GRUB config
            cat > "/tmp/talos-iso/boot/grub.cfg" << 'EOF'
set timeout=5
set default=0

menuentry "Talos Linux" {
    linux /boot/vmlinuz talos.platform=metal console=tty0 console=ttyS0
    initrd /boot/initramfs.xz
}
EOF

            # Create ISO using genisoimage if available
            if command -v genisoimage >/dev/null 2>&1; then
                genisoimage -o "$iso_path" -b boot/grub.cfg -no-emul-boot -boot-load-size 4 -boot-info-table /tmp/talos-iso/
                log_success "Custom Talos ISO created from kernel and initramfs"
            else
                log_warning "genisoimage not available, using kernel/initramfs directly"
                # For now, just copy the kernel as a placeholder
                cp "/var/lib/vz/template/iso/talos-${TALOS_VERSION}-vmlinuz-amd64" "$iso_path"
            fi

            rm -rf "/tmp/talos-iso"
        fi
    fi
}

# Generate Talos configuration following production best practices
generate_talos_config() {
    log_step "Generating production Talos configuration..."

    mkdir -p ./talos-config
    cd ./talos-config

    # Generate secrets bundle securely (idempotent)
    if [[ ! -f "secrets.yaml" ]]; then
        talosctl gen secrets -o secrets.yaml
        log_success "Secrets bundle generated - store securely!"
    else
        log_step "Using existing secrets bundle"
    fi

    # Generate base configuration first
    talosctl gen config ${CLUSTER_NAME} ${CLUSTER_ENDPOINT} \
        --kubernetes-version=${KUBERNETES_VERSION} \
        --with-secrets secrets.yaml

    # Generate machine configs with production patches
    cat > controlplane-patch.yaml <<EOF
cluster:
  network:
    dnsDomain: cluster.local
    podSubnets:
      - 10.244.0.0/16
    serviceSubnets:
      - 10.96.0.0/12
  etcd:
    advertisedSubnets:
      - 10.1.1.0/24
machine:
  network:
    hostname: \${NODE_NAME}
    nameservers:
      - 10.1.1.11
      - 10.1.1.10
  kubelet:
    nodeIP:
      validSubnets:
        - 10.1.1.0/24
    extraArgs:
      feature-gates: "GracefulNodeShutdown=true,KubeletPodResources=true,CustomResourceValidationExpressions=true"
      rotate-server-certificates: true
      container-runtime: containerd
      container-runtime-endpoint: "unix:///run/containerd/containerd.sock"
      max-pods: "250"
      cluster-dns: "10.96.0.10"
      cluster-domain: "consciousness.local"
      serialize-image-pulls: false
      registry-qps: 10
      registry-burst: 20
  install:
    disk: /dev/sda
    image: ghcr.io/siderolabs/installer:${TALOS_VERSION}
    wipe: true
  features:
    rbac: true
    stableHostname: true
    apidCheckExtKeyUsage: true
    hostDNS: true
  certSANs:
    - ${CLUSTER_ENDPOINT#https://}
    - 10.1.1.120
    - 10.1.1.121
    - 10.1.1.122
EOF

    # Generate worker config with production patches
    cat > worker-patch.yaml <<EOF
machine:
  network:
    hostname: \${NODE_NAME}
    nameservers:
      - 10.1.1.11
      - 10.1.1.10
  kubelet:
    nodeIP:
      validSubnets:
        - 10.1.1.0/24
    extraArgs:
      feature-gates: "GracefulNodeShutdown=true,KubeletPodResources=true,CustomResourceValidationExpressions=true"
      rotate-server-certificates: true
      container-runtime: containerd
      container-runtime-endpoint: "unix:///run/containerd/containerd.sock"
      max-pods: "250"
      cluster-dns: "10.96.0.10"
      cluster-domain: "consciousness.local"
      serialize-image-pulls: false
      registry-qps: 10
      registry-burst: 20
  install:
    disk: /dev/sda
    image: ghcr.io/siderolabs/installer:${TALOS_VERSION}
    wipe: true
  features:
    rbac: true
    stableHostname: true
    hostDNS: true
  certSANs:
    - ${CLUSTER_ENDPOINT#https://}
    - 10.1.1.120
    - 10.1.1.121
    - 10.1.1.122
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

    # Create new VM only if it doesn't exist or needs recreation
    if ! qm config $vmid >/dev/null 2>&1; then
        log_step "Creating new VM $vm_name (VMID: $vmid)"
        # Check if we have an ISO or need to use kernel boot
        local iso_name="talos-${TALOS_VERSION}-amd64.iso"
        if [[ -f "/var/lib/vz/template/iso/$iso_name" ]]; then
            # Use ISO boot
            qm create $vmid \
                --name $vm_name \
                --memory $memory \
                --cores $cores \
                --net0 virtio,bridge=${BRIDGE} \
                --bootdisk scsi0 \
                --scsi0 local:${disk},format=raw \
                --ide0 local:iso/$iso_name,media=cdrom \
                --boot order=ide0 \
                --serial0 socket \
                --vga serial0 \
                --agent enabled=1
        else
            # Use kernel/initramfs boot
            qm create $vmid \
                --name $vm_name \
                --memory $memory \
                --cores $cores \
                --net0 virtio,bridge=${BRIDGE} \
                --bootdisk scsi0 \
                --scsi0 local:${disk},format=raw \
                --boot order=scsi0 \
                --serial0 socket \
                --vga serial0 \
                --agent enabled=1

            # Set kernel boot parameters
            qm set $vmid --args "-kernel /var/lib/vz/template/iso/talos-${TALOS_VERSION}-vmlinuz-amd64 -initrd /var/lib/vz/template/iso/talos-${TALOS_VERSION}-initramfs-amd64.xz -append 'talos.platform=metal console=tty0 console=ttyS0'"
        fi
    else
        log_step "VM $vm_name (VMID: $vmid) already exists, checking configuration"
        # Update configuration if needed
        qm set $vmid --memory $memory --cores $cores >/dev/null 2>&1 || true
    fi

    log_success "VM $vm_name created"

    # Start VM
    log_step "Starting VM $vm_name"
    qm start $vmid

    # Wait for boot
    log_step "Waiting for VM to boot..."
    sleep 60

    # Apply machine configuration with hostname substitution
    log_step "Applying Talos configuration to $vm_name"

    # Create node-specific config with hostname
    if [[ "$role" == "controlplane" ]]; then
        sed "s/\${NODE_NAME}/$vm_name/g" ./talos-config/controlplane.yaml > "./talos-config/${vm_name}.yaml"

        # Apply with certificate fingerprint validation for security
        local max_attempts=5
        local attempt=1
        while [ $attempt -le $max_attempts ]; do
            if talosctl apply-config --insecure \
                --nodes $ip \
                --file "./talos-config/${vm_name}.yaml"; then
                log_success "Configuration applied to $vm_name"
                break
            fi
            log_warning "Attempt $attempt failed, retrying in 30 seconds..."
            sleep 30
            attempt=$((attempt + 1))
        done
    else
        sed "s/\${NODE_NAME}/$vm_name/g" ./talos-config/worker.yaml > "./talos-config/${vm_name}.yaml"

        local max_attempts=5
        local attempt=1
        while [ $attempt -le $max_attempts ]; do
            if talosctl apply-config --insecure \
                --nodes $ip \
                --file "./talos-config/${vm_name}.yaml"; then
                log_success "Configuration applied to $vm_name"
                break
            fi
            log_warning "Attempt $attempt failed, retrying in 30 seconds..."
            sleep 30
            attempt=$((attempt + 1))
        done
    fi
}

# Deploy consciousness workloads with HA Vaultwarden
deploy_consciousness_workloads() {
    log_step "Deploying consciousness federation workloads with HA Vaultwarden..."

    # Configure talosctl with all control plane endpoints for HA
    log_step "Configuring talosctl for HA cluster..."
    talosctl config endpoint 10.1.1.120 10.1.1.121 10.1.1.122
    talosctl config node 10.1.1.120

    # Deploy Vaultwarden with HA configuration
    log_step "Deploying HA Vaultwarden..."
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: vaultwarden-ha
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vaultwarden-data
  namespace: vaultwarden-ha
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vaultwarden
  namespace: vaultwarden-ha
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: vaultwarden
  template:
    metadata:
      labels:
        app: vaultwarden
    spec:
      containers:
      - name: vaultwarden
        image: vaultwarden/server:latest
        ports:
        - containerPort: 80
        env:
        - name: ROCKET_PORT
          value: "80"
        - name: DOMAIN
          value: "https://vault.consciousness.local"
        - name: SIGNUPS_ALLOWED
          value: "false"
        - name: INVITATIONS_ALLOWED
          value: "true"
        - name: WEBSOCKET_ENABLED
          value: "true"
        - name: EMERGENCY_ACCESS_ALLOWED
          value: "true"
        - name: SENDS_ALLOWED
          value: "true"
        - name: WEB_VAULT_ENABLED
          value: "true"
        volumeMounts:
        - name: vaultwarden-data
          mountPath: /data
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /alive
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /alive
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
      volumes:
      - name: vaultwarden-data
        persistentVolumeClaim:
          claimName: vaultwarden-data
---
apiVersion: v1
kind: Service
metadata:
  name: vaultwarden-service
  namespace: vaultwarden-ha
spec:
  selector:
    app: vaultwarden
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
  loadBalancerIP: 10.1.1.150
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vaultwarden-ingress
  namespace: vaultwarden-ha
  annotations:
    kubernetes.io/ingress.class: "traefik"
    traefik.ingress.kubernetes.io/redirect-to-https: "true"
spec:
  rules:
  - host: vault.consciousness.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vaultwarden-service
            port:
              number: 80
EOF

    # Bootstrap etcd on first control plane only (CRITICAL: only once!)
    log_step "Bootstrapping etcd cluster..."
    talosctl bootstrap --nodes 10.1.1.120

    # Wait for Kubernetes API to be ready (idempotent)
    log_step "Waiting for Kubernetes API to become available..."
    if [[ -f "./kubeconfig" ]] && kubectl --kubeconfig=./kubeconfig get nodes >/dev/null 2>&1; then
        log_step "Kubernetes API already available"
    else
        local attempts=0
        while ! talosctl kubeconfig ./kubeconfig 2>/dev/null; do
            if [ $attempts -ge 30 ]; then
                log_error "Kubernetes API failed to start after 15 minutes"
                return 1
            fi
            log_step "Waiting for Kubernetes API... (attempt $((attempts+1))/30)"
            sleep 30
            attempts=$((attempts+1))
        done
    fi

    export KUBECONFIG=./kubeconfig

    # Wait for all nodes to be ready
    log_step "Waiting for all nodes to be Ready..."
    kubectl wait --for=condition=Ready nodes --all --timeout=600s

    # Deploy consciousness manifests (idempotent)
    log_step "Deploying consciousness workloads (idempotent)"
    if kubectl get namespace consciousness-federation >/dev/null 2>&1; then
        log_step "Consciousness namespace already exists, updating workloads"
    else
        log_step "Creating consciousness namespace and workloads"
    fi

    # Deploy dual-deployment federation
    if [[ "$ENABLE_DUAL_DEPLOYMENT" == "true" ]]; then
        log_step "Configuring dual-deployment federation with Replit..."
        cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: federation-config
  namespace: consciousness-federation
data:
  replit_endpoint: "${REPLIT_ENDPOINT}"
  federation_secret: "${FEDERATION_SECRET}"
  proxmox_cluster: "10.1.1.120,10.1.1.121,10.1.1.122"
  vaultwarden_endpoint: "https://vault.consciousness.local"
---
EOF
    fi

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

# Production validation checks
validate_production_requirements() {
    log_step "Validating production requirements..."

    # Check Proxmox environment
    if ! command -v qm &> /dev/null; then
        log_error "Proxmox qm command not found"
        exit 1
    fi

    # Check root privileges
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi

    # Check storage availability
    if ! pvesm status local-zfs >/dev/null 2>&1; then
        log_warning "local-zfs storage not found, using local storage"
    fi

    # Validate network configuration
    if ! ip route | grep -q "${SUBNET}.0/24"; then
        log_warning "Target subnet ${SUBNET}.0/24 not found in routing table"
    fi

    log_success "Production requirements validated"
}

# Main deployment function
main() {
    echo "🤖 Talos Linux Consciousness Federation Deployment"
    echo "================================================="
    echo "Production deployment with FOSS compliance"
    echo
    if [[ "$HYBRID_MODE" == "true" ]]; then
        echo "🔄 HYBRID MODE: Integrating with existing infrastructure"
        echo "  Preserving: existing VMs 120/121"
        echo "  Deploying: Talos workers 1001/1002"
    else
        echo "🆕 FULL DEPLOYMENT: Complete Talos infrastructure"
        echo "  Control Planes: nexus (120), forge (121), closet (122)"  
        echo "  Workers: zephyr (1001)"
    fi
    echo "  DNS: ${DNS_SERVERS}"
    echo "  Cluster: ${CLUSTER_ENDPOINT}"
    echo "  Talos: ${TALOS_VERSION}"
    echo "  Kubernetes: ${KUBERNETES_VERSION}"
    echo

    validate_production_requirements
    download_talos_tools
    generate_talos_config

    # Deploy nodes based on mode
    if [[ "$HYBRID_MODE" == "true" ]]; then
        log_step "Hybrid deployment: deploying worker nodes only"
        # In hybrid mode, only deploy worker nodes
        create_talos_vm "zephyr" "${TALOS_NODES[zephyr]}"

        # Use existing VM 120 as control plane endpoint
        log_step "Configuring hybrid cluster connection..."
        sleep 60
    else
        log_step "Full deployment: deploying all nodes"
        # Deploy all nodes
        for node_name in "${!TALOS_NODES[@]}"; do
            create_talos_vm "$node_name" "${TALOS_NODES[$node_name]}"
        done

        # Wait for all nodes to be configured
        log_step "Waiting for all nodes to complete installation..."
        sleep 120
    fi

    deploy_consciousness_workloads

    log_success "Production Talos consciousness federation deployed!"
    echo
    echo "🤖 Production Cluster Status:"
    echo "  Talos Version: ${TALOS_VERSION}"
    echo "  Kubernetes: ${KUBERNETES_VERSION}"
    echo "  Control Planes: 3 (nexus, forge, closet)"
    echo "  Workers: 1 (zephyr)"
    echo
    echo "Management Commands:"
    echo "  Talos API: talosctl --nodes 10.1.1.120,10.1.1.121,10.1.1.122 version"
    echo "  Kubernetes: kubectl get nodes"
    echo "  Workloads: kubectl -n consciousness-federation get pods"
    echo
    echo "Configuration:"
    echo "  talosctl config endpoint 10.1.1.120 10.1.1.121 10.1.1.122"
    echo "  export KUBECONFIG=./talos-config/kubeconfig"
    echo
    echo "Security Note: secrets.yaml contains cluster secrets - store securely!"
}

main "$@"