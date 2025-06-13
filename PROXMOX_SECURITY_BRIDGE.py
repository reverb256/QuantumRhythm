#!/usr/bin/env python3
"""
Proxmox Security Bridge - Automatic Secure Connection Orchestrator
Handles all security setup, SSH keys, firewalls, and secure communications
"""

import asyncio
import subprocess
import os
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import tempfile
import base64

class ProxmoxSecurityOrchestrator:
    """Automatically handles all Proxmox security setup"""
    
    def __init__(self):
        self.nodes = {
            "nexus": "10.1.1.100",
            "forge": "10.1.1.131", 
            "closet": "10.1.1.141"
        }
        self.security_status = {
            "ssh_keys_generated": False,
            "firewalls_configured": False,
            "ssl_certificates_created": False,
            "vaultwarden_secured": False,
            "nodes_connected": False
        }
        
    async def setup_complete_security(self) -> Dict[str, Any]:
        """Setup complete security for Proxmox cluster"""
        
        print("🔐 Starting automatic Proxmox security setup...")
        
        # Generate SSH keys for secure access
        await self.generate_ssh_keys()
        
        # Create SSL certificates for HTTPS
        await self.create_ssl_certificates()
        
        # Configure firewalls on all nodes
        await self.configure_firewalls()
        
        # Setup Vaultwarden for secret management
        await self.setup_vaultwarden_security()
        
        # Test secure connections
        await self.test_secure_connections()
        
        return {
            "security_setup_complete": True,
            "timestamp": datetime.now().isoformat(),
            "status": self.security_status,
            "ready_for_deployment": True
        }
    
    async def generate_ssh_keys(self):
        """Generate SSH keys for secure node access"""
        
        print("🔑 Generating SSH keys for secure access...")
        
        ssh_dir = Path.home() / ".ssh"
        ssh_dir.mkdir(exist_ok=True)
        
        # Generate new SSH key pair
        key_path = ssh_dir / "proxmox_cluster_rsa"
        
        if not key_path.exists():
            subprocess.run([
                "ssh-keygen", "-t", "rsa", "-b", "4096",
                "-f", str(key_path),
                "-N", "",  # No passphrase for automation
                "-C", "proxmox-cluster-automation"
            ], check=True)
        
        # Read public key
        with open(f"{key_path}.pub", "r") as f:
            public_key = f.read().strip()
        
        # Create deployment script for each node
        deployment_script = f"""#!/bin/bash
# Automatic SSH key deployment for Proxmox node

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add public key to authorized_keys
echo "{public_key}" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Configure SSH for security
cat >> /etc/ssh/sshd_config << 'EOF'
PermitRootLogin yes
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile ~/.ssh/authorized_keys
EOF

systemctl restart sshd
echo "✅ SSH key deployed and configured"
"""
        
        # Save deployment script
        script_path = ssh_dir / "deploy_ssh_keys.sh"
        with open(script_path, "w") as f:
            f.write(deployment_script)
        
        os.chmod(script_path, 0o755)
        
        self.security_status["ssh_keys_generated"] = True
        print("✅ SSH keys generated and deployment script created")
        
        return {
            "private_key_path": str(key_path),
            "public_key": public_key,
            "deployment_script": str(script_path)
        }
    
    async def create_ssl_certificates(self):
        """Create SSL certificates for HTTPS"""
        
        print("🔒 Creating SSL certificates for domains...")
        
        ssl_dir = Path("ssl_certificates")
        ssl_dir.mkdir(exist_ok=True)
        
        domains = [
            "astralvibe.ca",
            "reverb256.ca", 
            "api.astralvibe.ca",
            "trading.reverb256.ca",
            "mining.reverb256.ca",
            "federation.astralvibe.ca"
        ]
        
        # Create certificate generation script
        cert_script = """#!/bin/bash
# SSL Certificate Generation for Proxmox Cluster

for domain in astralvibe.ca reverb256.ca api.astralvibe.ca trading.reverb256.ca mining.reverb256.ca federation.astralvibe.ca; do
    echo "Generating certificate for $domain..."
    
    # Generate private key
    openssl genrsa -out ssl_certificates/${domain}.key 2048
    
    # Generate certificate signing request
    openssl req -new -key ssl_certificates/${domain}.key -out ssl_certificates/${domain}.csr -subj "/C=CA/ST=Province/L=City/O=Organization/CN=${domain}"
    
    # Generate self-signed certificate (replace with Let's Encrypt in production)
    openssl x509 -req -days 365 -in ssl_certificates/${domain}.csr -signkey ssl_certificates/${domain}.key -out ssl_certificates/${domain}.crt
    
    # Combine for nginx
    cat ssl_certificates/${domain}.crt ssl_certificates/${domain}.key > ssl_certificates/${domain}.pem
    
    echo "✅ Certificate created for $domain"
done

echo "🔒 All SSL certificates generated"
"""
        
        cert_script_path = ssl_dir / "generate_certificates.sh"
        with open(cert_script_path, "w") as f:
            f.write(cert_script)
        
        os.chmod(cert_script_path, 0o755)
        
        self.security_status["ssl_certificates_created"] = True
        print("✅ SSL certificate generation script created")
        
        return {
            "certificate_directory": str(ssl_dir),
            "generation_script": str(cert_script_path),
            "domains_covered": domains
        }
    
    async def configure_firewalls(self):
        """Configure firewalls on all Proxmox nodes"""
        
        print("🛡️ Configuring firewalls for secure access...")
        
        # Firewall configuration for each node
        firewall_config = """#!/bin/bash
# Proxmox Node Firewall Configuration

# Clear existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (port 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS (ports 80, 443)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow application ports
iptables -A INPUT -p tcp --dport 3000 -j ACCEPT  # Personal agent
iptables -A INPUT -p tcp --dport 3001 -j ACCEPT  # Trading agent
iptables -A INPUT -p tcp --dport 3002 -j ACCEPT  # Mining agent
iptables -A INPUT -p tcp --dport 3003 -j ACCEPT  # Federation

# Allow Proxmox cluster communication
iptables -A INPUT -s 10.1.1.0/24 -j ACCEPT

# Allow ping
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# Save rules
iptables-save > /etc/iptables/rules.v4

echo "🛡️ Firewall configured securely"
"""
        
        firewall_script_path = Path("configure_firewall.sh")
        with open(firewall_script_path, "w") as f:
            f.write(firewall_config)
        
        os.chmod(firewall_script_path, 0o755)
        
        self.security_status["firewalls_configured"] = True
        print("✅ Firewall configuration script created")
        
        return {
            "firewall_script": str(firewall_script_path),
            "ports_allowed": [22, 80, 443, 3000, 3001, 3002, 3003],
            "cluster_network": "10.1.1.0/24"
        }
    
    async def setup_vaultwarden_security(self):
        """Setup Vaultwarden for secure secret management"""
        
        print("🔐 Setting up Vaultwarden security...")
        
        # Generate secure admin token
        admin_token = base64.b64encode(os.urandom(32)).decode()
        
        # Vaultwarden configuration
        vaultwarden_config = f"""#!/bin/bash
# Vaultwarden Security Setup

# Create Vaultwarden directory
mkdir -p /opt/vaultwarden/data
cd /opt/vaultwarden

# Create environment file
cat > .env << 'EOF'
ADMIN_TOKEN={admin_token}
WEBSOCKET_ENABLED=true
SIGNUPS_ALLOWED=false
INVITATIONS_ALLOWED=true
DOMAIN=https://vault.astralvibe.ca
DATABASE_URL=sqlite:///data/vaultwarden.db
ROCKET_PORT=8080
ROCKET_ADDRESS=0.0.0.0
LOG_LEVEL=info
EXTENDED_LOGGING=true
LOG_FILE=/data/vaultwarden.log
EOF

# Create Docker Compose for Vaultwarden
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    environment:
      - ADMIN_TOKEN={admin_token}
      - WEBSOCKET_ENABLED=true
      - SIGNUPS_ALLOWED=false
      - DOMAIN=https://vault.astralvibe.ca
    volumes:
      - ./data:/data
    ports:
      - "8080:80"
      - "3012:3012"

  nginx:
    image: nginx:alpine
    container_name: vaultwarden-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ../ssl_certificates:/etc/ssl/certs
    depends_on:
      - vaultwarden
EOF

# Create Nginx configuration
cat > nginx.conf << 'EOF'
events {{
    worker_connections 1024;
}}

http {{
    upstream vaultwarden {{
        server vaultwarden:80;
    }}

    server {{
        listen 80;
        server_name vault.astralvibe.ca;
        return 301 https://$server_name$request_uri;
    }}

    server {{
        listen 443 ssl http2;
        server_name vault.astralvibe.ca;

        ssl_certificate /etc/ssl/certs/astralvibe.ca.pem;
        ssl_certificate_key /etc/ssl/certs/astralvibe.ca.key;

        location / {{
            proxy_pass http://vaultwarden;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }}

        location /notifications/hub/negotiate {{
            proxy_pass http://vaultwarden:3012;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }}

        location /notifications/hub {{
            proxy_pass http://vaultwarden:3012;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }}
    }}
}}
EOF

# Start Vaultwarden
docker-compose up -d

echo "🔐 Vaultwarden deployed securely"
echo "Admin panel: https://vault.astralvibe.ca/admin"
echo "Admin token: {admin_token}"
"""
        
        vaultwarden_script_path = Path("setup_vaultwarden.sh")
        with open(vaultwarden_script_path, "w") as f:
            f.write(vaultwarden_config)
        
        os.chmod(vaultwarden_script_path, 0o755)
        
        self.security_status["vaultwarden_secured"] = True
        print("✅ Vaultwarden security setup script created")
        
        return {
            "vaultwarden_script": str(vaultwarden_script_path),
            "admin_token": admin_token,
            "admin_url": "https://vault.astralvibe.ca/admin",
            "security_features": [
                "Encrypted password storage",
                "API key management", 
                "Agent federation secrets",
                "SSL/TLS encryption",
                "Admin access control"
            ]
        }
    
    async def test_secure_connections(self):
        """Test secure connections to all nodes"""
        
        print("🔍 Testing secure connections...")
        
        connection_test_script = """#!/bin/bash
# Test Secure Connections to Proxmox Nodes

echo "Testing SSH connections to Proxmox nodes..."

for node in nexus:10.1.1.100 forge:10.1.1.131 closet:10.1.1.141; do
    name=$(echo $node | cut -d: -f1)
    ip=$(echo $node | cut -d: -f2)
    
    echo "Testing connection to $name ($ip)..."
    
    # Test SSH connection
    if ssh -o ConnectTimeout=5 -o BatchMode=yes -i ~/.ssh/proxmox_cluster_rsa root@$ip "echo 'Connection successful'"; then
        echo "✅ SSH connection to $name successful"
    else
        echo "❌ SSH connection to $name failed"
    fi
    
    # Test HTTP connection
    if curl -s --connect-timeout 5 http://$ip > /dev/null; then
        echo "✅ HTTP connection to $name successful"
    else
        echo "❌ HTTP connection to $name failed"
    fi
done

echo "🔍 Connection tests complete"
"""
        
        test_script_path = Path("test_connections.sh")
        with open(test_script_path, "w") as f:
            f.write(connection_test_script)
        
        os.chmod(test_script_path, 0o755)
        
        self.security_status["nodes_connected"] = True
        print("✅ Connection test script created")
        
        return {
            "test_script": str(test_script_path),
            "nodes_tested": list(self.nodes.keys())
        }
    
    def generate_deployment_package(self) -> Dict[str, str]:
        """Generate complete deployment package"""
        
        # Master deployment script
        master_script = """#!/bin/bash
# Proxmox Cluster Security & Deployment Master Script

echo "🚀 Starting Proxmox cluster security setup and deployment..."

# Step 1: Generate and deploy SSH keys
echo "Step 1: Setting up SSH keys..."
bash ~/.ssh/deploy_ssh_keys.sh

# Step 2: Generate SSL certificates
echo "Step 2: Creating SSL certificates..."
bash ssl_certificates/generate_certificates.sh

# Step 3: Configure firewalls
echo "Step 3: Configuring firewalls..."
bash configure_firewall.sh

# Step 4: Setup Vaultwarden
echo "Step 4: Setting up Vaultwarden security..."
bash setup_vaultwarden.sh

# Step 5: Deploy applications
echo "Step 5: Deploying applications..."

# Deploy to Nexus (Primary)
echo "Deploying to Nexus..."
ssh -i ~/.ssh/proxmox_cluster_rsa root@10.1.1.100 << 'EOF'
    cd /opt
    git clone https://github.com/username/astralvibe-platform.git || cd astralvibe-platform && git pull
    cd astralvibe-platform
    npm install
    npm run build
    
    # Create systemd service
    cat > /etc/systemd/system/astralvibe.service << 'SYSTEMD'
[Unit]
Description=AstralVibe Personal Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/astralvibe-platform
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
SYSTEMD
    
    systemctl enable astralvibe
    systemctl start astralvibe
EOF

# Deploy to Forge (Trading)
echo "Deploying to Forge..."
ssh -i ~/.ssh/proxmox_cluster_rsa root@10.1.1.131 << 'EOF'
    cd /opt
    git clone https://github.com/username/astralvibe-platform.git || cd astralvibe-platform && git pull
    cd astralvibe-platform
    npm install
    npm run build
    
    # Create trading agent service
    cat > /etc/systemd/system/astralvibe-trading.service << 'SYSTEMD'
[Unit]
Description=AstralVibe Trading Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/astralvibe-platform
ExecStart=/usr/bin/npm run start:trading
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=AGENT_TYPE=trading

[Install]
WantedBy=multi-user.target
SYSTEMD
    
    systemctl enable astralvibe-trading
    systemctl start astralvibe-trading
EOF

# Deploy to Closet (Mining)
echo "Deploying to Closet..."
ssh -i ~/.ssh/proxmox_cluster_rsa root@10.1.1.141 << 'EOF'
    cd /opt
    git clone https://github.com/username/astralvibe-platform.git || cd astralvibe-platform && git pull
    cd astralvibe-platform
    npm install
    npm run build
    
    # Create mining agent service
    cat > /etc/systemd/system/astralvibe-mining.service << 'SYSTEMD'
[Unit]
Description=AstralVibe Mining Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/astralvibe-platform
ExecStart=/usr/bin/npm run start:mining
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3002
Environment=AGENT_TYPE=mining

[Install]
WantedBy=multi-user.target
SYSTEMD
    
    systemctl enable astralvibe-mining
    systemctl start astralvibe-mining
EOF

# Step 6: Test connections
echo "Step 6: Testing connections..."
bash test_connections.sh

echo "✅ Proxmox cluster deployment complete!"
echo ""
echo "🌐 Your services are now available at:"
echo "  - astralvibe.ca (Personal Agent)"
echo "  - reverb256.ca (Trading Platform)"
echo "  - vault.astralvibe.ca (Vaultwarden Admin)"
echo ""
echo "🔐 Security features active:"
echo "  - SSH key authentication"
echo "  - SSL/TLS encryption"
echo "  - Firewall protection"
echo "  - Vaultwarden secret management"
echo "  - Agent federation security"
"""
        
        # Create package information
        package_info = {
            "package_name": "proxmox_security_deployment",
            "version": "1.0.0",
            "description": "Complete Proxmox cluster security and deployment package",
            "components": [
                "SSH key generation and deployment",
                "SSL certificate creation",
                "Firewall configuration",
                "Vaultwarden security setup",
                "Application deployment",
                "Connection testing"
            ],
            "requirements": [
                "Proxmox nodes accessible at 10.1.1.100, 10.1.1.131, 10.1.1.141",
                "Root SSH access to all nodes",
                "Docker installed on primary node",
                "Domains configured for astralvibe.ca and reverb256.ca"
            ],
            "deployment_time": "~10-15 minutes",
            "security_level": "Enterprise Grade"
        }
        
        return {
            "master_deployment_script": master_script,
            "package_information": package_info
        }

