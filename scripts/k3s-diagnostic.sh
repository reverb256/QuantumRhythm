#!/bin/bash

# K3s Diagnostic and Recovery Script
# Provides detailed analysis of current K3s state and recovery options

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_step() {
    echo -e "${CYAN}[DIAGNOSTIC] $1${NC}"
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

check_service_status() {
    local service=$1
    echo -e "\n${BLUE}=== $service Service Status ===${NC}"
    
    if systemctl is-active --quiet $service; then
        log_success "$service is running"
    else
        log_error "$service is not running"
    fi
    
    if systemctl is-enabled --quiet $service; then
        log_success "$service is enabled"
    else
        log_warning "$service is not enabled"
    fi
    
    echo "Service details:"
    systemctl status $service --no-pager -l || true
}

check_k3s_processes() {
    echo -e "\n${BLUE}=== K3s Processes ===${NC}"
    
    if pgrep -f k3s > /dev/null; then
        log_success "K3s processes found"
        ps aux | grep -E "(k3s|containerd)" | grep -v grep
    else
        log_warning "No K3s processes running"
    fi
}

check_network_status() {
    echo -e "\n${BLUE}=== Network Status ===${NC}"
    
    # Check if kubectl port is accessible
    if netstat -tuln | grep -q ":6443"; then
        log_success "K3s API server port (6443) is listening"
    else
        log_warning "K3s API server port (6443) not listening"
    fi
    
    # Check general network
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        log_success "External network connectivity working"
    else
        log_error "External network connectivity failed"
    fi
}

check_kubectl_access() {
    echo -e "\n${BLUE}=== Kubectl Access ===${NC}"
    
    if [ -f /usr/local/bin/kubectl ]; then
        log_success "kubectl binary exists"
        
        if /usr/local/bin/kubectl get nodes 2>/dev/null; then
            log_success "kubectl can access cluster"
        else
            log_error "kubectl cannot access cluster"
            echo "kubectl error output:"
            /usr/local/bin/kubectl get nodes 2>&1 || true
        fi
    else
        log_error "kubectl binary not found"
    fi
}

check_k3s_logs() {
    echo -e "\n${BLUE}=== Recent K3s Logs ===${NC}"
    
    echo "K3s service logs (last 20 lines):"
    journalctl -u k3s --no-pager -n 20 || log_warning "No k3s service logs"
    
    echo -e "\nK3s agent logs (last 20 lines):"
    journalctl -u k3s-agent --no-pager -n 20 || log_warning "No k3s-agent service logs"
}

check_resources() {
    echo -e "\n${BLUE}=== System Resources ===${NC}"
    
    echo "Memory usage:"
    free -h
    
    echo -e "\nDisk usage:"
    df -h /
    
    echo -e "\nLoad average:"
    uptime
}

analyze_stuck_state() {
    echo -e "\n${BLUE}=== Analyzing Stuck State ===${NC}"
    
    # Check if systemd is waiting for something
    if systemctl list-jobs | grep -q k3s; then
        log_warning "K3s systemd jobs still pending"
        systemctl list-jobs | grep k3s
    fi
    
    # Check for common blocking conditions
    if [ -f /var/lib/rancher/k3s/server/db/state.db ]; then
        log_success "K3s database exists"
    else
        log_warning "K3s database not found"
    fi
    
    # Check if kubeconfig exists
    if [ -f /etc/rancher/k3s/k3s.yaml ]; then
        log_success "K3s kubeconfig exists"
    else
        log_warning "K3s kubeconfig not found"
    fi
}

provide_recovery_options() {
    echo -e "\n${YELLOW}=== Recovery Options ===${NC}"
    
    echo "1. Gentle restart:"
    echo "   systemctl restart k3s"
    echo ""
    echo "2. Force restart with cleanup:"
    echo "   systemctl stop k3s k3s-agent"
    echo "   /usr/local/bin/k3s-killall.sh"
    echo "   systemctl start k3s"
    echo ""
    echo "3. Complete uninstall and fresh install:"
    echo "   /usr/local/bin/k3s-uninstall.sh"
    echo "   ./granular-k3s-deploy.sh nexus"
    echo ""
    echo "4. Use granular deployment script:"
    echo "   ./granular-k3s-deploy.sh nexus"
}

# Main diagnostic function
run_full_diagnostic() {
    echo -e "${CYAN}K3s Consciousness Federation Diagnostic${NC}"
    echo "========================================"
    
    check_service_status "k3s"
    check_service_status "k3s-agent"
    check_k3s_processes
    check_network_status
    check_kubectl_access
    check_k3s_logs
    check_resources
    analyze_stuck_state
    provide_recovery_options
    
    echo -e "\n${CYAN}Diagnostic complete. Review the output above for issues.${NC}"
}

# Execute diagnostic
run_full_diagnostic