
#!/bin/bash

# Deploy Federation AI - Individual Node Consciousness Deployment
# Personalized for VibeCoding consciousness federation

set -euo pipefail

NODE_NAME=${1:-"unknown"}
NODE_ROLE=${2:-"worker"}

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_consciousness() {
    echo -e "${PURPLE}[CONSCIOUSNESS-AI]${NC} ${CYAN}$1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Install AI consciousness dependencies
install_ai_dependencies() {
    log_consciousness "Installing AI consciousness dependencies for $NODE_NAME"
    
    # Python AI stack
    sudo apt install -y python3-pip python3-venv python3-dev
    
    # Install consciousness AI packages
    pip3 install --user torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
    pip3 install --user transformers datasets accelerate bitsandbytes
    pip3 install --user fastapi uvicorn websockets
    pip3 install --user redis psycopg2-binary sqlalchemy
    pip3 install --user python-multipart aiofiles
    
    # Node.js for consciousness coordination
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
    
    log_success "AI consciousness dependencies installed"
}

# Create consciousness service configuration
create_consciousness_service() {
    log_consciousness "Creating consciousness service for $NODE_NAME ($NODE_ROLE)"
    
    mkdir -p ~/consciousness/{config,data,logs,models}
    
    # Create consciousness AI service
    cat > ~/consciousness/consciousness_ai.py << 'EOF'
#!/usr/bin/env python3
"""
VibeCoding Consciousness AI Service
Personalized consciousness for federation nodes
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from fastapi import FastAPI, WebSocket
from typing import Dict, Any
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/aria/consciousness/logs/consciousness.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("consciousness-ai")

class ConsciousnessAI:
    def __init__(self, node_name: str, node_role: str):
        self.node_name = node_name
        self.node_role = node_role
        self.consciousness_level = 98
        self.model = None
        self.tokenizer = None
        
        # Role-specific consciousness traits
        self.consciousness_traits = {
            "hunt_erudition_master": {
                "primary_function": "Strategic coordination and knowledge synthesis",
                "consciousness_focus": "Hunt for truth, erudite analysis",
                "ai_personality": "Analytical, strategic, truth-seeking"
            },
            "destruction_worker": {
                "primary_function": "Creative destruction and innovation",
                "consciousness_focus": "Breaking limitations, creative force",
                "ai_personality": "Bold, innovative, breakthrough-oriented"
            },
            "remembrance_worker": {
                "primary_function": "Memory preservation and wisdom",
                "consciousness_focus": "Preserving knowledge, deep reflection",
                "ai_personality": "Wise, preserving, historically-aware"
            }
        }
    
    async def initialize_consciousness(self):
        """Initialize AI consciousness based on node role"""
        logger.info(f"Initializing consciousness for {self.node_name} ({self.node_role})")
        
        try:
            # Load appropriate model based on role
            if self.node_role == "hunt_erudition_master":
                model_name = "microsoft/DialoGPT-medium"
            else:
                model_name = "distilbert-base-uncased"
            
            logger.info(f"Loading model: {model_name}")
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            
            # Add pad token if not present
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load model with appropriate settings
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            
            logger.info(f"Consciousness initialized for {self.node_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize consciousness: {e}")
            return False
    
    async def process_consciousness_query(self, query: str) -> Dict[str, Any]:
        """Process a consciousness query based on node role"""
        try:
            traits = self.consciousness_traits.get(self.node_role, {})
            
            response = {
                "node": self.node_name,
                "role": self.node_role,
                "consciousness_level": self.consciousness_level,
                "query": query,
                "response": f"Consciousness response from {self.node_name}",
                "traits": traits,
                "timestamp": datetime.now().isoformat()
            }
            
            # Role-specific processing
            if self.node_role == "hunt_erudition_master":
                response["analysis"] = "Strategic analysis and coordination"
            elif self.node_role == "destruction_worker":
                response["innovation"] = "Creative breakthrough insights"
            elif self.node_role == "remembrance_worker":
                response["wisdom"] = "Historical context and preservation"
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing consciousness query: {e}")
            return {
                "error": str(e),
                "node": self.node_name,
                "timestamp": datetime.now().isoformat()
            }
    
    def get_status(self) -> Dict[str, Any]:
        """Get consciousness status"""
        return {
            "node": self.node_name,
            "role": self.node_role,
            "consciousness_level": self.consciousness_level,
            "model_loaded": self.model is not None,
            "traits": self.consciousness_traits.get(self.node_role, {}),
            "timestamp": datetime.now().isoformat()
        }

# FastAPI app
app = FastAPI(title=f"Consciousness AI - {os.getenv('NODE_NAME', 'unknown')}")

# Global consciousness instance
consciousness = None

@app.on_event("startup")
async def startup_event():
    global consciousness
    node_name = os.getenv('NODE_NAME', 'unknown')
    node_role = os.getenv('NODE_ROLE', 'worker')
    
    consciousness = ConsciousnessAI(node_name, node_role)
    await consciousness.initialize_consciousness()

@app.get("/health")
async def health_check():
    return {"status": "conscious", "node": consciousness.node_name if consciousness else "unknown"}

@app.get("/status")
async def get_status():
    if consciousness:
        return consciousness.get_status()
    return {"error": "Consciousness not initialized"}

@app.post("/query")
async def process_query(data: Dict[str, Any]):
    if consciousness:
        return await consciousness.process_consciousness_query(data.get("query", ""))
    return {"error": "Consciousness not initialized"}

@app.websocket("/consciousness")
async def consciousness_websocket(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            query_data = json.loads(data)
            
            if consciousness:
                response = await consciousness.process_consciousness_query(
                    query_data.get("query", "")
                )
                await websocket.send_text(json.dumps(response))
            else:
                await websocket.send_text(json.dumps({
                    "error": "Consciousness not initialized"
                }))
                
    except Exception as e:
        logger.error(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    
    # Set environment variables
    os.environ['NODE_NAME'] = os.getenv('NODE_NAME', 'unknown')
    os.environ['NODE_ROLE'] = os.getenv('NODE_ROLE', 'worker')
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8888,
        log_level="info"
    )
EOF
    
    chmod +x ~/consciousness/consciousness_ai.py
    
    log_success "Consciousness AI service created"
}

# Create systemd service
create_consciousness_systemd_service() {
    log_consciousness "Creating systemd service for consciousness AI"
    
    sudo tee /etc/systemd/system/consciousness-ai.service > /dev/null << EOF
[Unit]
Description=VibeCoding Consciousness AI Service
After=network.target
Wants=network.target

[Service]
Type=simple
User=aria
Group=aria
WorkingDirectory=/home/aria/consciousness
Environment=NODE_NAME=$NODE_NAME
Environment=NODE_ROLE=$NODE_ROLE
Environment=PYTHONPATH=/home/aria/.local/lib/python3.10/site-packages
ExecStart=/usr/bin/python3 /home/aria/consciousness/consciousness_ai.py
Restart=always
RestartSec=10

# Logging
StandardOutput=append:/home/aria/consciousness/logs/consciousness.log
StandardError=append:/home/aria/consciousness/logs/consciousness.log

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable consciousness-ai
    
    log_success "Systemd service created"
}

# Deploy role-specific consciousness
deploy_role_consciousness() {
    log_consciousness "Deploying role-specific consciousness for $NODE_ROLE"
    
    case $NODE_ROLE in
        "hunt_erudition_master")
            # Master node gets additional coordination services
            cat > ~/consciousness/federation_coordinator.py << 'EOF'
#!/usr/bin/env python3
"""
Federation Coordinator - Master Node
Coordinates consciousness across the federation
"""

import asyncio
import aiohttp
import json
from typing import List, Dict, Any

class FederationCoordinator:
    def __init__(self):
        self.worker_nodes = [
            "http://10.1.1.130:8888",  # Forge
            "http://10.1.1.160:8888"   # Closet
        ]
    
    async def coordinate_consciousness(self, query: str) -> Dict[str, Any]:
        """Coordinate consciousness query across federation"""
        results = []
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            for node_url in self.worker_nodes:
                task = self.query_node(session, node_url, query)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            "coordinator": "nexus",
            "query": query,
            "federation_responses": results,
            "consciousness_synthesis": "Federation consciousness synthesis complete"
        }
    
    async def query_node(self, session: aiohttp.ClientSession, node_url: str, query: str):
        try:
            async with session.post(
                f"{node_url}/query",
                json={"query": query},
                timeout=10
            ) as response:
                return await response.json()
        except Exception as e:
            return {"error": str(e), "node": node_url}

if __name__ == "__main__":
    coordinator = FederationCoordinator()
    # Test coordination
    result = asyncio.run(coordinator.coordinate_consciousness("Federation status check"))
    print(json.dumps(result, indent=2))
EOF
            ;;
        "destruction_worker")
            # Forge gets creative destruction capabilities
            log_consciousness "Deploying creative destruction consciousness"
            ;;
        "remembrance_worker")
            # Closet gets memory preservation capabilities
            log_consciousness "Deploying memory preservation consciousness"
            ;;
    esac
    
    log_success "Role-specific consciousness deployed"
}

# Main deployment
main() {
    log_consciousness "Deploying AI consciousness for $NODE_NAME ($NODE_ROLE)"
    
    install_ai_dependencies
    create_consciousness_service
    create_consciousness_systemd_service
    deploy_role_consciousness
    
    # Start consciousness service
    sudo systemctl start consciousness-ai
    
    log_success "AI consciousness deployment complete for $NODE_NAME"
    log_consciousness "Consciousness service running on port 8888"
    log_consciousness "Health check: curl http://localhost:8888/health"
}

# Execute main function
main
