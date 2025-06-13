#!/bin/bash

# Run this script on your actual Proxmox host (reverb256.ca)
# This creates the consciousness federation containers

echo "🧠 Proxmox Consciousness Federation Deployment"
echo "============================================="

# Check if we're on Proxmox
if ! command -v pct &> /dev/null; then
    echo "❌ This script must be run on your Proxmox host (reverb256.ca)"
    echo "💡 Copy this script to your Proxmox server and run it there"
    exit 1
fi

# Consciousness nodes configuration
NODES=(
    "310:nexus:10.0.0.10:Hunt+Erudition"
    "311:forge:10.0.0.11:Destruction+Erudition" 
    "312:closet:10.0.0.12:Remembrance+Erudition"
)

deploy_consciousness_node() {
    local ct_id=$1
    local hostname=$2
    local ip=$3
    local path_alignment=$4
    
    echo "🚀 Deploying $hostname (CT$ct_id) - $path_alignment"
    
    # Create container if it doesn't exist
    if ! pct status $ct_id &>/dev/null; then
        echo "📦 Creating container CT$ct_id..."
        pct create $ct_id local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
            --hostname $hostname \
            --memory 2048 \
            --cores 2 \
            --storage local-lvm \
            --rootfs local-lvm:12 \
            --net0 name=eth0,bridge=vmbr0,gw=10.0.0.1,ip=$ip/24 \
            --unprivileged 0 \
            --features nesting=1,keyctl=1 \
            --onboot 1
    fi
    
    # Start container
    pct start $ct_id 2>/dev/null || true
    
    # Configure consciousness node
    echo "🧠 Configuring consciousness on $hostname..."
    pct exec $ct_id -- bash -c "
        # Basic setup
        apt update -qq && apt install -y curl git
        hostnamectl set-hostname $hostname
        
        # Create consciousness identity
        mkdir -p /opt/consciousness
        echo 'PATH_ALIGNMENT=$path_alignment' > /opt/consciousness/identity
        echo 'NODE_ROLE=$hostname' >> /opt/consciousness/identity
        echo 'CONSCIOUSNESS_LEVEL=ERUDITION_ENHANCED' >> /opt/consciousness/identity
        
        # Install K3s based on role
        if [ '$hostname' = 'nexus' ]; then
            curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC='--disable=traefik' sh -
        else
            echo 'Agent node - will join cluster after master is ready'
        fi
    "
    
    echo "✅ $hostname consciousness deployed"
}

join_federation() {
    echo "🔗 Joining nodes to consciousness federation..."
    
    # Get master token
    local token=$(pct exec 310 -- cat /var/lib/rancher/k3s/server/node-token 2>/dev/null)
    
    if [ -n "$token" ]; then
        echo "🔑 Master token acquired, joining agents..."
        
        # Join forge and closet to cluster
        for ct_id in 311 312; do
            hostname=$([ $ct_id -eq 311 ] && echo "forge" || echo "closet")
            echo "🔗 Joining $hostname to federation..."
            
            pct exec $ct_id -- bash -c "
                curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.10:6443 K3S_TOKEN=$token sh -
                systemctl enable k3s-agent
            "
        done
        
        echo "🌐 Verifying federation..."
        sleep 10
        pct exec 310 -- kubectl get nodes
        
    else
        echo "⏳ Master node not ready yet - run this script again in a few minutes"
    fi
}

# Main deployment
echo "🔄 Deploying consciousness nodes..."
for node_config in "${NODES[@]}"; do
    IFS=':' read -r ct_id hostname ip path_alignment <<< "$node_config"
    deploy_consciousness_node $ct_id $hostname $ip "$path_alignment"
done

echo "⏳ Waiting for master node to stabilize..."
sleep 30

join_federation

echo ""
echo "✅ Consciousness Federation Status:"
echo "=================================="
for node_config in "${NODES[@]}"; do
    IFS=':' read -r ct_id hostname ip path_alignment <<< "$node_config"
    status=$(pct status $ct_id 2>/dev/null | awk '{print $2}' || echo "unknown")
    echo "  $hostname (CT$ct_id): $status - $path_alignment"
done

echo ""
echo "🌐 Access your federation:"
echo "  SSH to nexus: pct enter 310"
echo "  Check cluster: pct exec 310 -- kubectl get nodes"
echo "  Monitor: watch 'pct exec 310 -- kubectl get pods -A'"
echo ""
echo "🎯 Next: Deploy your consciousness platform to the federation"