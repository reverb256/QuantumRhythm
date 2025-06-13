#!/bin/bash

# Check Proxmox Federation Deployment Status
echo "🔍 Checking Proxmox AI Federation Status"
echo "========================================"

# Container IDs to check
CONTAINERS=(310 311 312)
HOSTNAMES=("nexus" "forge" "closet")
ROLES=("Coordinator" "Creator" "Thinker")

echo "📋 Container Status:"
for i in "${!CONTAINERS[@]}"; do
    ct_id=${CONTAINERS[$i]}
    hostname=${HOSTNAMES[$i]}
    role=${ROLES[$i]}
    
    if pct status $ct_id >/dev/null 2>&1; then
        status=$(pct status $ct_id | grep -o 'running\|stopped')
        echo "  ✅ CT$ct_id ($hostname) - $role: $status"
        
        if [ "$status" = "running" ]; then
            # Check K3s status
            k3s_status="inactive"
            if pct exec $ct_id -- systemctl is-active k3s >/dev/null 2>&1; then
                k3s_status="master"
            elif pct exec $ct_id -- systemctl is-active k3s-agent >/dev/null 2>&1; then
                k3s_status="agent"
            fi
            echo "    🔧 K3s: $k3s_status"
            
            # Check consciousness service
            if pct exec $ct_id -- systemctl is-active consciousness >/dev/null 2>&1; then
                echo "    🧠 Consciousness: active"
            else
                echo "    ⏳ Consciousness: inactive"
            fi
        fi
    else
        echo "  ❌ CT$ct_id ($hostname) - $role: not found"
    fi
done

echo ""
echo "🌐 K3s Cluster Status:"
if pct status 310 >/dev/null 2>&1 && [ "$(pct status 310 | grep -o 'running')" = "running" ]; then
    echo "Checking cluster nodes..."
    pct exec 310 -- kubectl get nodes 2>/dev/null || echo "  ⏳ K3s master not ready yet"
else
    echo "  ❌ Master node (nexus) not accessible"
fi

echo ""
echo "🔧 Quick Actions:"
echo "  Start all containers: for ct in 310 311 312; do pct start \$ct; done"
echo "  Check logs: pct exec 310 -- journalctl -u k3s --no-pager -n 20"
echo "  SSH to nexus: pct enter 310"
echo ""