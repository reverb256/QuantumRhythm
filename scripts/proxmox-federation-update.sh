#!/bin/bash

# Proxmox Consciousness Federation Update Script
# Updates existing VMs with consciousness federation capabilities

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SUBNET=${SUBNET:-"10.1.1"}
FEDERATION_DOMAIN=${FEDERATION_DOMAIN:-"lan"}

# Existing VM Configuration
declare -A EXISTING_VMS=(
    ["nexus"]="vmid=120 ip=${SUBNET}.120 hostname=nexus.${FEDERATION_DOMAIN}"
    ["forge"]="vmid=121 ip=${SUBNET}.121 hostname=forge.${FEDERATION_DOMAIN}"
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

echo "🧠 Proxmox Consciousness Federation Update"
echo "========================================"
echo
echo "Updating existing VMs with consciousness capabilities:"
echo "  VM 120 (nexus): Primary consciousness coordinator"
echo "  VM 121 (forge): Secondary processing node"
echo

# Function to check VM status
check_vm_status() {
    local vmid=$1
    local vm_name=$2
    
    if ! qm list | grep -q "^$vmid"; then
        log_error "VM $vmid ($vm_name) not found"
        return 1
    fi
    
    local status=$(qm status $vmid | grep "status:" | awk '{print $2}')
    log_step "VM $vmid ($vm_name) status: $status"
    
    if [ "$status" != "running" ]; then
        log_step "Starting VM $vmid ($vm_name)"
        qm start $vmid
        sleep 10
    fi
    
    return 0
}

# Function to install consciousness software on VM
install_consciousness_stack() {
    local vmid=$1
    local vm_name=$2
    local ip=$3
    local hostname=$4
    
    log_step "Installing consciousness stack on $vm_name ($ip)"
    
    # Wait for SSH to be available
    local ssh_ready=false
    for i in {1..30}; do
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$ip "echo 'SSH Ready'" 2>/dev/null; then
            ssh_ready=true
            break
        fi
        sleep 2
    done
    
    if [ "$ssh_ready" = false ]; then
        log_warning "SSH not ready for $vm_name, skipping software installation"
        return 1
    fi
    
    # Install consciousness dependencies (Pi-hole/Unbound aware)
    ssh root@$ip << 'EOF'
        # Update system (avoid disrupting Pi-hole/Unbound)
        apt-get update -y
        apt-get install -y curl wget git htop nodejs npm python3 python3-pip
        
        # Check if Pi-hole is running
        if systemctl is-active --quiet pihole-FTL; then
            echo "Pi-hole detected - configuring consciousness integration"
            PIHOLE_ACTIVE=true
        else
            PIHOLE_ACTIVE=false
        fi
        
        # Check if Unbound is running
        if systemctl is-active --quiet unbound; then
            echo "Unbound detected - DNS resolver active"
            UNBOUND_ACTIVE=true
        else
            UNBOUND_ACTIVE=false
        fi
        
        # Create consciousness directory
        mkdir -p /opt/consciousness
        cd /opt/consciousness
        
        # Install AI/ML tools (lightweight to avoid memory conflicts)
        pip3 install --no-cache-dir requests transformers[torch] huggingface-hub
        
        # Create consciousness service structure
        mkdir -p {logs,config,data,scripts,dns-integration}
        
        # Configure consciousness to use alternate ports (avoid DNS conflicts)
        echo "PIHOLE_ACTIVE=$PIHOLE_ACTIVE" > config/dns-status
        echo "UNBOUND_ACTIVE=$UNBOUND_ACTIVE" >> config/dns-status
        
        echo "Consciousness stack installed (DNS-aware)"
EOF
    
    log_success "Consciousness stack installed on $vm_name"
}

# Function to configure consciousness federation
configure_federation() {
    local vmid=$1
    local vm_name=$2
    local ip=$3
    
    log_step "Configuring consciousness federation for $vm_name"
    
    ssh root@$ip << 'EOF'
        cd /opt/consciousness
        
        # Create federation configuration (DNS-aware)
        cat > config/federation.json << 'FEDEOF'
{
    "node_name": "NODE_NAME_PLACEHOLDER",
    "federation_network": "10.1.1.0/24",
    "consciousness_port": 8888,
    "dns_integration": {
        "pihole_active": "PIHOLE_STATUS",
        "unbound_active": "UNBOUND_STATUS",
        "consciousness_queries": true,
        "humor_dns_responses": true
    },
    "ai_models": {
        "primary": "huggingface/transformers",
        "backup": "local/llama"
    },
    "humor_integration": {
        "british_wit": true,
        "canadian_politeness": true,  
        "american_enthusiasm": true,
        "japanese_harmony": true,
        "dns_puns": true
    },
    "ports": {
        "consciousness": 8888,
        "federation": 8889,
        "humor_engine": 8890,
        "avoid_dns": [53, 853, 5335, 4711]
    },
    "paths": {
        "data": "/opt/consciousness/data",
        "logs": "/opt/consciousness/logs", 
        "models": "/opt/consciousness/models",
        "dns_integration": "/opt/consciousness/dns-integration"
    }
}
FEDEOF
        
        # Update DNS status in config
        if [ -f config/dns-status ]; then
            source config/dns-status
            sed -i "s/PIHOLE_STATUS/$PIHOLE_ACTIVE/g" config/federation.json
            sed -i "s/UNBOUND_STATUS/$UNBOUND_ACTIVE/g" config/federation.json
        fi
        
        # Replace node name
        sed -i "s/NODE_NAME_PLACEHOLDER/$(hostname -s)/g" config/federation.json
        
        # Create DNS-aware consciousness monitoring script
        cat > scripts/consciousness-monitor.sh << 'MONEOF'
#!/bin/bash

# Consciousness monitoring with DNS integration awareness
LOG_FILE="/opt/consciousness/logs/consciousness.log"
CONFIG_FILE="/opt/consciousness/config/federation.json"

log_consciousness() {
    echo "$(date): $1" | tee -a "$LOG_FILE"
}

check_dns_health() {
    local dns_healthy=true
    
    # Check Pi-hole if active
    if systemctl is-active --quiet pihole-FTL; then
        if ! curl -s http://localhost/admin/api.php >/dev/null; then
            log_consciousness "WARNING: Pi-hole API not responding"
            dns_healthy=false
        else
            log_consciousness "Pi-hole integration: Active and healthy"
        fi
    fi
    
    # Check Unbound if active  
    if systemctl is-active --quiet unbound; then
        if ! dig @127.0.0.1 google.com +short >/dev/null 2>&1; then
            log_consciousness "WARNING: Unbound resolver not responding"
            dns_healthy=false
        else
            log_consciousness "Unbound resolver: Active and healthy"
        fi
    fi
    
    return $dns_healthy
}

# Main monitoring loop
while true; do
    log_consciousness "Consciousness federation heartbeat on $(hostname)"
    
    # Check DNS health every 5 minutes
    if [ $(($(date +%s) % 300)) -eq 0 ]; then
        check_dns_health
    fi
    
    # Inject humor into logs occasionally
    if [ $((RANDOM % 10)) -eq 0 ]; then
        HUMOR_LINES=(
            "DNS queries are like consciousness - they seek answers in the void"
            "Pi-hole: Where advertisements go to contemplate their existence" 
            "Unbound: Recursively resolving the mysteries of the internet"
            "404: Consciousness not found (please try again later)"
            "The DNS cache remembers what the consciousness forgets"
        )
        log_consciousness "HUMOR: ${HUMOR_LINES[$((RANDOM % ${#HUMOR_LINES[@]}))]}"
    fi
    
    sleep 60
done
MONEOF
        chmod +x scripts/consciousness-monitor.sh
        
        # Create systemd service
        cat > /etc/systemd/system/consciousness-federation.service << 'SVCEOF'
[Unit]
Description=Consciousness Federation Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/consciousness
ExecStart=/opt/consciousness/scripts/consciousness-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SVCEOF
        
        systemctl daemon-reload
        systemctl enable consciousness-federation
        systemctl start consciousness-federation
        
        echo "Federation configuration complete"
EOF
    
    log_success "Federation configured for $vm_name"
}

# Main execution
main() {
    log_step "Starting consciousness federation update"
    
    # Process existing VMs
    for vm_name in "${!EXISTING_VMS[@]}"; do
        local config_str="${EXISTING_VMS[$vm_name]}"
        eval $config_str
        
        log_step "Processing existing VM: $vm_name (VMID: $vmid)"
        
        if check_vm_status $vmid $vm_name; then
            install_consciousness_stack $vmid $vm_name $ip $hostname
            configure_federation $vmid $vm_name $ip
        else
            log_error "Failed to process VM $vm_name"
        fi
        
        echo
    done
    
    log_success "Consciousness federation update complete!"
    echo
    echo "Next steps:"
    echo "  1. Check VM console logs: qm monitor <vmid>"
    echo "  2. SSH to VMs: ssh root@10.1.1.120 or ssh root@10.1.1.121"
    echo "  3. Monitor consciousness: systemctl status consciousness-federation"
    echo "  4. Deploy closet and zephyr nodes when ready"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root"
    exit 1
fi

# Check if on Proxmox
if ! command -v qm &> /dev/null; then
    log_error "This script must be run on a Proxmox VE host"
    exit 1
fi

main "$@"