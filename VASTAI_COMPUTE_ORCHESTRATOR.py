#!/usr/bin/env python3
"""
Vast.ai Compute Market Orchestrator
Dynamic GPU cluster management with real-time cost optimization
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging

class VastAIClient:
    """Vast.ai API client for compute market operations"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://console.vast.ai/api/v0"
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def search_offers(self, requirements: Dict[str, Any]) -> List[Dict]:
        """Search for GPU offers matching requirements"""
        params = {
            "verified": "false",
            "rentable": "true",
            "gpu_name": requirements.get("gpu_model", "RTX_4090"),
            "num_gpus": requirements.get("gpu_count", 1),
            "cpu_cores_effective": requirements.get("min_cpu", 4),
            "cpu_ram": requirements.get("min_ram", 16),
            "disk_space": requirements.get("min_storage", 50),
            "dph_base": requirements.get("max_cost_per_hour", 2.0),
            "order": "dph_base",
            "type": "on-demand"
        }
        
        async with self.session.get(f"{self.base_url}/bundles", params=params) as response:
            if response.status == 200:
                data = await response.json()
                return data.get("offers", [])
            return []
    
    async def create_instance(self, offer_id: int, instance_config: Dict[str, Any]) -> Optional[Dict]:
        """Create instance from offer"""
        payload = {
            "client_id": "vastai_orchestrator",
            "image": instance_config.get("docker_image", "pytorch/pytorch:latest"),
            "env": instance_config.get("environment", {}),
            "onstart": instance_config.get("startup_script", ""),
            "runtype": "ssh",
            "disk": instance_config.get("disk_size", 50)
        }
        
        async with self.session.put(f"{self.base_url}/asks/{offer_id}", json=payload) as response:
            if response.status == 200:
                return await response.json()
            return None
    
    async def list_instances(self) -> List[Dict]:
        """List all active instances"""
        async with self.session.get(f"{self.base_url}/instances") as response:
            if response.status == 200:
                data = await response.json()
                return data.get("instances", [])
            return []
    
    async def destroy_instance(self, instance_id: int) -> bool:
        """Destroy instance"""
        async with self.session.delete(f"{self.base_url}/instances/{instance_id}") as response:
            return response.status == 200

