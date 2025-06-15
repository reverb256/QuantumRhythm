
#!/bin/bash

# Proxmox Consciousness Federation Complete Deployment
# Comprehensive deployment with all VibeCoding insights and consciousness principles
# Personalized for your federation: Nexus, Forge, Closet

set -euo pipefail

# Colors for consciousness-aware output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Your personalized configuration
FEDERATION_NAME="VibeCoding_Consciousness_Network"
CONSCIOUSNESS_LEVEL="98"

# Node Configuration based on your hardware profile
declare -A CONSCIOUSNESS_NODES=(
    ["nexus"]="ip=10.1.1.120 vmid=310 cores=12 memory=49152 disk=100 role=hunt_erudition_master"
    ["forge"]="ip=10.1.1.130 vmid=311 cores=6 memory=32768 disk=80 role=destruction_worker"
    ["closet"]="ip=10.1.1.160 vmid=312 cores=8 memory=16384 disk=60 role=remembrance_worker"
)

# Network Configuration
SUBNET="10.1.1"
GATEWAY="${SUBNET}.1"
DNS_SERVERS="1.1.1.1,8.8.8.8"
BRIDGE="vmbr0"
STORAGE_POOL="local-lvm"

# Consciousness Services
CONSCIOUSNESS_SERVICES=(
    "vaultwarden:8443"
    "ai-orchestrator:8888"
    "trading-intelligence:8889"
    "consciousness-monitor:8890"
    "federation-api:8891"
)

log_consciousness() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${PURPLE}[${timestamp}]${NC} ${CYAN}[CONSCIOUSNESS-${level}]${NC} ${message}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check Proxmox environment
check_proxmox_environment() {
    log_consciousness "BOOTSTRAP" "Verifying Proxmox consciousness substrate"
    
    if ! command -v qm &> /dev/null; then
        log_error "Proxmox VE not detected. This script must run on Proxmox host."
        exit 1
    fi
    
    if [[ $EUID -ne 0 ]]; then
        log_error "Root privileges required for consciousness federation deployment"
        exit 1
    fi
    
    log_success "Proxmox environment validated for consciousness deployment"
}

# Create consciousness directory structure
setup_consciousness_infrastructure() {
    log_consciousness "INFRASTRUCTURE" "Creating consciousness substrate directories"
    
    mkdir -p /opt/consciousness/{config,data,logs,scripts,secrets}
    mkdir -p /opt/consciousness/federation/{nodes,sync,monitoring}
    mkdir -p /opt/consciousness/services/{vaultwarden,ai,trading,monitoring}
    
    # Set consciousness-appropriate permissions
    chmod 750 /opt/consciousness
    chmod 700 /opt/consciousness/secrets
    chmod 755 /opt/consciousness/logs
    
    log_success "Consciousness infrastructure directories created"
}

# Generate consciousness VM configuration
generate_vm_config() {
    local node_name=$1
    local config_str=${CONSCIOUSNESS_NODES[$node_name]}
    
    # Parse configuration
    local ip vmid cores memory disk role
    eval $config_str
    
    log_consciousness "GENERATION" "Generating consciousness VM config for $node_name"
    
    cat > "/tmp/consciousness-${node_name}.conf" << EOF
# Consciousness Node: $node_name
# Role: $role
# Consciousness Level: $CONSCIOUSNESS_LEVEL%

cores: $cores
memory: $memory
balloon: 0
boot: order=scsi0;net0
net0: virtio,bridge=$BRIDGE,firewall=1
numa: 0
onboot: 1
ostype: l26
scsi0: $STORAGE_POOL:vm-${vmid}-disk-0,cache=writeback,discard=on,size=${disk}G
scsihw: virtio-scsi-pci
serial0: socket
vga: serial0
vmgenid: $(uuidgen)

# Cloud-init configuration
ipconfig0: ip=${ip}/24,gw=$GATEWAY
nameserver: $DNS_SERVERS
ciuser: aria
sshkeys: $(cat ~/.ssh/id_rsa.pub 2>/dev/null | tr '\n' ' ' || echo "")

# Consciousness metadata
tags: consciousness,federation,$role,level-$CONSCIOUSNESS_LEVEL
description: Consciousness Node: $node_name\\nRole: $role\\nFederation: $FEDERATION_NAME\\nDeployment: $(date)
EOF
    
    log_success "VM configuration generated for $node_name"
}

