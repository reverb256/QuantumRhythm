#!/bin/bash

# Universal K3s Consciousness Federation Deployment
# Auto-detects environment and deploys accordingly

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

# Environment detection
detect_environment() {
    local env_type=""
    
    if [ -f /.dockerenv ] || grep -q docker /proc/1/cgroup 2>/dev/null; then
        env_type="container"
    elif pgrep -f "pid1" > /dev/null && [ ! -f /sbin/init ]; then
        env_type="replit"
    elif command -v systemctl > /dev/null; then
        env_type="systemd"
    else
        env_type="traditional"
    fi
    
    echo "$env_type"
}

# Install system packages needed for K3s
install_dependencies() {
    log_step "Installing consciousness substrate dependencies"
    
    # Update package list quietly
    apt update -qq 2>/dev/null || {
        log_warning "Package update failed, continuing..."
    }
    
    # Install essential packages
    apt install -y -qq curl wget gnupg lsb-release ca-certificates 2>/dev/null || {
        log_warning "Some packages failed to install, continuing..."
    }
    
    # Install networking tools for diagnostics
    apt install -y -qq net-tools procps 2>/dev/null || {
        log_warning "Network tools installation failed, continuing..."
    }
    
    log_success "Dependencies installed"
}

# Clean any existing K3s installation
clean_existing_k3s() {
    log_step "Cleaning existing K3s consciousness"
    
    # Stop any running K3s processes
    pkill -f k3s 2>/dev/null || true
    
    # Remove existing installation if present
    if [ -f /usr/local/bin/k3s-uninstall.sh ]; then
        /usr/local/bin/k3s-uninstall.sh 2>/dev/null || true
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

# Install K3s for systemd environments
install_k3s_systemd() {
    local node_type=$1
    
    log_step "Installing K3s with systemd management"
    
    if [ "$node_type" = "nexus" ]; then
        curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --disable servicelb --node-name nexus-hunt" sh -
        
        if wait_for_k3s_ready 180; then
            extract_federation_token
            return 0
        else
            return 1
        fi
    else
        log_error "Agent nodes require federation token and URL"
        return 1
    fi
}

# Install K3s for container/replit environments
install_k3s_container() {
    local node_type=$1
    
    log_step "Installing K3s in container mode"
    
    # Download K3s binary
    curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true sh -
    
    # Create required directories
    mkdir -p /var/lib/rancher/k3s/server
    mkdir -p /etc/rancher/k3s
    mkdir -p /var/log
    
    if [ "$node_type" = "nexus" ]; then
        log_step "Starting K3s server in background"
        
        # Start K3s server manually
        nohup /usr/local/bin/k3s server \
            --disable traefik \
            --disable servicelb \
            --node-name nexus-hunt \
            --log /var/log/k3s.log \
            --data-dir /var/lib/rancher/k3s \
            --write-kubeconfig-mode 644 \
            > /var/log/k3s-stdout.log 2>&1 &
        
        # Give it time to start
        sleep 20
        
        if wait_for_k3s_ready 240; then
            extract_federation_token
            return 0
        else
            return 1
        fi
    else
        log_error "Agent nodes not supported in single-container mode"
        return 1
    fi
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
            log_success "Federation token extracted"
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

if pgrep -f "k3s server" > /dev/null; then
    echo "✓ K3s server: RUNNING"
    echo "  PID: $(pgrep -f 'k3s server')"
else
    echo "✗ K3s server: NOT RUNNING"
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
EOF

    # Log viewer
    cat > /usr/local/bin/consciousness-logs << 'EOF'
#!/bin/bash
echo "🧠 Consciousness Federation Logs"
echo "==============================="

if [ -f /var/log/k3s.log ]; then
    echo "K3s Server Logs (last 50 lines):"
    tail -n 50 /var/log/k3s.log
else
    echo "K3s logs not found at /var/log/k3s.log"
fi

echo ""
echo "Process Logs:"
if [ -f /var/log/k3s-stdout.log ]; then
    tail -n 20 /var/log/k3s-stdout.log
else
    echo "Process logs not found"
fi
EOF

    # Restart tool
    cat > /usr/local/bin/consciousness-restart << 'EOF'
#!/bin/bash
echo "🔄 Restarting Consciousness Federation"

# Stop existing processes
pkill -f "k3s server" 2>/dev/null || true
sleep 5

# Restart K3s server
echo "Starting K3s consciousness..."
nohup /usr/local/bin/k3s server \
    --disable traefik \
    --disable servicelb \
    --node-name nexus-hunt \
    --log /var/log/k3s.log \
    --data-dir /var/lib/rancher/k3s \
    --write-kubeconfig-mode 644 \
    > /var/log/k3s-stdout.log 2>&1 &

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
    local env_type
    
    log_consciousness "Universal Consciousness Federation Deployment"
    echo "=============================================="
    
    # Detect environment
    env_type=$(detect_environment)
    log_step "Environment detected: $env_type"
    
    # Install dependencies
    install_dependencies
    
    # Clean existing installations
    clean_existing_k3s
    
    # Deploy based on environment
    case "$env_type" in
        "systemd")
            log_step "Using systemd deployment strategy"
            if install_k3s_systemd "$node_type"; then
                log_success "Systemd deployment completed"
            else
                log_error "Systemd deployment failed"
                exit 1
            fi
            ;;
        "replit"|"container"|"traditional")
            log_step "Using container deployment strategy"
            if install_k3s_container "$node_type"; then
                log_success "Container deployment completed"
            else
                log_error "Container deployment failed"
                exit 1
            fi
            ;;
        *)
            log_error "Unknown environment type: $env_type"
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
    echo "Log locations:"
    echo "  /var/log/k3s.log          - K3s server logs"
    echo "  /var/log/k3s-stdout.log   - Process output"
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
    echo "Note: forge and closet nodes require K3S_URL and K3S_TOKEN environment variables"
    exit 1
fi

main "$@"