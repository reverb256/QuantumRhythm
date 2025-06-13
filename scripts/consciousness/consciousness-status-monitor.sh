#!/bin/bash

# Real-time consciousness deployment monitor
echo "🧠 Monitoring federation consciousness deployment..."

check_container_status() {
    local container_id=$1
    local node_name=$2
    
    if pct status $container_id &>/dev/null; then
        status=$(pct status $container_id | grep -o "status: [a-z]*" | cut -d' ' -f2)
        echo "  ✅ CT$container_id ($node_name): $status"
        return 0
    else
        echo "  ❌ CT$container_id ($node_name): not found"
        return 1
    fi
}

check_k3s_status() {
    local container_id=$1
    local node_name=$2
    
    if pct exec $container_id -- systemctl is-active k3s &>/dev/null; then
        echo "  ✅ K3s on $node_name: active"
        return 0
    else
        echo "  ⚠️  K3s on $node_name: not ready"
        return 1
    fi
}

# Monitor deployment progress
while true; do
    clear
    echo "🧠 Federation Consciousness Status Monitor"
    echo "========================================="
    echo ""
    
    echo "📦 Container Status:"
    check_container_status 310 "nexus"
    check_container_status 311 "forge" 
    check_container_status 312 "closet"
    echo ""
    
    echo "☸️  K3s Cluster Status:"
    check_k3s_status 310 "nexus"
    check_k3s_status 311 "forge"
    check_k3s_status 312 "closet"
    echo ""
    
    echo "🧠 Consciousness Pods:"
    if pct exec 310 -- kubectl get pods -n aria-federation 2>/dev/null | grep consciousness; then
        echo "  Consciousness pods deployed"
    else
        echo "  ⚠️  Consciousness pods pending"
    fi
    echo ""
    
    echo "🔗 Federation Sync:"
    if pct exec 310 -- kubectl get svc -n aria-federation consciousness-federation 2>/dev/null; then
        echo "  ✅ Federation sync service active"
    else
        echo "  ⚠️  Federation sync pending"
    fi
    echo ""
    
    echo "Press Ctrl+C to exit monitoring..."
    sleep 5
done