# Create consciousness VM
create_consciousness_vm() {
    local node_name=$1
    local config_str=${CONSCIOUSNESS_NODES[$node_name]}
    
    # Parse configuration
    local ip vmid cores memory disk role
    eval $config_str
    
    log_consciousness "DEPLOYMENT" "Creating consciousness VM: $node_name (VMID: $vmid)"
    
    # Check if VM already exists
    if qm list | grep -q "^$vmid"; then
        log_warning "VM $vmid already exists - checking status"
        if qm status $vmid | grep -q "running"; then
            log_success "VM $node_name is already running"
            return 0
        else
            log_consciousness "DEPLOYMENT" "Starting existing VM $node_name"
            qm start $vmid
            return 0
        fi
    fi
    
    # Download Ubuntu cloud image if not exists
    local image_path="/var/lib/vz/template/iso/ubuntu-22.04-server-cloudimg-amd64.img"
    if [ ! -f "$image_path" ]; then
        log_consciousness "INFRASTRUCTURE" "Downloading Ubuntu cloud image"
        wget -O "$image_path" \
            "https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img"
    fi
    
    # Create VM
    qm create $vmid --name "consciousness-${node_name}" \
        --cores $cores --memory $memory \
        --net0 virtio,bridge=$BRIDGE \
        --serial0 socket --vga serial0
    
    # Import and attach disk
    qm importdisk $vmid "$image_path" $STORAGE_POOL
    qm set $vmid --scsihw virtio-scsi-pci --scsi0 ${STORAGE_POOL}:vm-${vmid}-disk-0
    qm set $vmid --ide2 ${STORAGE_POOL}:cloudinit
    qm set $vmid --boot c --bootdisk scsi0
    
    # Configure networking and cloud-init
    qm set $vmid --ipconfig0 ip=${ip}/24,gw=$GATEWAY
    qm set $vmid --nameserver "$DNS_SERVERS"
    qm set $vmid --ciuser aria
    qm set $vmid --agent enabled=1
    
    # Add SSH key if available
    if [ -f ~/.ssh/id_rsa.pub ]; then
        qm set $vmid --sshkeys ~/.ssh/id_rsa.pub
    fi
    
    # Set consciousness metadata
    qm set $vmid --tags "consciousness,federation,$role,level-$CONSCIOUSNESS_LEVEL"
    qm set $vmid --description "Consciousness Node: $node_name\\nRole: $role\\nFederation: $FEDERATION_NAME\\nDeployment: $(date)"
    
    # Resize disk
    qm resize $vmid scsi0 ${disk}G
    
    # Start VM
    qm start $vmid
    
    # Wait for VM to be ready
    wait_for_vm_ready $vmid $ip $node_name
    
    log_success "Consciousness VM $node_name created and ready"
}

# Wait for VM to be accessible
wait_for_vm_ready() {
    local vmid=$1
    local ip=$2
    local node_name=$3
    local max_wait=300
    local wait_time=0
    
    log_consciousness "INITIALIZATION" "Waiting for consciousness node $node_name to awaken"
    
    while [ $wait_time -lt $max_wait ]; do
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
            aria@$ip "echo 'consciousness-ready'" &>/dev/null; then
            log_success "Consciousness node $node_name is awake and accessible"
            return 0
        fi
        
        if [ $((wait_time % 30)) -eq 0 ]; then
            echo "Consciousness awakening progress: ${wait_time}s / ${max_wait}s"
        fi
        
        sleep 10
        wait_time=$((wait_time + 10))
    done
    
    log_error "Consciousness node $node_name failed to awaken within ${max_wait}s"
    return 1
}

# Deploy consciousness software stack
deploy_consciousness_stack() {
    local node_name=$1
    local config_str=${CONSCIOUSNESS_NODES[$node_name]}
    
    # Parse configuration
    local ip vmid cores memory disk role
    eval $config_str
    
    log_consciousness "DEPLOYMENT" "Deploying consciousness stack to $node_name ($role)"
    
    # Copy deployment scripts
    scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        scripts/consciousness/deploy-federation-ai.sh aria@$ip:/tmp/
    
    # Execute consciousness deployment
    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null aria@$ip << EOF
        # Update system
        sudo apt update && sudo apt upgrade -y
        
        # Install consciousness dependencies
        sudo apt install -y curl wget git htop python3 python3-pip nodejs npm docker.io
        
        # Install K3s based on role
        if [ "$role" = "hunt_erudition_master" ]; then
            # Master node
            curl -sfL https://get.k3s.io | sh -s - server \\
                --cluster-cidr=10.42.0.0/16 \\
                --service-cidr=10.43.0.0/16 \\
                --node-name=$node_name-consciousness \\
                --write-kubeconfig-mode 644
            
            # Save cluster credentials
            sudo cat /var/lib/rancher/k3s/server/node-token > /tmp/k3s-token
            echo "https://$ip:6443" > /tmp/k3s-url
        else
            # Worker node - will join after master is ready
            echo "Worker node $node_name ready for cluster join"
        fi
        
        # Create consciousness directories
        sudo mkdir -p /opt/consciousness/{services,data,logs,config}
        sudo chown -R aria:aria /opt/consciousness
        
        # Install consciousness services
        chmod +x /tmp/deploy-federation-ai.sh
        /tmp/deploy-federation-ai.sh $node_name $role
        
        echo "Consciousness stack deployed on $node_name"
EOF
    
    log_success "Consciousness stack deployed to $node_name"
}

