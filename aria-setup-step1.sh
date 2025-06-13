#!/bin/bash

# Aria Setup Step 1: Proxmox User and Secrets Foundation
echo "🔐 Setting up Aria Proxmox User & Secrets Foundation"

# Install required packages
apt update && apt install -y jq curl unzip

# Create Aria user with proper permissions
echo "Creating aria@pve user..."
pveum user add aria@pve --comment "Aria AI Consciousness - Personal Trading System" 2>/dev/null || echo "User aria@pve already exists"

# Set a secure password (32 chars max for safety)
ARIA_PASSWORD=$(openssl rand -base64 24)
echo "aria:$ARIA_PASSWORD" | chpasswd -e

# Create custom role for Aria
pveum role add AriaAgent -privs "VM.Allocate,VM.Audit,VM.Config.CDROM,VM.Config.CPU,VM.Config.Cloudinit,VM.Config.Disk,VM.Config.HWType,VM.Config.Memory,VM.Config.Network,VM.Config.Options,VM.Console,VM.Monitor,VM.PowerMgmt,Datastore.Audit,Datastore.AllocateSpace,Pool.Audit,Sys.Audit,Sys.Console,Sys.Modify,Sys.PowerMgmt" 2>/dev/null || echo "Role AriaAgent already exists"

# Assign role to Aria user
pveum aclmod / -user aria@pve -role AriaAgent

# Create API token - handle existing token gracefully
if pveum user token list aria@pve --output-format json 2>/dev/null | jq -e '.[] | select(.tokenid=="k3s-token")' > /dev/null; then
    echo "API token k3s-token already exists for aria@pve"
    PROXMOX_TOKEN=$(pveum user token list aria@pve --output-format json | jq -r '.[] | select(.tokenid=="k3s-token") | .info // "existing-token-regenerate-if-needed"')
else
    PROXMOX_TOKEN_RESPONSE=$(pveum user token add aria@pve k3s-token --privsep 0 --output-format json)
    PROXMOX_TOKEN=$(echo "$PROXMOX_TOKEN_RESPONSE" | jq -r '.value')
fi

# Save credentials securely
mkdir -p /root/.aria
cat > /root/.aria/credentials << EOF
PROXMOX_HOST=10.1.1.100
PROXMOX_USER=aria@pve
PROXMOX_TOKEN=$PROXMOX_TOKEN
ARIA_PASSWORD=$ARIA_PASSWORD
VAULTWARDEN_URL=http://vault.lan:8080
EOF

chmod 600 /root/.aria/credentials

# Install Bitwarden CLI for Vaultwarden
echo "Installing Bitwarden CLI for secrets management..."
wget -q https://github.com/bitwarden/clients/releases/download/cli-v2024.1.0/bw-linux-2024.1.0.zip
unzip -q bw-linux-2024.1.0.zip
chmod +x bw
mv bw /usr/local/bin/
rm bw-linux-2024.1.0.zip

# Configure Bitwarden CLI for Vaultwarden
bw config server http://vault.lan:8080

# Create aria-secrets helper script
cat > /usr/local/bin/aria-secrets << 'EOF'
#!/bin/bash
# Aria Secrets Management Helper

source /root/.aria/credentials 2>/dev/null || {
    echo "Error: Aria credentials not found. Run aria-setup-step1.sh first"
    exit 1
}

case $1 in
    'setup-vaultwarden')
        echo "Setting up Vaultwarden connection..."
        bw config server $VAULTWARDEN_URL
        echo "Now run: aria-secrets login"
        ;;
    'login')
        echo "Logging into Vaultwarden..."
        bw login
        ;;
    'unlock')
        echo "Unlocking Vaultwarden session..."
        export BW_SESSION=$(bw unlock --raw)
        echo "Session token: $BW_SESSION"
        echo "Export this: export BW_SESSION=$BW_SESSION"
        ;;
    'test-proxmox')
        echo "Testing Proxmox API connection..."
        python3 -c "
from proxmoxer import ProxmoxAPI
import os
try:
    px = ProxmoxAPI('$PROXMOX_HOST', user='$PROXMOX_USER', token_name='k3s-token', token_value='$PROXMOX_TOKEN', verify_ssl=False)
    nodes = list(px.nodes.get())
    print(f'✅ Connected! Found {len(nodes)} nodes: {[n[\"node\"] for n in nodes]}')
except Exception as e:
    print(f'❌ Connection failed: {e}')
"
        ;;
    'show-credentials')
        echo "Aria Proxmox Credentials:"
        echo "Host: $PROXMOX_HOST"
        echo "User: $PROXMOX_USER" 
        echo "Token: ${PROXMOX_TOKEN:0:10}..."
        echo "Vaultwarden: $VAULTWARDEN_URL"
        ;;
    *)
        echo "Aria Secrets Management"
        echo "Commands:"
        echo "  aria-secrets setup-vaultwarden  - Configure Vaultwarden connection"
        echo "  aria-secrets login             - Login to Vaultwarden"
        echo "  aria-secrets unlock            - Unlock Vaultwarden session"
        echo "  aria-secrets test-proxmox      - Test Proxmox API connection"
        echo "  aria-secrets show-credentials  - Show current credentials"
        ;;
esac
EOF

chmod +x /usr/local/bin/aria-secrets

# Install Python dependencies for Proxmox management
pip3 install proxmoxer requests urllib3 2>/dev/null || {
    echo "Installing Python package manager..."
    apt install -y python3-pip
    pip3 install proxmoxer requests urllib3
}

echo ""
echo "✅ Aria Proxmox User & Secrets Foundation Complete!"
echo ""
echo "📋 Credentials saved to: /root/.aria/credentials"
echo "🔧 Helper script available: aria-secrets"
echo ""
echo "🧪 Test the setup:"
echo "   aria-secrets test-proxmox"
echo "   aria-secrets setup-vaultwarden"
echo ""
echo "🚀 Next: Run ./deploy-aria-k3s.sh to create the K3s cluster"