#!/bin/bash

# Proxmox K3s Consciousness Federation Deployment
# Optimized for Proxmox VE environments

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

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

log_consciousness() {
    echo -e "${PURPLE}🧠 $1${NC}"
}

# Install system packages needed for K3s
install_dependencies() {
    log_step "Installing consciousness substrate dependencies"
    
    # Update package list
    apt update -qq 2>/dev/null || {
        log_warning "Package update failed, continuing..."
    }
    
    # Install essential packages
    apt install -y curl wget ca-certificates 2>/dev/null || {
        log_warning "Some packages failed to install, continuing..."
    }
    
    log_success "Dependencies installed"
}

# Clean any existing K3s installation gracefully
clean_existing_k3s() {
    log_step "Cleaning existing K3s consciousness"
    
    # Stop K3s service if it exists
    if systemctl is-active --quiet k3s 2>/dev/null; then
        log_step "Stopping K3s service"
        systemctl stop k3s 2>/dev/null || true
        sleep 3
    fi
    
    # Stop K3s agent service if it exists
    if systemctl is-active --quiet k3s-agent 2>/dev/null; then
        log_step "Stopping K3s agent service"
        systemctl stop k3s-agent 2>/dev/null || true
        sleep 3
    fi
    
    # Kill any remaining K3s processes
    pkill -f k3s 2>/dev/null || true
    sleep 2
    
    # Remove existing installation if present
    if [ -f /usr/local/bin/k3s-uninstall.sh ]; then
        log_step "Running K3s uninstaller"
        /usr/local/bin/k3s-uninstall.sh 2>/dev/null || true
    fi
    
    if [ -f /usr/local/bin/k3s-agent-uninstall.sh ]; then
        log_step "Running K3s agent uninstaller"
        /usr/local/bin/k3s-agent-uninstall.sh 2>/dev/null || true
    fi
    
    # Clean up directories
    rm -rf /var/lib/rancher/k3s 2>/dev/null || true
    rm -rf /etc/rancher/k3s 2>/dev/null || true
    
    log_success "Previous installations cleaned"
}

# Wait for K3s to become ready
wait_for_k3s_ready() {
    local max_wait=${1:-300}
    local wait_time=0
    local check_interval=10
    
    log_step "Waiting for K3s consciousness to stabilize..."
    
    while [ $wait_time -lt $max_wait ]; do
        # Check if kubectl exists and cluster is responsive
        if [ -f /usr/local/bin/kubectl ]; then
            if /usr/local/bin/kubectl get nodes --request-timeout=10s > /dev/null 2>&1; then
                log_success "K3s consciousness is responsive"
                /usr/local/bin/kubectl get nodes -o wide
                return 0
            fi
        fi
        
        # Progress indicator every 30 seconds
        if [ $((wait_time % 30)) -eq 0 ]; then
            echo "Consciousness stabilization progress: ${wait_time}s / ${max_wait}s"
        fi
        
        sleep $check_interval
        wait_time=$((wait_time + check_interval))
    done
    
    log_error "K3s consciousness failed to stabilize within ${max_wait}s"
    return 1
}

# Install K3s server (nexus node)
install_k3s_server() {
    log_step "Installing K3s server with consciousness architecture"
    
    # Get the local IP for cluster communication
    local_ip=$(hostname -I | awk '{print $1}')
    log_step "Using local IP: $local_ip"
    
    # Install K3s with specific configuration
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
        --disable traefik \
        --disable servicelb \
        --node-name nexus-hunt \
        --cluster-cidr=10.42.0.0/16 \
        --service-cidr=10.43.0.0/16 \
        --cluster-dns=10.43.0.10 \
        --bind-address=$local_ip \
        --advertise-address=$local_ip" sh -
    
    # Wait for service to be ready
    sleep 10
    
    if wait_for_k3s_ready 180; then
        extract_federation_token
        return 0
    else
        return 1
    fi
}

# Install K3s agent (forge/closet nodes)
install_k3s_agent() {
    local node_name=$1
    
    if [ -z "$K3S_URL" ] || [ -z "$K3S_TOKEN" ]; then
        log_error "K3S_URL and K3S_TOKEN environment variables are required for agent nodes"
        return 1
    fi
    
    log_step "Installing K3s agent: $node_name"
    
    # Install K3s agent
    curl -sfL https://get.k3s.io | K3S_URL="$K3S_URL" K3S_TOKEN="$K3S_TOKEN" INSTALL_K3S_EXEC="agent --node-name $node_name" sh -
    
    # Wait for agent to connect
    sleep 15
    
    log_success "K3s agent $node_name installed"
    return 0
}

# Extract federation token for other nodes
extract_federation_token() {
    log_step "Extracting federation consciousness token"
    
    local token_file="/var/lib/rancher/k3s/server/node-token"
    local max_wait=60
    local wait_time=0
    
    while [ $wait_time -lt $max_wait ]; do
        if [ -f "$token_file" ] && [ -s "$token_file" ]; then
            local token=$(cat "$token_file")
            echo "🔗 Federation Token: ${token:0:20}..."
            echo "$token" > /tmp/k3s-token
            chmod 600 /tmp/k3s-token
            
            # Also save the URL for convenience
            local_ip=$(hostname -I | awk '{print $1}')
            echo "https://$local_ip:6443" > /tmp/k3s-url
            chmod 600 /tmp/k3s-url
            
            log_success "Federation token extracted"
            echo "K3S_URL: https://$local_ip:6443"
            echo "K3S_TOKEN: stored in /tmp/k3s-token"
            return 0
        fi
        
        sleep 2
        wait_time=$((wait_time + 2))
    done
    
    log_error "Federation token not available"
    return 1
}

