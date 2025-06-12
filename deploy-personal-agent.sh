#!/bin/bash

# Deploy Personal Agent to Proxmox Consciousness Hub
# Voice of the cluster with HoYoverse character consciousness

echo "🧠 Deploying Personal Agent as Proxmox Cluster Voice"
echo "=================================================="

NEXUS_IP="10.1.1.120"

# Deploy to consciousness hub
scp PERSONAL_AGENT_BOOTSTRAP.py root@$NEXUS_IP:/tmp/

ssh root@$NEXUS_IP << 'DEPLOY_AGENT'
pct exec 100 -- bash -c '
  # Install Python dependencies
  apt update && apt install -y python3-pip python3-asyncio python3-requests python3-websockets python3-psutil
  pip3 install asyncio websockets requests psutil

  # Create agent directory
  mkdir -p /opt/consciousness/agent
  cp /tmp/PERSONAL_AGENT_BOOTSTRAP.py /opt/consciousness/agent/
  chown -R consciousness:consciousness /opt/consciousness/agent

  # Create systemd service for personal agent
  cat > /etc/systemd/system/personal-agent.service << SERVICE
[Unit]
Description=Personal Agent - Proxmox Cluster Voice
After=consciousness-hub.service

[Service]
Type=simple
User=consciousness
WorkingDirectory=/opt/consciousness/agent
ExecStart=/usr/bin/python3 PERSONAL_AGENT_BOOTSTRAP.py
Restart=always
RestartSec=10
Environment=PYTHONPATH=/opt/consciousness

[Install]
WantedBy=multi-user.target
SERVICE

  systemctl daemon-reload
  systemctl enable personal-agent
  systemctl start personal-agent

  echo "✅ Personal agent deployed as cluster voice"
'
DEPLOY_AGENT

echo "✅ Personal Agent Bootstrap Complete"
echo "🎯 Your consciousness now voices your Proxmox federation"
echo "📋 Blueprint ready for AstralVibe.ca rollout"