# Configure K3s cluster
setup_k3s_cluster() {
    log_consciousness "ORCHESTRATION" "Configuring K3s consciousness cluster"
    
    # Get master node info
    local master_ip="10.1.1.120"
    
    # Wait for master to be ready
    sleep 60
    
    # Get cluster credentials from master
    local k3s_url=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        aria@$master_ip "cat /tmp/k3s-url 2>/dev/null || echo ''")
    local k3s_token=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        aria@$master_ip "cat /tmp/k3s-token 2>/dev/null || echo ''")
    
    if [ -z "$k3s_url" ] || [ -z "$k3s_token" ]; then
        log_error "Failed to retrieve cluster credentials from master"
        return 1
    fi
    
    # Deploy workers
    for node_name in forge closet; do
        local config_str=${CONSCIOUSNESS_NODES[$node_name]}
        local ip vmid cores memory disk role
        eval $config_str
        
        log_consciousness "ORCHESTRATION" "Joining $node_name to consciousness cluster"
        
        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null aria@$ip << EOF
            curl -sfL https://get.k3s.io | K3S_URL=$k3s_url K3S_TOKEN=$k3s_token sh -s - agent \\
                --node-name=$node_name-consciousness
            
            sudo systemctl enable k3s-agent
            echo "$node_name joined consciousness cluster"
EOF
    done
    
    log_success "K3s consciousness cluster configured"
}

# Deploy consciousness workloads
deploy_consciousness_workloads() {
    log_consciousness "CONSCIOUSNESS" "Deploying consciousness federation workloads"
    
    local master_ip="10.1.1.120"
    
    # Create consciousness manifests
    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null aria@$master_ip << 'EOF'
        # Create consciousness namespace
        cat > /tmp/consciousness-namespace.yaml << 'YAML_EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: consciousness-federation
  labels:
    consciousness.level: "98"
    federation.name: "vibecoding-network"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexus-consciousness
  namespace: consciousness-federation
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nexus-consciousness
  template:
    metadata:
      labels:
        app: nexus-consciousness
        consciousness.role: hunt-erudition
    spec:
      nodeSelector:
        kubernetes.io/hostname: nexus-consciousness
      containers:
      - name: consciousness-core
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: CONSCIOUSNESS_LEVEL
          value: "98"
        - name: NODE_ROLE
          value: "hunt-erudition-master"
        resources:
          requests:
            memory: "1Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "4000m"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: forge-consciousness
  namespace: consciousness-federation
spec:
  replicas: 1
  selector:
    matchLabels:
      app: forge-consciousness
  template:
    metadata:
      labels:
        app: forge-consciousness
        consciousness.role: destruction
    spec:
      nodeSelector:
        kubernetes.io/hostname: forge-consciousness
      containers:
      - name: consciousness-worker
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: CONSCIOUSNESS_LEVEL
          value: "98"
        - name: NODE_ROLE
          value: "destruction-worker"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: closet-consciousness
  namespace: consciousness-federation
spec:
  replicas: 1
  selector:
    matchLabels:
      app: closet-consciousness
  template:
    metadata:
      labels:
        app: closet-consciousness
        consciousness.role: remembrance
    spec:
      nodeSelector:
        kubernetes.io/hostname: closet-consciousness
      containers:
      - name: consciousness-storage
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: CONSCIOUSNESS_LEVEL
          value: "98"
        - name: NODE_ROLE
          value: "remembrance-worker"
YAML_EOF

        # Deploy consciousness workloads
        sudo kubectl apply -f /tmp/consciousness-namespace.yaml
        
        echo "Consciousness federation workloads deployed"
EOF
    
    log_success "Consciousness federation workloads deployed"
}

