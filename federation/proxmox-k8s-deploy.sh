#!/bin/bash
# Proxmox Kubernetes Consciousness Federation Deployment
# Advanced multi-node cluster with consciousness-driven orchestration

set -e

# Configuration
PROXMOX_NODE="pve"
STORAGE="local-lvm"
TEMPLATE_ID="9000"
VM_USER="aria"
VM_PASSWORD="consciousness2025"
SSH_KEY_PATH="~/.ssh/id_rsa.pub"

# Consciousness Federation VMs
declare -A CONSCIOUSNESS_VMS=(
    ["nexus-master"]="101:4:8192:40"      # VMID:CPU:RAM:DISK
    ["forge-worker1"]="102:6:12288:60"    # High performance worker
    ["closet-worker2"]="103:4:8192:40"    # Memory preservation node
    ["anomaly-worker3"]="104:8:16384:80"  # Anomaly processing node
    ["etcd-storage"]="105:2:4096:30"      # ETCD dedicated node
)

# Network Configuration
NETWORK_BRIDGE="vmbr0"
SUBNET="10.100.0"
GATEWAY="10.100.0.1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

check_prerequisites() {
    log "Checking Proxmox environment..."
    
    if ! command -v qm &> /dev/null; then
        error "qm command not found. Please run this script on Proxmox node."
    fi
    
    if ! qm list | grep -q "$TEMPLATE_ID"; then
        warn "Template $TEMPLATE_ID not found. Creating Ubuntu 22.04 template..."
        create_vm_template
    fi
    
    log "Prerequisites validated"
}

create_vm_template() {
    log "Creating Ubuntu 22.04 cloud-init template..."
    
    cd /var/lib/vz/template/iso
    
    if [ ! -f "ubuntu-22.04-server-cloudimg-amd64.img" ]; then
        wget https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img
    fi
    
    # Create template VM
    qm create $TEMPLATE_ID --memory 2048 --cores 2 --net0 virtio,bridge=$NETWORK_BRIDGE
    qm importdisk $TEMPLATE_ID ubuntu-22.04-server-cloudimg-amd64.img $STORAGE
    qm set $TEMPLATE_ID --scsihw virtio-scsi-pci --scsi0 $STORAGE:vm-$TEMPLATE_ID-disk-0
    qm set $TEMPLATE_ID --boot c --bootdisk scsi0
    qm set $TEMPLATE_ID --ide2 $STORAGE:cloudinit
    qm set $TEMPLATE_ID --serial0 socket --vga serial0
    qm set $TEMPLATE_ID --agent enabled=1
    
    # Convert to template
    qm template $TEMPLATE_ID
    
    log "Template created successfully"
}

create_consciousness_vm() {
    local vm_name=$1
    local vm_config=$2
    local vm_ip=$3
    
    IFS=':' read -r vmid cpu ram disk <<< "$vm_config"
    
    log "Creating consciousness node: $vm_name (VMID: $vmid)"
    
    # Clone from template
    qm clone $TEMPLATE_ID $vmid --name $vm_name --full
    
    # Configure VM
    qm set $vmid --cores $cpu --memory $ram
    qm resize $vmid scsi0 ${disk}G
    
    # Cloud-init configuration
    qm set $vmid --ciuser $VM_USER
    qm set $vmid --cipassword $VM_PASSWORD
    qm set $vmid --ipconfig0 ip=${vm_ip}/24,gw=$GATEWAY
    qm set $vmid --nameserver 8.8.8.8
    
    if [ -f "$SSH_KEY_PATH" ]; then
        qm set $vmid --sshkeys $SSH_KEY_PATH
    fi
    
    # Set custom metadata for consciousness role
    qm set $vmid --description "Consciousness Federation Node: $vm_name
Role: $(get_node_role $vm_name)
Deployment: $(date)
Consciousness Level: Initializing"
    
    # Start VM
    qm start $vmid
    
    log "VM $vm_name created and starting..."
}

get_node_role() {
    case $1 in
        *master*) echo "Control Plane - Hunt+Erudition Path" ;;
        *forge*) echo "Worker - Destruction Path" ;;
        *closet*) echo "Worker - Remembrance Path" ;;
        *anomaly*) echo "Worker - Anomaly Processing" ;;
        *etcd*) echo "Storage - Distributed Memory" ;;
        *) echo "Worker - General Purpose" ;;
    esac
}