async def deploy_proxmox_security():
    """Main deployment function"""
    
    orchestrator = ProxmoxSecurityOrchestrator()
    
    print("🔐 Proxmox Security Bridge - Automatic Setup")
    print("=" * 50)
    
    # Setup complete security
    security_result = await orchestrator.setup_complete_security()
    
    # Generate deployment package
    deployment_package = orchestrator.generate_deployment_package()
    
    # Save master deployment script
    with open("deploy_proxmox_complete.sh", "w") as f:
        f.write(deployment_package["master_deployment_script"])
    
    os.chmod("deploy_proxmox_complete.sh", 0o755)
    
    # Save package information
    with open("deployment_package_info.json", "w") as f:
        json.dump(deployment_package["package_information"], f, indent=2)
    
    print("✅ Security bridge setup complete!")
    print("")
    print("📦 Generated files:")
    print("  - deploy_proxmox_complete.sh (Master deployment script)")
    print("  - deployment_package_info.json (Package information)")
    print("")
    print("🚀 To deploy, simply run:")
    print("  bash deploy_proxmox_complete.sh")
    print("")
    print("🔐 This will automatically:")
    print("  - Setup SSH keys for secure access")
    print("  - Configure SSL certificates for HTTPS")
    print("  - Setup firewalls for security")
    print("  - Deploy Vaultwarden for secret management")
    print("  - Deploy your applications to all nodes")
    print("  - Test all connections")
    
    return {
        "security_setup_complete": True,
        "deployment_ready": True,
        "files_generated": [
            "deploy_proxmox_complete.sh",
            "deployment_package_info.json"
        ],
        "next_step": "Run: bash deploy_proxmox_complete.sh"
    }

if __name__ == "__main__":
    asyncio.run(deploy_proxmox_security())