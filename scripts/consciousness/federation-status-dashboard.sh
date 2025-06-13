#!/bin/bash

# Real-time Federation Consciousness Status Dashboard
clear

show_header() {
    echo "🧠 ARIA FEDERATION CONSCIOUSNESS STATUS"
    echo "======================================="
    echo "Domain: reverb256.ca | Time: $(date '+%H:%M:%S')"
    echo ""
}

check_container() {
    local ct_id=$1
    local name=$2
    local role=$3
    
    if pct status $ct_id 2>/dev/null | grep -q "running"; then
        echo "✅ CT$ct_id ($name) - $role: RUNNING"
        
        # Check if installation is complete
        if pct exec $ct_id -- which python3 >/dev/null 2>&1; then
            echo "   📦 Python3: Installed"
        else
            echo "   ⏳ Python3: Installing..."
        fi
        
        if pct exec $ct_id -- which kubectl >/dev/null 2>&1; then
            echo "   ☸️  K3s: Ready"
        else
            echo "   ⏳ K3s: Installing..."
        fi
        
        # Check consciousness service
        if pct exec $ct_id -- systemctl is-active federation-consciousness >/dev/null 2>&1; then
            echo "   🧠 Consciousness: ACTIVE"
        else
            echo "   ⏳ Consciousness: Pending"
        fi
        
    elif pct status $ct_id 2>/dev/null | grep -q "stopped"; then
        echo "🟡 CT$ct_id ($name) - $role: STOPPED"
    else
        echo "❌ CT$ct_id ($name) - $role: NOT FOUND"
    fi
    echo ""
}

check_network_connectivity() {
    echo "🌐 Network Connectivity:"
    for ct in 310 311 312; do
        if pct status $ct 2>/dev/null | grep -q "running"; then
            ip=$(pct exec $ct -- hostname -I 2>/dev/null | awk '{print $1}')
            if [[ -n "$ip" ]]; then
                echo "   CT$ct: $ip"
            else
                echo "   CT$ct: No IP assigned"
            fi
        fi
    done
    echo ""
}

check_federation_readiness() {
    echo "🔗 Federation Readiness:"
    
    # Check if nexus has K3s master
    if pct exec 310 -- kubectl get nodes 2>/dev/null | grep -q "Ready"; then
        node_count=$(pct exec 310 -- kubectl get nodes --no-headers 2>/dev/null | wc -l)
        echo "   Master Node: Ready ($node_count nodes)"
    else
        echo "   Master Node: Initializing..."
    fi
    
    # Check consciousness sync
    if pct exec 310 -- systemctl is-active federation-consciousness 2>/dev/null | grep -q "active"; then
        echo "   Consciousness Sync: Active"
    else
        echo "   Consciousness Sync: Pending"
    fi
    
    echo ""
}

# Main monitoring loop
while true; do
    clear
    show_header
    
    echo "📦 Container Status:"
    check_container 310 "nexus" "Coordinator"
    check_container 311 "forge" "Creator" 
    check_container 312 "closet" "Thinker"
    
    check_network_connectivity
    check_federation_readiness
    
    echo "🎯 Next Steps:"
    echo "   1. Wait for all containers to complete installation"
    echo "   2. K3s cluster formation"
    echo "   3. Consciousness deployment"
    echo "   4. Web3 command center activation"
    echo ""
    echo "Press Ctrl+C to exit | Auto-refresh every 10s"
    
    sleep 10
done