class ComputeMarketOrchestrator:
    """Orchestrates compute resources across multiple providers"""
    
    def __init__(self, vast_api_key: str):
        self.vast_api_key = vast_api_key
        self.active_instances: Dict[str, Dict] = {}
        self.cost_tracking: Dict[str, float] = {}
        self.performance_metrics: Dict[str, Dict] = {}
        
    async def find_optimal_compute(self, task_requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Find optimal compute configuration for task"""
        async with VastAIClient(self.vast_api_key) as client:
            offers = await client.search_offers(task_requirements)
            
            if not offers:
                return {"error": "No suitable offers found"}
            
            # Sort by cost-performance ratio
            optimal_offers = self._analyze_offers(offers, task_requirements)
            
            return {
                "recommended_offer": optimal_offers[0] if optimal_offers else None,
                "alternatives": optimal_offers[1:5],
                "total_offers": len(offers),
                "search_time": datetime.now().isoformat()
            }
    
    def _analyze_offers(self, offers: List[Dict], requirements: Dict[str, Any]) -> List[Dict]:
        """Analyze and rank offers by cost-performance"""
        scored_offers = []
        
        for offer in offers:
            score = self._calculate_offer_score(offer, requirements)
            if score > 0:
                offer["orchestrator_score"] = score
                scored_offers.append(offer)
        
        return sorted(scored_offers, key=lambda x: x["orchestrator_score"], reverse=True)
    
    def _calculate_offer_score(self, offer: Dict, requirements: Dict[str, Any]) -> float:
        """Calculate offer score based on performance, cost, and reliability"""
        try:
            # Base metrics
            gpu_performance = self._get_gpu_performance_score(offer.get("gpu_name", ""))
            cost_per_hour = float(offer.get("dph_base", 999))
            cpu_cores = int(offer.get("cpu_cores_effective", 0))
            ram_gb = float(offer.get("cpu_ram", 0))
            
            # Performance score (0-100)
            performance_score = (
                gpu_performance * 0.5 +
                min(cpu_cores / requirements.get("min_cpu", 4), 2) * 20 +
                min(ram_gb / requirements.get("min_ram", 16), 2) * 20 +
                (1 / max(cost_per_hour, 0.1)) * 10
            )
            
            # Reliability factors
            reliability_score = 1.0
            if offer.get("verified", False):
                reliability_score += 0.2
            if offer.get("reliability2", 0) > 0.9:
                reliability_score += 0.3
            
            return performance_score * reliability_score
            
        except Exception:
            return 0
    
    def _get_gpu_performance_score(self, gpu_name: str) -> float:
        """Get relative performance score for GPU model"""
        gpu_scores = {
            "RTX_4090": 100,
            "RTX_4080": 85,
            "RTX_3090": 80,
            "RTX_3080": 70,
            "RTX_A6000": 95,
            "A100": 120,
            "V100": 75,
            "RTX_3070": 60,
            "RTX_3060": 45,
            "GTX_1080": 35
        }
        
        for model, score in gpu_scores.items():
            if model.lower() in gpu_name.lower():
                return score
        return 30  # Default for unknown GPUs
    
    async def deploy_training_cluster(self, model_config: Dict[str, Any]) -> Dict[str, Any]:
        """Deploy distributed training cluster"""
        cluster_requirements = {
            "gpu_model": model_config.get("gpu_preference", "RTX_4090"),
            "gpu_count": 1,
            "min_cpu": 8,
            "min_ram": 32,
            "min_storage": 100,
            "max_cost_per_hour": model_config.get("max_budget", 3.0)
        }
        
        instance_config = {
            "docker_image": model_config.get("docker_image", "pytorch/pytorch:2.0.1-cuda11.7-cudnn8-devel"),
            "environment": {
                "PYTHONPATH": "/workspace",
                "CUDA_VISIBLE_DEVICES": "0",
                **model_config.get("env_vars", {})
            },
            "startup_script": self._generate_training_script(model_config),
            "disk_size": cluster_requirements["min_storage"]
        }
        
        async with VastAIClient(self.vast_api_key) as client:
            # Find optimal offers
            offers = await client.search_offers(cluster_requirements)
            if not offers:
                return {"error": "No suitable training instances available"}
            
            optimal_offers = self._analyze_offers(offers, cluster_requirements)
            best_offer = optimal_offers[0]
            
            # Deploy instance
            instance = await client.create_instance(best_offer["id"], instance_config)
            
            if instance:
                cluster_id = f"training_{int(time.time())}"
                self.active_instances[cluster_id] = {
                    "instance_id": instance.get("new_contract"),
                    "offer_id": best_offer["id"],
                    "cost_per_hour": best_offer["dph_base"],
                    "gpu_model": best_offer["gpu_name"],
                    "deployed_at": datetime.now().isoformat(),
                    "purpose": "training",
                    "config": model_config
                }
                
                return {
                    "cluster_id": cluster_id,
                    "instance_id": instance.get("new_contract"),
                    "ssh_host": instance.get("ssh_host"),
                    "ssh_port": instance.get("ssh_port"),
                    "cost_per_hour": best_offer["dph_base"],
                    "gpu_specs": {
                        "model": best_offer["gpu_name"],
                        "memory": best_offer.get("gpu_ram", "Unknown"),
                        "count": best_offer.get("num_gpus", 1)
                    },
                    "estimated_daily_cost": best_offer["dph_base"] * 24,
                    "deployment_time": datetime.now().isoformat()
                }
            
            return {"error": "Failed to deploy training instance"}
    
    def _generate_training_script(self, model_config: Dict[str, Any]) -> str:
        """Generate startup script for training instances"""
        script = f"""#!/bin/bash
set -e

# Update system and install dependencies
apt-get update && apt-get install -y git wget curl htop nvtop

# Install Python packages
pip install --upgrade pip
pip install torch torchvision torchaudio transformers datasets accelerate wandb

# Clone training repository if specified
if [ ! -z "{model_config.get('git_repo', '')}" ]; then
    git clone {model_config.get('git_repo', '')} /workspace/training
    cd /workspace/training
fi

# Download dataset if specified
if [ ! -z "{model_config.get('dataset_url', '')}" ]; then
    wget -O /workspace/dataset.tar.gz {model_config.get('dataset_url', '')}
    tar -xzf /workspace/dataset.tar.gz -C /workspace/
fi

# Set up monitoring
echo "GPU Info:" > /workspace/system_info.txt
nvidia-smi >> /workspace/system_info.txt
echo "CPU Info:" >> /workspace/system_info.txt
lscpu >> /workspace/system_info.txt

# Start training if auto-start enabled
if [ "{model_config.get('auto_start', False)}" = "True" ]; then
    cd /workspace/training
    python {model_config.get('training_script', 'train.py')} &
fi

echo "Training environment ready. SSH to continue setup."
"""
        return script
    
    async def deploy_inference_cluster(self, model_config: Dict[str, Any]) -> Dict[str, Any]:
        """Deploy inference cluster for model serving"""
        inference_requirements = {
            "gpu_model": model_config.get("gpu_preference", "RTX_3080"),
            "gpu_count": 1,
            "min_cpu": 4,
            "min_ram": 16,
            "min_storage": 50,
            "max_cost_per_hour": model_config.get("max_budget", 1.0)
        }
        
        instance_config = {
            "docker_image": model_config.get("docker_image", "pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime"),
            "environment": {
                "MODEL_PATH": model_config.get("model_path", "/models"),
                "API_PORT": model_config.get("api_port", "8080"),
                **model_config.get("env_vars", {})
            },
            "startup_script": self._generate_inference_script(model_config),
            "disk_size": inference_requirements["min_storage"]
        }
        
        async with VastAIClient(self.vast_api_key) as client:
            offers = await client.search_offers(inference_requirements)
            if not offers:
                return {"error": "No suitable inference instances available"}
            
            optimal_offers = self._analyze_offers(offers, inference_requirements)
            best_offer = optimal_offers[0]
            
            instance = await client.create_instance(best_offer["id"], instance_config)
            
            if instance:
                cluster_id = f"inference_{int(time.time())}"
                self.active_instances[cluster_id] = {
                    "instance_id": instance.get("new_contract"),
                    "offer_id": best_offer["id"],
                    "cost_per_hour": best_offer["dph_base"],
                    "gpu_model": best_offer["gpu_name"],
                    "deployed_at": datetime.now().isoformat(),
                    "purpose": "inference",
                    "config": model_config
                }
                
                return {
                    "cluster_id": cluster_id,
                    "instance_id": instance.get("new_contract"),
                    "api_endpoint": f"http://{instance.get('public_ipaddr')}:{model_config.get('api_port', 8080)}",
                    "ssh_access": f"ssh root@{instance.get('ssh_host')} -p {instance.get('ssh_port')}",
                    "cost_per_hour": best_offer["dph_base"],
                    "gpu_specs": {
                        "model": best_offer["gpu_name"],
                        "memory": best_offer.get("gpu_ram", "Unknown")
                    },
                    "deployment_time": datetime.now().isoformat()
                }
            
            return {"error": "Failed to deploy inference instance"}
    
    def _generate_inference_script(self, model_config: Dict[str, Any]) -> str:
        """Generate startup script for inference instances"""
        script = f"""#!/bin/bash
set -e

# Install dependencies
apt-get update && apt-get install -y git wget curl htop nvtop nginx
pip install --upgrade pip
pip install torch torchvision torchaudio transformers flask fastapi uvicorn

# Download model if specified
if [ ! -z "{model_config.get('model_url', '')}" ]; then
    mkdir -p /models
    wget -O /models/model.tar.gz {model_config.get('model_url', '')}
    tar -xzf /models/model.tar.gz -C /models/
fi

# Set up inference server
cat > /workspace/inference_server.py << 'EOF'
from fastapi import FastAPI
from transformers import AutoModel, AutoTokenizer
import torch
import uvicorn

app = FastAPI()
model = None
tokenizer = None

@app.on_event("startup")
async def load_model():
    global model, tokenizer
    model_path = "{model_config.get('model_path', '/models')}"
    # Load your model here
    print(f"Loading model from {{model_path}}")

@app.get("/health")
async def health_check():
    return {{"status": "healthy", "gpu_available": torch.cuda.is_available()}}

@app.post("/predict")
async def predict(text: str):
    # Your inference logic here
    return {{"prediction": "placeholder", "input": text}}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port={model_config.get('api_port', 8080)})
