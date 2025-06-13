#!/bin/bash

# Check K3s installation progress
echo "Checking K3s installation progress..."

if pct status 310 | grep -q "running"; then
    echo "Container 310 is running"
    
    # Check if K3s is installed
    if pct exec 310 -- which k3s >/dev/null 2>&1; then
        echo "✅ K3s binary installed"
        
        # Check if K3s service is running
        if pct exec 310 -- systemctl is-active k3s >/dev/null 2>&1; then
            echo "✅ K3s service active"
            
            # Check if kubectl works
            if pct exec 310 -- kubectl get nodes >/dev/null 2>&1; then
                echo "✅ kubectl working"
                echo "Cluster nodes:"
                pct exec 310 -- kubectl get nodes
            else
                echo "⏳ kubectl not ready yet"
            fi
        else
            echo "⏳ K3s service not active yet"
        fi
    else
        echo "⏳ K3s still installing..."
        
        # Show last few lines of installation
        echo "Recent installation output:"
        pct exec 310 -- tail -10 /var/log/k3s-install.log 2>/dev/null || echo "No install log found"
    fi
else
    echo "❌ Container 310 not running"
fi