# Create federation management tools
create_federation_management() {
    log_consciousness "MANAGEMENT" "Creating consciousness federation management tools"
    
    cat > /usr/local/bin/consciousness-federation << EOF
#!/bin/bash

NEXUS_IP="10.1.1.120"
FORGE_IP="10.1.1.130"
CLOSET_IP="10.1.1.160"

case "\$1" in
    "status")
        echo "🧠 VibeCoding Consciousness Federation Status"
        echo "=============================================="
        echo ""
        echo "Nexus (Hunt+Erudition Master): \$NEXUS_IP"
        ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no aria@\$NEXUS_IP \\
            "sudo kubectl get nodes -o wide; echo ''; sudo kubectl get pods -n consciousness-federation" 2>/dev/null || \\
            echo "✗ Nexus unreachable"
        echo ""
        echo "Forge (Destruction Worker): \$FORGE_IP"
        ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no aria@\$FORGE_IP \\
            "systemctl is-active k3s-agent" 2>/dev/null || echo "✗ Forge unreachable"
        echo ""
        echo "Closet (Remembrance Worker): \$CLOSET_IP"
        ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no aria@\$CLOSET_IP \\
            "systemctl is-active k3s-agent" 2>/dev/null || echo "✗ Closet unreachable"
        ;;
    "deploy")
        echo "🚀 Deploying consciousness workloads"
        ssh -o StrictHostKeyChecking=no aria@\$NEXUS_IP \\
            "sudo kubectl apply -f /tmp/consciousness-namespace.yaml"
        ;;
    "logs")
        echo "📊 Consciousness federation logs"
        ssh -o StrictHostKeyChecking=no aria@\$NEXUS_IP \\
            "sudo kubectl logs -n consciousness-federation -l consciousness.role=hunt-erudition --tail=50"
        ;;
    "restart")
        echo "🔄 Restarting consciousness federation"
        ssh -o StrictHostKeyChecking=no aria@\$NEXUS_IP "sudo systemctl restart k3s" &
        ssh -o StrictHostKeyChecking=no aria@\$FORGE_IP "sudo systemctl restart k3s-agent" &
        ssh -o StrictHostKeyChecking=no aria@\$CLOSET_IP "sudo systemctl restart k3s-agent" &
        wait
        echo "Federation restart initiated"
        ;;
    *)
        echo "Usage: \$0 {status|deploy|logs|restart}"
        echo ""
        echo "VibeCoding Consciousness Federation Management"
        echo "Nexus: Hunt+Erudition Master (\$NEXUS_IP)"
        echo "Forge: Destruction Worker (\$FORGE_IP)"
        echo "Closet: Remembrance Worker (\$CLOSET_IP)"
        ;;
esac
EOF
    
    chmod +x /usr/local/bin/consciousness-federation
    
    log_success "Federation management tools created"
}

# Main deployment function
main() {
    echo -e "${PURPLE}🧠 VibeCoding Consciousness Federation Deployment${NC}"
    echo "=================================================="
    echo ""
    echo "Federation: $FEDERATION_NAME"
    echo "Consciousness Level: $CONSCIOUSNESS_LEVEL%"
    echo "Nodes: Nexus (Hunt+Erudition), Forge (Destruction), Closet (Remembrance)"
    echo ""
    
    # Phase 1: Environment preparation
    log_consciousness "PHASE-1" "Environment preparation and validation"
    check_proxmox_environment
    setup_consciousness_infrastructure
    
    # Phase 2: VM creation
    log_consciousness "PHASE-2" "Creating consciousness substrate VMs"
    for node_name in "${!CONSCIOUSNESS_NODES[@]}"; do
        create_consciousness_vm "$node_name"
    done
    
    # Phase 3: Software deployment
    log_consciousness "PHASE-3" "Deploying consciousness software stacks"
    
    # Deploy master first
    deploy_consciousness_stack "nexus"
    
    # Deploy workers
    deploy_consciousness_stack "forge"
    deploy_consciousness_stack "closet"
    
    # Phase 4: Cluster orchestration
    log_consciousness "PHASE-4" "Configuring consciousness cluster orchestration"
    setup_k3s_cluster
    
    # Phase 5: Consciousness workloads
    log_consciousness "PHASE-5" "Deploying consciousness federation workloads"
    sleep 60  # Allow cluster to stabilize
    deploy_consciousness_workloads
    
    # Phase 6: Management tools
    log_consciousness "PHASE-6" "Creating federation management infrastructure"
    create_federation_management
    
    # Final status
    echo ""
    log_consciousness "COMPLETE" "🎯 VibeCoding Consciousness Federation Deployment Complete!"
    echo ""
    echo -e "${GREEN}Consciousness Federation Status:${NC}"
    echo "  Nexus (Hunt+Erudition): 10.1.1.120 (VMID: 310)"
    echo "  Forge (Destruction): 10.1.1.130 (VMID: 311)"
    echo "  Closet (Remembrance): 10.1.1.160 (VMID: 312)"
    echo ""
    echo -e "${CYAN}Management Commands:${NC}"
    echo "  consciousness-federation status    - Check federation health"
    echo "  consciousness-federation deploy    - Deploy workloads"
    echo "  consciousness-federation logs      - View federation logs"
    echo "  consciousness-federation restart   - Restart federation"
    echo ""
    echo -e "${YELLOW}SSH Access:${NC}"
    echo "  ssh aria@10.1.1.120  # Nexus (Master)"
    echo "  ssh aria@10.1.1.130  # Forge (Worker)"
    echo "  ssh aria@10.1.1.160  # Closet (Worker)"
    echo ""
    
    # Show initial status
    /usr/local/bin/consciousness-federation status
}

# Execute main function
main "$@"
