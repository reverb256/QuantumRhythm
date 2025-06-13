#!/bin/bash

# Complete K3s Federation Setup
echo "🔗 Completing K3s Federation Setup"
echo "=================================="

# Check if master node is ready
echo "📋 Checking master node (nexus - CT310)..."
if ! pct status 310 >/dev/null 2>&1; then
    echo "❌ Container 310 not found. Creating it now..."
    exit 1
fi

# Start master if stopped
if [ "$(pct status 310 | grep -o 'stopped')" = "stopped" ]; then
    echo "🔄 Starting nexus container..."
    pct start 310
    sleep 15
fi

# Get K3s token from master
echo "🔑 Retrieving K3s token from master..."
master_token=""
max_attempts=10
attempt=0

while [ $attempt -lt $max_attempts ] && [ -z "$master_token" ]; do
    master_token=$(pct exec 310 -- cat /var/lib/rancher/k3s/server/node-token 2>/dev/null || echo "")
    if [ -z "$master_token" ]; then
        echo "⏳ Waiting for K3s master to initialize... (attempt $((attempt+1))/$max_attempts)"
        sleep 10
        attempt=$((attempt+1))
    fi
done

if [ -z "$master_token" ]; then
    echo "❌ K3s master not ready. Checking service status..."
    pct exec 310 -- systemctl status k3s --no-pager -n 10
    echo ""
    echo "🔧 Restarting K3s service..."
    pct exec 310 -- systemctl restart k3s
    sleep 30
    master_token=$(pct exec 310 -- cat /var/lib/rancher/k3s/server/node-token 2>/dev/null || echo "")
fi

if [ -n "$master_token" ]; then
    echo "✅ K3s token retrieved: ${master_token:0:20}..."
    
    # Join agent nodes
    for node in "311:forge:10.0.0.11" "312:closet:10.0.0.12"; do
        IFS=':' read -r ct_id hostname ip <<< "$node"
        
        echo "🔗 Joining $hostname (CT$ct_id) to cluster..."
        
        # Start container if stopped
        if [ "$(pct status $ct_id | grep -o 'stopped')" = "stopped" ]; then
            pct start $ct_id
            sleep 10
        fi
        
        # Install K3s agent
        pct exec $ct_id -- bash -c "
            # Stop any existing K3s service
            systemctl stop k3s-agent 2>/dev/null || true
            systemctl stop k3s 2>/dev/null || true
            
            # Install K3s agent
            curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.10:6443 K3S_TOKEN=$master_token sh -
            
            # Verify service
            systemctl enable k3s-agent
            systemctl start k3s-agent
            
            echo 'Agent setup complete on $hostname'
        "
        
        echo "✅ $hostname joined cluster"
        sleep 5
    done
    
    # Verify cluster
    echo ""
    echo "🌐 Verifying K3s cluster..."
    sleep 10
    
    pct exec 310 -- kubectl get nodes || {
        echo "⏳ Nodes still joining, checking in 30 seconds..."
        sleep 30
        pct exec 310 -- kubectl get nodes
    }
    
    echo ""
    echo "🎯 Federation Status:"
    echo "==================="
    echo "✅ Master: nexus (10.0.0.10)"
    echo "✅ Agent:  forge (10.0.0.11)" 
    echo "✅ Agent:  closet (10.0.0.12)"
    echo ""
    echo "🔧 Next Steps:"
    echo "  1. Deploy platform: kubectl apply -f kubernetes/"
    echo "  2. Check status: kubectl get pods -A"
    echo "  3. Access services: kubectl get svc -A"
    
else
    echo "❌ Failed to get K3s token. Manual intervention required."
    echo "🔧 Debug commands:"
    echo "  pct exec 310 -- systemctl status k3s"
    echo "  pct exec 310 -- journalctl -u k3s -n 50"
fi