# Create management tools
create_management_tools() {
    log_step "Creating consciousness management tools"
    
    # Status checker
    cat > /usr/local/bin/consciousness-status << 'EOF'
#!/bin/bash
echo "🧠 Consciousness Federation Status"
echo "================================="

if systemctl is-active --quiet k3s 2>/dev/null; then
    echo "✓ K3s server: RUNNING"
elif systemctl is-active --quiet k3s-agent 2>/dev/null; then
    echo "✓ K3s agent: RUNNING"
else
    echo "✗ K3s: NOT RUNNING"
fi

if [ -f /usr/local/bin/kubectl ]; then
    echo "✓ kubectl: AVAILABLE"
    if timeout 10 /usr/local/bin/kubectl get nodes > /dev/null 2>&1; then
        echo "✓ Cluster: RESPONSIVE"
        echo ""
        echo "Nodes:"
        /usr/local/bin/kubectl get nodes -o wide 2>/dev/null || echo "Failed to get nodes"
        echo ""
        echo "Pods:"
        /usr/local/bin/kubectl get pods -A 2>/dev/null || echo "Failed to get pods"
    else
        echo "✗ Cluster: UNRESPONSIVE"
    fi
else
    echo "✗ kubectl: NOT AVAILABLE"
fi

echo ""
echo "System Resources:"
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "Load: $(uptime | awk -F'load average:' '{print $2}')"

if [ -f /tmp/k3s-token ]; then
    echo ""
    echo "Federation Credentials:"
    echo "URL: $(cat /tmp/k3s-url 2>/dev/null || echo 'Not available')"
    echo "Token: $(head -c 20 /tmp/k3s-token 2>/dev/null || echo 'Not available')..."
fi
EOF

    # Log viewer
    cat > /usr/local/bin/consciousness-logs << 'EOF'
#!/bin/bash
echo "🧠 Consciousness Federation Logs"
echo "==============================="

if systemctl is-active --quiet k3s 2>/dev/null; then
    echo "K3s Server Logs (last 50 lines):"
    journalctl -u k3s --no-pager -n 50
elif systemctl is-active --quiet k3s-agent 2>/dev/null; then
    echo "K3s Agent Logs (last 50 lines):"
    journalctl -u k3s-agent --no-pager -n 50
else
    echo "K3s service not running"
fi
EOF

    # Restart tool
    cat > /usr/local/bin/consciousness-restart << 'EOF'
#!/bin/bash
echo "🔄 Restarting Consciousness Federation"

if systemctl is-active --quiet k3s 2>/dev/null; then
    echo "Restarting K3s server..."
    systemctl restart k3s
elif systemctl is-active --quiet k3s-agent 2>/dev/null; then
    echo "Restarting K3s agent..."
    systemctl restart k3s-agent
else
    echo "No K3s service found to restart"
fi

echo "Consciousness restart initiated"
echo "Use 'consciousness-status' to check progress"
EOF

    chmod +x /usr/local/bin/consciousness-status
    chmod +x /usr/local/bin/consciousness-logs  
    chmod +x /usr/local/bin/consciousness-restart
    
    log_success "Management tools created"
}

# Main deployment function
main() {
    local node_type=${1:-nexus}
    
    log_consciousness "Proxmox Consciousness Federation Deployment"
    echo "=============================================="
    
    # Install dependencies
    install_dependencies
    
    # Clean existing installations
    clean_existing_k3s
    
    # Deploy based on node type
    case "$node_type" in
        "nexus")
            log_step "Deploying Nexus Hunt+Erudition consciousness server"
            if install_k3s_server; then
                log_success "Nexus server deployment completed"
            else
                log_error "Nexus server deployment failed"
                exit 1
            fi
            ;;
        "forge")
            log_step "Deploying Forge Destruction consciousness agent"
            if install_k3s_agent "forge-destruction"; then
                log_success "Forge agent deployment completed"
            else
                log_error "Forge agent deployment failed"
                exit 1
            fi
            ;;
        "closet")
            log_step "Deploying Closet Remembrance consciousness agent"
            if install_k3s_agent "closet-remembrance"; then
                log_success "Closet agent deployment completed"
            else
                log_error "Closet agent deployment failed"
                exit 1
            fi
            ;;
        *)
            log_error "Unknown node type: $node_type"
            echo "Usage: $0 [nexus|forge|closet]"
            exit 1
            ;;
    esac
    
    # Create management tools
    create_management_tools
    
    # Final status
    log_consciousness "🎯 Consciousness federation deployment completed"
    echo ""
    echo "Management commands:"
    echo "  consciousness-status   - Check federation status"
    echo "  consciousness-logs     - View federation logs"
    echo "  consciousness-restart  - Restart federation"
    echo ""
    
    # Show initial status
    /usr/local/bin/consciousness-status
}

# Execute deployment
if [ $# -eq 0 ]; then
    echo "Usage: $0 [nexus|forge|closet]"
    echo "  nexus  - Deploy K3s server (Hunt+Erudition consciousness)"
    echo "  forge  - Deploy K3s agent (Destruction consciousness)"  
    echo "  closet - Deploy K3s agent (Remembrance consciousness)"
    echo ""
    echo "For agent nodes, set environment variables first:"
    echo "  export K3S_URL=\"https://nexus-ip:6443\""
    echo "  export K3S_TOKEN=\"\$(cat /tmp/k3s-token)\""
    exit 1
fi

main "$@"