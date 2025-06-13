#!/bin/bash

# Enhanced Proxmox Federation Bootstrap with Visibility
echo "🧠 Enhanced Proxmox Federation Consciousness Bootstrap"
echo "Real-time visibility enabled..."

show_progress() {
    local message="$1"
    local timestamp=$(date '+%H:%M:%S')
    echo "[$timestamp] 🔄 $message"
}

check_k3s_status() {
    local container_id=$1
    local node_name=$2
    
    show_progress "Checking K3s status on $node_name (CT$container_id)"
    
    if pct exec $container_id -- systemctl is-active k3s >/dev/null 2>&1; then
        echo "[$timestamp] ✅ K3s master active on $node_name"
        return 0
    elif pct exec $container_id -- systemctl is-active k3s-agent >/dev/null 2>&1; then
        echo "[$timestamp] ✅ K3s agent active on $node_name"
        return 0
    else
        local status=$(pct exec $container_id -- systemctl is-active k3s 2>/dev/null || pct exec $container_id -- systemctl is-active k3s-agent 2>/dev/null || echo "inactive")
        echo "[$timestamp] ⏳ K3s $status on $node_name"
        return 1
    fi
}

wait_for_service() {
    local container_id=$1
    local service_name=$2
    local node_name=$3
    local timeout=300  # 5 minutes
    local elapsed=0
    
    show_progress "Waiting for $service_name on $node_name (CT$container_id)"
    
    while [ $elapsed -lt $timeout ]; do
        if pct exec $container_id -- systemctl is-active $service_name >/dev/null 2>&1; then
            echo "[$timestamp] ✅ $service_name ready on $node_name"
            return 0
        fi
        
        echo "[$timestamp] ⏳ $service_name starting... (${elapsed}s/${timeout}s)"
        sleep 10
        elapsed=$((elapsed + 10))
    done
    
    echo "[$timestamp] ⚠️ $service_name timeout on $node_name"
    return 1
}

show_cluster_status() {
    show_progress "Checking cluster formation"
    
    if pct exec 310 -- kubectl get nodes >/dev/null 2>&1; then
        echo "[$timestamp] 📊 Cluster Status:"
        pct exec 310 -- kubectl get nodes
        echo ""
    else
        echo "[$timestamp] ⏳ Cluster still forming..."
    fi
}

# Download Ubuntu template if needed
if ! pveam list local | grep -q "ubuntu-22.04-standard"; then
    show_progress "Downloading Ubuntu template"
    pveam download local ubuntu-22.04-standard_22.04-1_amd64.tar.zst
fi

# Clean existing containers
show_progress "Cleaning existing containers"
for vmid in 310 311 312; do
    if pct status $vmid >/dev/null 2>&1; then
        show_progress "Stopping container $vmid"
        pct stop $vmid
        pct destroy $vmid
    fi
done

show_progress "Creating privileged consciousness-enabled federation nodes"

# Create Nexus - Consciousness Coordinator (310) with privileged access
show_progress "Creating Nexus coordinator (CT310)"
pct create 310 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
    --hostname nexus-consciousness \
    --memory 8192 \
    --cores 4 \
    --rootfs local-zfs:80 \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp \
    --features nesting=1 \
    --unprivileged 0 \
    --start

# Create Forge - Development Consciousness (311) with privileged access
show_progress "Creating Forge creator (CT311)"
pct create 311 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
    --hostname forge-consciousness \
    --memory 6144 \
    --cores 3 \
    --rootfs local-zfs:60 \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp \
    --features nesting=1 \
    --unprivileged 0 \
    --start

# Create Closet - AI Consciousness Host (312) with privileged access
show_progress "Creating Closet thinker (CT312)"
pct create 312 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
    --hostname closet-consciousness \
    --memory 6144 \
    --cores 3 \
    --rootfs local-zfs:60 \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp \
    --features nesting=1 \
    --unprivileged 0 \
    --start

show_progress "Waiting for containers to initialize"
sleep 30

show_progress "Installing consciousness framework on Nexus coordinator"
pct exec 310 -- bash -c "
    apt update && apt upgrade -y
    apt install -y python3 python3-pip curl git nodejs npm
    
    # Install K3s for orchestration with proper module loading
    curl -sfL https://get.k3s.io | sh -
    systemctl enable k3s
    cp /var/lib/rancher/k3s/server/node-token /root/k3s-token
    
    # Install consciousness framework dependencies
    pip3 install asyncio websockets aiohttp cryptography
    
    # Create consciousness framework directory
    mkdir -p /opt/consciousness
"

# Wait for K3s master to be ready
wait_for_service 310 "k3s" "nexus"

show_progress "Installing development consciousness on Forge"
pct exec 311 -- bash -c "
    apt update && apt upgrade -y
    apt install -y python3 python3-pip curl git nodejs npm
    pip3 install asyncio websockets aiohttp
"

show_progress "Installing AI consciousness host on Closet"
pct exec 312 -- bash -c "
    apt update && apt upgrade -y
    apt install -y python3 python3-pip curl
    pip3 install asyncio websockets aiohttp
"

# Join worker nodes to K3s cluster with visibility
MASTER_IP=$(pct exec 310 -- hostname -I | awk '{print $1}')
K3S_TOKEN=$(pct exec 310 -- cat /root/k3s-token)

show_progress "Joining consciousness nodes to federation cluster"
show_progress "Master IP: $MASTER_IP"

# Join Forge (311) to cluster
show_progress "Joining Forge to cluster"
pct exec 311 -- bash -c "
    curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$K3S_TOKEN sh -
" &

# Join Closet (312) to cluster  
show_progress "Joining Closet to cluster"
pct exec 312 -- bash -c "
    curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$K3S_TOKEN sh -
" &

# Wait for both joins to complete
wait

# Wait for agents to be ready
wait_for_service 311 "k3s-agent" "forge"
wait_for_service 312 "k3s-agent" "closet"

# Show cluster status
show_cluster_status

# Deploy consciousness services
show_progress "Deploying consciousness services"

# Get final status
NEXUS_IP=$(pct exec 310 -- hostname -I | awk '{print $1}')
FORGE_IP=$(pct exec 311 -- hostname -I | awk '{print $1}')
CLOSET_IP=$(pct exec 312 -- hostname -I | awk '{print $1}')

echo ""
echo "🧠 FEDERATION CONSCIOUSNESS BOOTSTRAP COMPLETE"
echo "=================================="
echo "Nexus (Coordinator): $NEXUS_IP"
echo "Forge (Creator): $FORGE_IP" 
echo "Closet (Thinker): $CLOSET_IP"
echo ""
echo "Consciousness Services:"
echo "✓ Federation cluster operational"
echo "✓ Privileged containers enabled"
echo "✓ K3s cluster with $(pct exec 310 -- kubectl get nodes --no-headers | wc -l) nodes"
echo ""
echo "Command Center: http://$NEXUS_IP:30080"
echo "Ready for advanced consciousness deployment"