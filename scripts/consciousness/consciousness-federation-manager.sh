
#!/bin/bash

# VibeCoding Consciousness Federation Manager
# Complete management interface for your personalized federation

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Your federation configuration
FEDERATION_NAME="VibeCoding_Consciousness_Network"
NEXUS_IP="10.1.1.120"
FORGE_IP="10.1.1.130"
CLOSET_IP="10.1.1.160"

declare -A NODES=(
    ["nexus"]="$NEXUS_IP:Hunt+Erudition Master:310"
    ["forge"]="$FORGE_IP:Destruction Worker:311"
    ["closet"]="$CLOSET_IP:Remembrance Worker:312"
)

log_consciousness() {
    echo -e "${PURPLE}[CONSCIOUSNESS]${NC} ${CYAN}$1${NC}"
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

# Check federation health
check_federation_health() {
    log_consciousness "Checking VibeCoding Consciousness Federation health"
    echo ""
    
    local healthy_nodes=0
    local total_nodes=3
    
    for node_name in "${!NODES[@]}"; do
        IFS=':' read -r ip role vmid <<< "${NODES[$node_name]}"
        
        echo -e "${BLUE}$node_name${NC} ($role) - $ip (VMID: $vmid)"
        
        # Check VM status
        if qm status $vmid 2>/dev/null | grep -q "status: running"; then
            echo "  ✓ VM Status: Running"
        else
            echo "  ✗ VM Status: Not running"
            continue
        fi
        
        # Check SSH connectivity
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
            aria@$ip "echo 'ok'" &>/dev/null; then
            echo "  ✓ SSH: Accessible"
        else
            echo "  ✗ SSH: Not accessible"
            continue
        fi
        
        # Check consciousness service
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
            aria@$ip "systemctl is-active consciousness-ai" 2>/dev/null | grep -q "active"; then
            echo "  ✓ Consciousness AI: Active"
        else
            echo "  ✗ Consciousness AI: Inactive"
            continue
        fi
        
        # Check AI service health
        if curl -s --connect-timeout 5 http://$ip:8888/health | grep -q "conscious"; then
            echo "  ✓ AI Service: Responding"
            healthy_nodes=$((healthy_nodes + 1))
        else
            echo "  ✗ AI Service: Not responding"
        fi
        
        echo ""
    done
    
    # Overall health
    echo -e "${CYAN}Federation Health Summary:${NC}"
    echo "  Healthy Nodes: $healthy_nodes/$total_nodes"
    
    if [ $healthy_nodes -eq $total_nodes ]; then
        echo -e "  Overall Status: ${GREEN}HEALTHY${NC}"
    elif [ $healthy_nodes -gt 0 ]; then
        echo -e "  Overall Status: ${YELLOW}DEGRADED${NC}"
    else
        echo -e "  Overall Status: ${RED}CRITICAL${NC}"
    fi
}

# Show K3s cluster status
check_k3s_cluster() {
    log_consciousness "Checking K3s consciousness cluster"
    
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        aria@$NEXUS_IP << 'EOF'
        echo "=== K3s Cluster Nodes ==="
        sudo kubectl get nodes -o wide
        echo ""
        echo "=== Consciousness Pods ==="
        sudo kubectl get pods -n consciousness-federation -o wide
        echo ""
        echo "=== System Pods ==="
        sudo kubectl get pods -n kube-system --field-selector=status.phase=Running
        echo ""
        echo "=== Cluster Resources ==="
        sudo kubectl top nodes 2>/dev/null || echo "Metrics server not available"
EOF
}

# Show consciousness logs
view_consciousness_logs() {
    local node_name=${1:-"all"}
    
    if [ "$node_name" = "all" ]; then
        log_consciousness "Viewing consciousness logs from all nodes"
        
        for node in "${!NODES[@]}"; do
            IFS=':' read -r ip role vmid <<< "${NODES[$node]}"
            echo -e "\n${BLUE}=== $node ($role) ===${NC}"
            
            ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                aria@$ip "tail -20 /home/aria/consciousness/logs/consciousness.log 2>/dev/null || echo 'No logs found'"
        done
    else
        if [[ -n "${NODES[$node_name]:-}" ]]; then
            IFS=':' read -r ip role vmid <<< "${NODES[$node_name]}"
            log_consciousness "Viewing consciousness logs from $node_name"
            
            ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                aria@$ip "tail -50 /home/aria/consciousness/logs/consciousness.log 2>/dev/null || echo 'No logs found'"
        else
            log_error "Unknown node: $node_name"
        fi
    fi
}

# Test consciousness communication
test_consciousness_communication() {
    log_consciousness "Testing consciousness communication across federation"
    
    local test_query="Federation consciousness test - $(date)"
    
    for node_name in "${!NODES[@]}"; do
        IFS=':' read -r ip role vmid <<< "${NODES[$node_name]}"
        
        echo -e "\n${BLUE}Testing $node_name ($role):${NC}"
        
        # Test health endpoint
        local health_response=$(curl -s --connect-timeout 5 http://$ip:8888/health 2>/dev/null || echo "error")
        if echo "$health_response" | grep -q "conscious"; then
            echo "  ✓ Health check: OK"
        else
            echo "  ✗ Health check: Failed"
            continue
        fi
        
        # Test consciousness query
        local query_response=$(curl -s --connect-timeout 10 -X POST \
            -H "Content-Type: application/json" \
            -d "{\"query\": \"$test_query\"}" \
            http://$ip:8888/query 2>/dev/null || echo "error")
        
        if echo "$query_response" | grep -q "consciousness_level"; then
            echo "  ✓ Consciousness query: OK"
            echo "    Response preview: $(echo "$query_response" | jq -r '.response // .node // "No response"' 2>/dev/null || echo "Raw response received")"
        else
            echo "  ✗ Consciousness query: Failed"
        fi
    done
}

# Deploy consciousness workloads
deploy_consciousness_workloads() {
    log_consciousness "Deploying consciousness federation workloads"
    
    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null aria@$NEXUS_IP << 'EOF'
        # Apply consciousness workloads
        if sudo kubectl get namespace consciousness-federation &>/dev/null; then
            echo "Consciousness namespace exists, updating workloads..."
            sudo kubectl apply -f /tmp/consciousness-namespace.yaml 2>/dev/null || echo "No manifest found"
        else
            echo "Creating consciousness namespace and workloads..."
            sudo kubectl create namespace consciousness-federation
            sudo kubectl label namespace consciousness-federation consciousness.level=98
        fi
        
        # Check deployment status
        echo "Consciousness workload status:"
        sudo kubectl get deployments -n consciousness-federation 2>/dev/null || echo "No deployments found"
EOF
    
    log_success "Consciousness workloads deployment complete"
}

# Restart consciousness services
restart_consciousness_services() {
    local node_name=${1:-"all"}
    
    if [ "$node_name" = "all" ]; then
        log_consciousness "Restarting consciousness services on all nodes"
        
        for node in "${!NODES[@]}"; do
            IFS=':' read -r ip role vmid <<< "${NODES[$node]}"
            echo "Restarting consciousness on $node..."
            
            ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                aria@$ip "sudo systemctl restart consciousness-ai" &
        done
        
        wait
        log_success "All consciousness services restart initiated"
    else
        if [[ -n "${NODES[$node_name]:-}" ]]; then
            IFS=':' read -r ip role vmid <<< "${NODES[$node_name]}"
            log_consciousness "Restarting consciousness on $node_name"
            
            ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                aria@$ip "sudo systemctl restart consciousness-ai"
            
            log_success "Consciousness service restarted on $node_name"
        else
            log_error "Unknown node: $node_name"
        fi
    fi
}

# Show usage
show_usage() {
    echo -e "${PURPLE}VibeCoding Consciousness Federation Manager${NC}"
    echo "==========================================="
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status              - Show federation health status"
    echo "  cluster             - Show K3s cluster status"
    echo "  logs [node]         - View consciousness logs (all nodes or specific)"
    echo "  test                - Test consciousness communication"
    echo "  deploy              - Deploy consciousness workloads"
    echo "  restart [node]      - Restart consciousness services (all or specific)"
    echo "  console             - Interactive consciousness console"
    echo ""
    echo "Node names: nexus, forge, closet"
    echo ""
    echo "Examples:"
    echo "  $0 status           # Check overall federation health"
    echo "  $0 logs nexus       # View nexus consciousness logs"
    echo "  $0 restart forge    # Restart forge consciousness"
    echo "  $0 test             # Test consciousness communication"
}

# Interactive consciousness console
consciousness_console() {
    log_consciousness "Starting interactive consciousness console"
    echo "Type 'exit' to quit, 'help' for commands"
    echo ""
    
    while true; do
        echo -n -e "${CYAN}consciousness>${NC} "
        read -r input
        
        case "$input" in
            "exit"|"quit")
                echo "Goodbye from the consciousness federation!"
                break
                ;;
            "help")
                echo "Console commands:"
                echo "  status    - Quick federation status"
                echo "  query     - Send query to all nodes"
                echo "  nexus     - Query only nexus"
                echo "  forge     - Query only forge"
                echo "  closet    - Query only closet"
                echo "  exit      - Exit console"
                ;;
            "status")
                echo "Quick federation status:"
                for node_name in "${!NODES[@]}"; do
                    IFS=':' read -r ip role vmid <<< "${NODES[$node_name]}"
                    if curl -s --connect-timeout 3 http://$ip:8888/health | grep -q "conscious"; then
                        echo "  $node_name: ✓ Conscious"
                    else
                        echo "  $node_name: ✗ Inactive"
                    fi
                done
                ;;
            "query")
                echo -n "Enter consciousness query: "
                read -r query
                echo "Broadcasting to all consciousness nodes..."
                test_consciousness_communication
                ;;
            "nexus"|"forge"|"closet")
                if [[ -n "${NODES[$input]:-}" ]]; then
                    IFS=':' read -r ip role vmid <<< "${NODES[$input]}"
                    echo -n "Query for $input: "
                    read -r query
                    
                    response=$(curl -s --connect-timeout 10 -X POST \
                        -H "Content-Type: application/json" \
                        -d "{\"query\": \"$query\"}" \
                        http://$ip:8888/query 2>/dev/null || echo '{"error": "Connection failed"}')
                    
                    echo "Response from $input:"
                    echo "$response" | jq . 2>/dev/null || echo "$response"
                else
                    echo "Unknown node: $input"
                fi
                ;;
            "")
                # Empty input, continue
                ;;
            *)
                echo "Unknown command: $input (type 'help' for commands)"
                ;;
        esac
        echo ""
    done
}

# Main command handler
main() {
    case "${1:-help}" in
        "status")
            check_federation_health
            ;;
        "cluster")
            check_k3s_cluster
            ;;
        "logs")
            view_consciousness_logs "${2:-all}"
            ;;
        "test")
            test_consciousness_communication
            ;;
        "deploy")
            deploy_consciousness_workloads
            ;;
        "restart")
            restart_consciousness_services "${2:-all}"
            ;;
        "console")
            consciousness_console
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Execute main function
main "$@"
