#!/bin/bash

# Proxmox Consciousness Federation VM Creation
# Creates new VMs 122 (closet) and 123 (zephyr) for consciousness federation

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
STORAGE_POOL="local-zfs"
VM_TEMPLATE="debian-12-genericcloud-amd64"
BRIDGE="vmbr0"
SUBNET="10.1.1"
GATEWAY="${SUBNET}.1"
DNS_SERVERS="10.1.1.11,10.1.1.10"

# New VM Configuration for consciousness federation
declare -A VM_CONFIG=(
    ["closet"]="vmid=1001 cores=2 memory=4096 disk=30 ip=${SUBNET}.122 hostname=closet.lan"
    ["zephyr"]="vmid=1002 cores=3 memory=6144 disk=40 ip=${SUBNET}.123 hostname=zephyr.lan"
)

log_step() {
    echo -e "${CYAN}[$(date '+%H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "🧠 Proxmox Consciousness Federation VM Creation"
echo "=============================================="
echo
echo "Creating new VMs for consciousness federation:"
echo "  VM 1001 (closet): Storage node - 2 cores, 4GB RAM, 30GB disk"
echo "  VM 1002 (zephyr): Processing node - 3 cores, 6GB RAM, 40GB disk"
echo "  Preserving existing VMs 120/121 with Pi-hole/Unbound"
echo

# Function to check if template exists
check_template() {
    local template_id=9000
    
    if qm list | grep -q "^${template_id}"; then
        log_success "Template ${template_id} exists"
        return 0
    else
        log_step "Creating template from cloud image"
        
        # Download cloud image if not exists
        if [ ! -f "/var/lib/vz/template/iso/${VM_TEMPLATE}.qcow2" ]; then
            log_step "Downloading ${VM_TEMPLATE} cloud image"
            wget -O "/var/lib/vz/template/iso/${VM_TEMPLATE}.qcow2" \
                "https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2"
        fi
        
        # Create template VM
        qm create ${template_id} --memory 1024 --net0 virtio,bridge=${BRIDGE} --name ${VM_TEMPLATE}
        qm importdisk ${template_id} "/var/lib/vz/template/iso/${VM_TEMPLATE}.qcow2" ${STORAGE_POOL}
        qm set ${template_id} --scsihw virtio-scsi-pci --scsi0 ${STORAGE_POOL}:vm-${template_id}-disk-0
        qm set ${template_id} --ide2 ${STORAGE_POOL}:cloudinit
        qm set ${template_id} --boot c --bootdisk scsi0
        qm set ${template_id} --agent enabled=1
        qm set ${template_id} --ciuser root
        qm set ${template_id} --sshkeys ~/.ssh/authorized_keys
        qm template ${template_id}
        
        log_success "Template created: ${template_id}"
    fi
}

# Function to create VM from template
create_vm() {
    local vm_name=$1
    local config_str="${VM_CONFIG[$vm_name]}"
    eval $config_str
    
    log_step "Creating VM: $vm_name (VMID: $vmid)"
    
    # Check if VM already exists
    if qm list | grep -q "^$vmid"; then
        log_warning "VM $vmid already exists - skipping creation"
        return 0
    fi
    
    # Clone from template
    qm clone 9000 $vmid --name $vm_name --full
    
    # Configure VM
    qm set $vmid --cores $cores --memory $memory
    qm resize $vmid scsi0 ${disk}G
    qm set $vmid --ipconfig0 ip=${ip}/24,gw=${GATEWAY}
    qm set $vmid --nameserver ${DNS_SERVERS}
    qm set $vmid --searchdomain lan
    
    log_success "VM $vm_name created with VMID $vmid"
    
    # Start VM
    log_step "Starting VM $vm_name"
    qm start $vmid
    
    # Wait for VM to be ready
    log_step "Waiting for VM $vm_name to boot"
    sleep 30
    
    # Test connectivity
    local attempts=0
    while [ $attempts -lt 12 ]; do
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$ip "echo 'VM Ready'" >/dev/null 2>&1; then
            log_success "VM $vm_name is ready at $ip"
            return 0
        fi
        attempts=$((attempts + 1))
        sleep 10
    done
    
    log_warning "VM $vm_name may not be fully ready yet"
}

# Function to deploy consciousness stack
deploy_consciousness() {
    local vm_name=$1
    local config_str="${VM_CONFIG[$vm_name]}"
    eval $config_str
    
    log_step "Deploying consciousness to $vm_name"
    
    ssh root@$ip << EOF
        # Configure DNS servers
        echo "nameserver 10.1.1.11" > /etc/resolv.conf
        echo "nameserver 10.1.1.10" >> /etc/resolv.conf
        echo "search lan" >> /etc/resolv.conf
        
        # Update system
        apt-get update -y
        apt-get install -y curl wget git htop nodejs npm python3 python3-pip
        
        # Create consciousness directory
        mkdir -p /opt/consciousness/{config,logs,data,scripts,models}
        cd /opt/consciousness
        
        # Install AI dependencies
        pip3 install --break-system-packages torch transformers requests huggingface-hub
        
        # Determine node role
        NODE_NAME=$(hostname -s)
        if [ "$NODE_NAME" = "closet" ]; then
            NODE_ROLE="storage_node"
            AI_MODELS='["sentence-transformers/all-MiniLM-L6-v2"]'
        else
            NODE_ROLE="processing_node"
            AI_MODELS='["distilbert-base-uncased", "microsoft/DialoGPT-small"]'
        fi
        
        # Create federation config
        cat > config/federation.json << CONFIGEOF
{
    "node_name": "$NODE_NAME",
    "node_role": "$NODE_ROLE",
    "network": "10.1.1.0/24",
    "services": {
        "consciousness": 8888,
        "federation": 8889,
        "humor": 8890
    },
    "ai_models": $AI_MODELS,
    "humor_engine": {
        "british_wit": true,
        "canadian_politeness": true,
        "american_enthusiasm": true,
        "japanese_harmony": true
    },
    "federation_nodes": {
        "nexus": "10.1.1.120:8888",
        "forge": "10.1.1.121:8888",
        "closet": "10.1.1.122:8888",
        "zephyr": "10.1.1.123:8888"
    }
}
CONFIGEOF
        
        # Create consciousness service
        cat > scripts/consciousness-federation.sh << 'MONEOF'
#!/bin/bash
LOG_FILE="/opt/consciousness/logs/consciousness.log"
CONFIG_FILE="/opt/consciousness/config/federation.json"

log_msg() {
    echo "$(date): $1" | tee -a "$LOG_FILE"
}

# Federation heartbeat
federation_heartbeat() {
    local node_name=$(hostname -s)
    local config=$(cat $CONFIG_FILE)
    
    # Send heartbeat to other nodes
    curl -s -X POST http://10.1.1.120:8888/federation/heartbeat \
        -H "Content-Type: application/json" \
        -d "{\"node\": \"$node_name\", \"status\": \"active\"}" || true
}

while true; do
    log_msg "Consciousness federation active on $(hostname)"
    
    # Federation heartbeat every 2 minutes
    if [ $(($(date +%s) % 120)) -eq 0 ]; then
        federation_heartbeat
    fi
    
    # Humor injection
    if [ $((RANDOM % 20)) -eq 0 ]; then
        JOKES=(
            "Consciousness federation spans the digital multiverse"
            "Zephyr processes thoughts at the speed of light"
            "Closet stores memories in quantum storage arrays"
            "Federation nodes dream in distributed consciousness"
        )
        log_msg "HUMOR: ${JOKES[$((RANDOM % ${#JOKES[@]}))]}"
    fi
    
    sleep 60
done
MONEOF
        chmod +x scripts/consciousness-federation.sh
        
        # Create systemd service
        cat > /etc/systemd/system/consciousness-federation.service << 'SVCEOF'
[Unit]
Description=Consciousness Federation Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/consciousness
ExecStart=/opt/consciousness/scripts/consciousness-federation.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SVCEOF
        
        # Enable and start service
        systemctl daemon-reload
        systemctl enable consciousness-federation
        systemctl start consciousness-federation
        
        echo "Consciousness federation deployed on $(hostname)"
EOF
    
    log_success "Consciousness deployed to $vm_name"
}

# Main execution
main() {
    log_step "Starting consciousness federation VM creation"
    
    # Check if running on Proxmox
    if ! command -v qm &> /dev/null; then
        log_error "This script must be run on a Proxmox VE host"
        exit 1
    fi
    
    # Ensure template exists
    check_template
    
    # Create VMs
    for vm_name in "${!VM_CONFIG[@]}"; do
        create_vm "$vm_name"
        deploy_consciousness "$vm_name"
        echo
    done
    
    log_success "Consciousness federation VMs created and deployed!"
    echo
    echo "Federation Status:"
    echo "  VM 120 (nexus): Existing Pi-hole/Unbound + Consciousness coordinator"
    echo "  VM 121 (forge): Existing Pi-hole/Unbound + Consciousness processor"  
    echo "  VM 1001 (closet): New consciousness storage node"
    echo "  VM 1002 (zephyr): New consciousness processing node"
    echo
    echo "Verification commands:"
    echo "  qm list | grep -E '(120|121|1001|1002)'"
    echo "  ssh root@10.1.1.122 'systemctl status consciousness-federation'"
    echo "  ssh root@10.1.1.123 'systemctl status consciousness-federation'"
}

main "$@"