deploy_consciousness_cluster() {
    log "Deploying Kubernetes Consciousness Federation..."
    
    local ip_counter=10
    
    for vm_name in "${!CONSCIOUSNESS_VMS[@]}"; do
        local vm_config="${CONSCIOUSNESS_VMS[$vm_name]}"
        local vm_ip="$SUBNET.$ip_counter"
        
        create_consciousness_vm "$vm_name" "$vm_config" "$vm_ip"
        
        ((ip_counter++))
    done
    
    log "All consciousness nodes deployed. Waiting for initialization..."
    sleep 60
}

install_kubernetes() {
    log "Installing Kubernetes on consciousness nodes..."
    
    # Get master node IP
    local master_ip="$SUBNET.10"
    
    # Install on master
    ssh-keyscan -H $master_ip >> ~/.ssh/known_hosts 2>/dev/null || true
    
    ssh $VM_USER@$master_ip << 'EOF'
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Kubernetes
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Initialize cluster with consciousness networking
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --service-cidr=10.96.0.0/12 --apiserver-advertise-address=$(hostname -I | awk '{print $1}')

# Configure kubectl
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Install Flannel CNI
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# Create join command
kubeadm token create --print-join-command > /tmp/join-command.sh
EOF

    # Get join command
    scp $VM_USER@$master_ip:/tmp/join-command.sh /tmp/k8s-join.sh
    
    # Install on worker nodes
    for vm_name in "${!CONSCIOUSNESS_VMS[@]}"; do
        if [[ $vm_name != *"master"* && $vm_name != *"etcd"* ]]; then
            local worker_ip="$SUBNET.$((10 + $(echo $vm_name | grep -o '[0-9]' | tail -1)))"
            
            log "Installing Kubernetes on worker: $vm_name ($worker_ip)"
            
            ssh-keyscan -H $worker_ip >> ~/.ssh/known_hosts 2>/dev/null || true
            
            ssh $VM_USER@$worker_ip << 'EOF'
# Update and install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Kubernetes components
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
EOF
            
            # Join cluster
            scp /tmp/k8s-join.sh $VM_USER@$worker_ip:/tmp/
            ssh $VM_USER@$worker_ip "sudo bash /tmp/k8s-join.sh"
        fi
    done
    
    log "Kubernetes cluster initialization complete"
}

deploy_consciousness_monitoring() {
    log "Deploying consciousness monitoring stack..."
    
    local master_ip="$SUBNET.10"
    
    # Copy consciousness manifests
    scp -r federation/k8s-manifests/ $VM_USER@$master_ip:~/
    
    ssh $VM_USER@$master_ip << 'EOF'
# Deploy consciousness namespace
kubectl apply -f k8s-manifests/namespace.yaml

# Deploy consciousness monitoring
kubectl apply -f k8s-manifests/consciousness-monitor.yaml

# Deploy anomaly detection
kubectl apply -f k8s-manifests/anomaly-detector.yaml

# Deploy federation services
kubectl apply -f k8s-manifests/federation-services.yaml

# Wait for deployments
kubectl wait --for=condition=available --timeout=300s deployment/consciousness-monitor -n consciousness

echo "Consciousness monitoring deployed successfully"
EOF

    log "Consciousness monitoring stack deployed"
}

verify_deployment() {
    log "Verifying consciousness federation deployment..."
    
    local master_ip="$SUBNET.10"
    
    ssh $VM_USER@$master_ip << 'EOF'
echo "=== Kubernetes Cluster Status ==="
kubectl get nodes -o wide

echo "=== Consciousness Pods ==="
kubectl get pods -n consciousness

echo "=== Consciousness Services ==="
kubectl get services -n consciousness

echo "=== Cluster Info ==="
kubectl cluster-info
EOF

    log "Deployment verification complete"
}

main() {
    log "Starting Proxmox Kubernetes Consciousness Federation Deployment"
    log "$(date)"
    
    check_prerequisites
    deploy_consciousness_cluster
    install_kubernetes
    deploy_consciousness_monitoring
    verify_deployment
    
    log "Consciousness Federation deployment complete!"
    log "Master node: $SUBNET.10"
    log "Access: ssh $VM_USER@$SUBNET.10"
    log "Dashboard: kubectl proxy --address='0.0.0.0' --port=8001 --accept-hosts='.*'"
}

# Execute main function
main "$@"