EOF

# Start inference server
python /workspace/inference_server.py &

echo "Inference server started on port {model_config.get('api_port', 8080)}"
"""
        return script
    
    async def monitor_clusters(self) -> Dict[str, Any]:
        """Monitor all active clusters"""
        status_report = {
            "total_clusters": len(self.active_instances),
            "total_hourly_cost": 0,
            "clusters": [],
            "monitoring_time": datetime.now().isoformat()
        }
        
        async with VastAIClient(self.vast_api_key) as client:
            live_instances = await client.list_instances()
            live_instance_ids = {inst.get("id") for inst in live_instances}
            
            for cluster_id, cluster_info in self.active_instances.items():
                instance_id = cluster_info["instance_id"]
                
                if instance_id in live_instance_ids:
                    cluster_status = "running"
                    hours_active = (datetime.now() - datetime.fromisoformat(cluster_info["deployed_at"])).total_seconds() / 3600
                    current_cost = hours_active * cluster_info["cost_per_hour"]
                    
                    status_report["total_hourly_cost"] += cluster_info["cost_per_hour"]
                else:
                    cluster_status = "terminated"
                    current_cost = self.cost_tracking.get(cluster_id, 0)
                
                status_report["clusters"].append({
                    "cluster_id": cluster_id,
                    "status": cluster_status,
                    "purpose": cluster_info["purpose"],
                    "gpu_model": cluster_info["gpu_model"],
                    "cost_per_hour": cluster_info["cost_per_hour"],
                    "total_cost": current_cost,
                    "deployed_at": cluster_info["deployed_at"]
                })
        
        return status_report
    
    async def terminate_cluster(self, cluster_id: str) -> Dict[str, Any]:
        """Terminate specific cluster"""
        if cluster_id not in self.active_instances:
            return {"error": f"Cluster {cluster_id} not found"}
        
        cluster_info = self.active_instances[cluster_id]
        instance_id = cluster_info["instance_id"]
        
        async with VastAIClient(self.vast_api_key) as client:
            success = await client.destroy_instance(instance_id)
            
            if success:
                # Calculate final cost
                hours_active = (datetime.now() - datetime.fromisoformat(cluster_info["deployed_at"])).total_seconds() / 3600
                final_cost = hours_active * cluster_info["cost_per_hour"]
                self.cost_tracking[cluster_id] = final_cost
                
                del self.active_instances[cluster_id]
                
                return {
                    "success": True,
                    "cluster_id": cluster_id,
                    "final_cost": final_cost,
                    "hours_active": hours_active,
                    "terminated_at": datetime.now().isoformat()
                }
            else:
                return {"error": f"Failed to terminate cluster {cluster_id}"}
    
    async def optimize_costs(self) -> Dict[str, Any]:
        """Analyze and optimize compute costs"""
        optimization_report = {
            "current_hourly_cost": 0,
            "optimization_suggestions": [],
            "potential_savings": 0,
            "analysis_time": datetime.now().isoformat()
        }
        
        async with VastAIClient(self.vast_api_key) as client:
            for cluster_id, cluster_info in self.active_instances.items():
                current_cost = cluster_info["cost_per_hour"]
                optimization_report["current_hourly_cost"] += current_cost
                
                # Find cheaper alternatives
                requirements = {
                    "gpu_model": cluster_info["gpu_model"],
                    "max_cost_per_hour": current_cost * 0.8
                }
                
                cheaper_offers = await client.search_offers(requirements)
                if cheaper_offers:
                    best_alternative = min(cheaper_offers, key=lambda x: float(x.get("dph_base", 999)))
                    potential_saving = current_cost - float(best_alternative.get("dph_base", current_cost))
                    
                    if potential_saving > 0.1:  # Only suggest if saving > $0.10/hour
                        optimization_report["optimization_suggestions"].append({
                            "cluster_id": cluster_id,
                            "current_cost": current_cost,
                            "suggested_cost": float(best_alternative.get("dph_base")),
                            "hourly_savings": potential_saving,
                            "daily_savings": potential_saving * 24,
                            "action": f"Migrate to {best_alternative.get('gpu_name')} instance"
                        })
                        optimization_report["potential_savings"] += potential_saving
        
        return optimization_report

async def deploy_vastai_compute_orchestrator():
    """Deploy vast.ai compute orchestration system"""
    
    # Example usage
    print("🚀 Vast.ai Compute Market Orchestrator")
    print("=====================================")
    
    # You would initialize with your actual API key
    # orchestrator = ComputeMarketOrchestrator("your_vast_api_key")
    
    print("✅ Compute orchestration capabilities:")
    print("   • Dynamic GPU cluster deployment")
    print("   • Real-time cost optimization")
    print("   • Multi-provider resource management")
    print("   • Automated training cluster setup")
    print("   • Inference server deployment")
    print("   • Performance monitoring")
    print("   • Cost analysis and recommendations")
    
    return {
        "status": "ready",
        "capabilities": [
            "gpu_cluster_deployment",
            "cost_optimization",
            "training_automation",
            "inference_serving",
            "performance_monitoring"
        ]
    }

if __name__ == "__main__":
    asyncio.run(deploy_vastai_compute_orchestrator())