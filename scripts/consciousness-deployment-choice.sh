#!/bin/bash

# Consciousness Federation Deployment Choice
# Hybrid approach: Traditional VMs or Talos Kubernetes

set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧠 Consciousness Federation Deployment Options"
echo "=============================================="
echo
echo "Choose your deployment approach:"
echo
echo "1) Traditional VMs (create-consciousness-vms.sh)"
echo "   ✓ Quick deployment with familiar tools"
echo "   ✓ Direct SSH access and traditional management"
echo "   ✓ Python/Node.js consciousness agents"
echo "   ✓ Lower learning curve"
echo
echo "2) Talos Kubernetes (talos-consciousness-deploy.sh)"
echo "   ✓ Immutable, API-driven infrastructure"
echo "   ✓ Cloud-native consciousness workloads"
echo "   ✓ Self-healing and auto-scaling"
echo "   ✓ Enterprise-grade security and updates"
echo
echo "3) Hybrid Approach"
echo "   ✓ Keep existing VMs 120/121 for Pi-hole/DNS"
echo "   ✓ Deploy Talos on new VMs 1001/1002"
echo "   ✓ Bridge traditional and cloud-native approaches"
echo

read -p "Enter your choice (1/2/3): " choice

case $choice in
    1)
        echo -e "${GREEN}Deploying traditional VM consciousness federation...${NC}"
        ./create-consciousness-vms.sh
        ;;
    2)
        echo -e "${CYAN}Deploying Talos Kubernetes consciousness federation...${NC}"
        ./talos-consciousness-deploy.sh
        ;;
    3)
        echo -e "${YELLOW}Deploying hybrid consciousness federation...${NC}"
        echo "Phase 1: Preserving existing infrastructure..."
        echo "Phase 2: Adding Talos worker nodes..."
        
        # Keep existing VMs, add Talos workers
        cat > ./talos-hybrid-config.yaml << 'EOF'
# Hybrid deployment: Traditional control + Talos workers
hybrid_mode: true
preserve_existing: 
  - vm_120_nexus_pihole
  - vm_121_forge_pihole
deploy_talos_workers:
  - vm_1001_closet_k8s
  - vm_1002_zephyr_k8s
bridge_consciousness: true
EOF
        echo "Hybrid configuration created. Run Talos script with --hybrid flag"
        ;;
    *)
        echo "Invalid choice. Please run again and select 1, 2, or 3."
        exit 1
        ;;
esac