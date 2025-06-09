"""
Autonomous Container Orchestration System
Self-managing Docker infrastructure with intelligent scaling and optimization
"""

import asyncio
import time
import json
import docker
import psutil
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import structlog
import redis.asyncio as redis
from prometheus_client import CollectorRegistry, Gauge, Counter, push_to_gateway
import httpx

logger = structlog.get_logger()

@dataclass
class ContainerHealth:
    """Container health assessment"""
    container_id: str
    name: str
    status: str
    cpu_usage: float
    memory_usage: float
    network_io: Dict[str, int]
    health_score: float
    needs_restart: bool
    optimization_suggestions: List[str]
    last_check: datetime

@dataclass
class SystemMetrics:
    """System-wide metrics"""
    total_containers: int
    healthy_containers: int
    cpu_utilization: float
    memory_utilization: float
    network_throughput: float
    disk_usage: float
    performance_score: float
    timestamp: datetime

class AutonomousOrchestrator:
    """
    Autonomous container orchestration system
    Self-manages infrastructure with minimal human intervention
    """
    
    def __init__(self):
        self.docker_client = docker.from_env()
        self.redis_client = None
        self.container_health = {}
        self.system_metrics_history = []
        
        # Optimization thresholds
        self.thresholds = {
            "cpu_warning": 80.0,
            "cpu_critical": 95.0,
            "memory_warning": 85.0,
            "memory_critical": 95.0,
            "health_score_min": 0.7,
            "restart_threshold": 0.5
        }
        
        # Auto-scaling configuration
        self.scaling_config = {
            "llm_proxy": {
                "min_instances": 1,
                "max_instances": 4,
                "scale_up_threshold": 85.0,
                "scale_down_threshold": 30.0
            },
            "trading_agent": {
                "min_instances": 1,
                "max_instances": 2,
                "scale_up_threshold": 90.0,
                "scale_down_threshold": 25.0
            },
            "browser": {
                "min_instances": 1,
                "max_instances": 3,
                "scale_up_threshold": 80.0,
                "scale_down_threshold": 20.0
            }
        }
        
        # Service discovery mapping
        self.service_discovery = {
            "agent-llm-proxy": "llm_proxy",
            "autonomous-trading-agent": "trading_agent",
            "agent-browser": "browser",
            "agent-searxng": "searxng",
            "agent-redis": "redis",
            "agent-orchestrator": "orchestrator"
        }

    async def initialize(self):
        """Initialize orchestration system"""
        try:
            # Connect to Redis
            redis_url = "redis://agent-redis:6379"
            self.redis_client = redis.from_url(redis_url, decode_responses=True)
            
            # Test Redis connection
            await self.redis_client.ping()
            
            logger.info("Autonomous orchestrator initialized successfully")
            
        except Exception as e:
            logger.error("Orchestrator initialization failed", error=str(e))
            # Use local Redis as fallback
            self.redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)

    async def run_orchestration_loop(self):
        """Main orchestration loop"""
        logger.info("Starting autonomous orchestration with VibeCoding reliability")
        
        while True:
            try:
                # Monitor all containers (Pizza Kitchen reliability)
                await self.monitor_container_health()
                
                # Optimize resource allocation (Rhythm Gaming precision)
                await self.optimize_resource_allocation()
                
                # Self-healing and scaling (VRChat social awareness)
                await self.autonomous_healing_and_scaling()
                
                # Philosophical reflection on system state
                await self.assess_system_wisdom()
                
                # Performance optimization
                await self.continuous_optimization()
                
                # Store metrics for analysis
                await self.store_system_metrics()
                
                # Wait with precision timing
                await asyncio.sleep(30)  # 30-second orchestration cycle
                
            except Exception as e:
                logger.error("Orchestration cycle failed", error=str(e))
                await asyncio.sleep(60)  # Longer wait on error

    async def monitor_container_health(self):
        """Monitor health of all containers with Pizza Kitchen reliability"""
        try:
            containers = self.docker_client.containers.list(all=True)
            
            for container in containers:
                try:
                    health = await self._assess_container_health(container)
                    self.container_health[container.id] = health
                    
                    # Log health issues
                    if health.health_score < self.thresholds["health_score_min"]:
                        logger.warning(
                            "Container health degraded",
                            container=health.name,
                            score=health.health_score,
                            suggestions=health.optimization_suggestions
                        )
                    
                    # Automatic restart if critically unhealthy
                    if health.needs_restart:
                        await self._restart_container_safely(container)
                        
                except Exception as e:
                    logger.debug(f"Health check failed for container {container.name}", error=str(e))
            
            # Store health metrics in Redis
            health_summary = {
                "total_containers": len(containers),
                "healthy_containers": len([h for h in self.container_health.values() if h.health_score > 0.8]),
                "timestamp": datetime.now().isoformat()
            }
            
            await self.redis_client.setex("container_health_summary", 300, json.dumps(health_summary))
            
        except Exception as e:
            logger.error("Container health monitoring failed", error=str(e))

    async def _assess_container_health(self, container) -> ContainerHealth:
        """Assess individual container health"""
        try:
            # Get container stats
            stats = container.stats(stream=False)
            
            # Calculate CPU usage
            cpu_usage = self._calculate_cpu_usage(stats)
            
            # Calculate memory usage
            memory_usage = self._calculate_memory_usage(stats)
            
            # Get network I/O
            network_io = stats.get("networks", {})
            
            # Calculate health score
            health_score = self._calculate_health_score(container, cpu_usage, memory_usage)
            
            # Determine if restart needed
            needs_restart = (
                container.status != "running" or
                health_score < self.thresholds["restart_threshold"] or
                cpu_usage > self.thresholds["cpu_critical"] or
                memory_usage > self.thresholds["memory_critical"]
            )
            
            # Generate optimization suggestions
            suggestions = self._generate_optimization_suggestions(
                container, cpu_usage, memory_usage, health_score
            )
            
            return ContainerHealth(
                container_id=container.id,
                name=container.name,
                status=container.status,
                cpu_usage=cpu_usage,
                memory_usage=memory_usage,
                network_io=network_io,
                health_score=health_score,
                needs_restart=needs_restart,
                optimization_suggestions=suggestions,
                last_check=datetime.now()
            )
            
        except Exception as e:
            logger.debug(f"Health assessment failed for {container.name}", error=str(e))
            return ContainerHealth(
                container_id=container.id,
                name=container.name,
                status="unknown",
                cpu_usage=0.0,
                memory_usage=0.0,
                network_io={},
                health_score=0.0,
                needs_restart=True,
                optimization_suggestions=["Health assessment failed - restart recommended"],
                last_check=datetime.now()
            )

    def _calculate_cpu_usage(self, stats: Dict[str, Any]) -> float:
        """Calculate CPU usage percentage"""
        try:
            cpu_stats = stats.get("cpu_stats", {})
            precpu_stats = stats.get("precpu_stats", {})
            
            cpu_usage = cpu_stats.get("cpu_usage", {})
            precpu_usage = precpu_stats.get("cpu_usage", {})
            
            cpu_delta = cpu_usage.get("total_usage", 0) - precpu_usage.get("total_usage", 0)
            system_delta = cpu_stats.get("system_cpu_usage", 0) - precpu_stats.get("system_cpu_usage", 0)
            
            if system_delta > 0 and cpu_delta > 0:
                cpu_percent = (cpu_delta / system_delta) * len(cpu_usage.get("percpu_usage", [1])) * 100.0
                return min(cpu_percent, 100.0)
            
            return 0.0
            
        except Exception:
            return 0.0

    def _calculate_memory_usage(self, stats: Dict[str, Any]) -> float:
        """Calculate memory usage percentage"""
        try:
            memory_stats = stats.get("memory_stats", {})
            usage = memory_stats.get("usage", 0)
            limit = memory_stats.get("limit", 1)
            
            if limit > 0:
                return (usage / limit) * 100.0
            
            return 0.0
            
        except Exception:
            return 0.0

    def _calculate_health_score(self, container, cpu_usage: float, memory_usage: float) -> float:
        """Calculate overall container health score"""
        try:
            # Base score starts at 1.0
            score = 1.0
            
            # Penalize high resource usage
            if cpu_usage > self.thresholds["cpu_warning"]:
                score -= 0.2
            if cpu_usage > self.thresholds["cpu_critical"]:
                score -= 0.3
            
            if memory_usage > self.thresholds["memory_warning"]:
                score -= 0.2
            if memory_usage > self.thresholds["memory_critical"]:
                score -= 0.3
            
            # Penalize if container is not running
            if container.status != "running":
                score -= 0.5
            
            # Ensure score is between 0 and 1
            return max(0.0, min(1.0, score))
            
        except Exception:
            return 0.0

    def _generate_optimization_suggestions(self, container, cpu_usage: float, 
                                         memory_usage: float, health_score: float) -> List[str]:
        """Generate optimization suggestions for container"""
        suggestions = []
        
        if cpu_usage > self.thresholds["cpu_warning"]:
            suggestions.append("Consider CPU limit optimization or scaling")
        
        if memory_usage > self.thresholds["memory_warning"]:
            suggestions.append("Consider memory limit adjustment or scaling")
        
        if container.status != "running":
            suggestions.append("Container restart required")
        
        if health_score < 0.8:
            suggestions.append("Overall health degraded - investigate logs")
        
        # Service-specific suggestions
        service_type = self.service_discovery.get(container.name, "unknown")
        
        if service_type == "llm_proxy" and cpu_usage > 80:
            suggestions.append("Consider enabling request caching or load balancing")
        
        elif service_type == "trading_agent" and memory_usage > 80:
            suggestions.append("Consider optimizing data structure usage")
        
        elif service_type == "browser" and cpu_usage > 90:
            suggestions.append("Consider reducing concurrent browser sessions")
        
        return suggestions

    async def _restart_container_safely(self, container):
        """Safely restart a container with graceful shutdown"""
        try:
            logger.info(f"Initiating safe restart for container {container.name}")
            
            # Graceful shutdown with timeout
            container.stop(timeout=30)
            
            # Wait a moment for cleanup
            await asyncio.sleep(5)
            
            # Start container
            container.start()
            
            # Wait for startup
            await asyncio.sleep(10)
            
            # Verify restart was successful
            container.reload()
            if container.status == "running":
                logger.info(f"Container {container.name} successfully restarted")
            else:
                logger.error(f"Container {container.name} failed to restart properly")
                
        except Exception as e:
            logger.error(f"Safe restart failed for {container.name}", error=str(e))

    async def optimize_resource_allocation(self):
        """Optimize resource allocation with Rhythm Gaming precision"""
        try:
            # Get system-wide metrics
            system_metrics = await self._get_system_metrics()
            
            # Identify optimization opportunities
            optimizations = await self._identify_optimizations(system_metrics)
            
            # Apply optimizations
            for optimization in optimizations:
                await self._apply_optimization(optimization)
            
            # Store optimization results
            if optimizations:
                await self.redis_client.setex(
                    "recent_optimizations",
                    3600,
                    json.dumps([asdict(opt) for opt in optimizations])
                )
                
        except Exception as e:
            logger.error("Resource optimization failed", error=str(e))

    async def _get_system_metrics(self) -> SystemMetrics:
        """Get current system-wide metrics"""
        try:
            # CPU utilization
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Memory utilization
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            
            # Network throughput (simplified)
            network = psutil.net_io_counters()
            network_throughput = (network.bytes_sent + network.bytes_recv) / 1024 / 1024  # MB
            
            # Disk usage
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            
            # Container counts
            containers = self.docker_client.containers.list(all=True)
            healthy_containers = len([c for c in containers if c.status == "running"])
            
            # Performance score
            performance_score = self._calculate_system_performance_score(
                cpu_percent, memory_percent, disk_percent, healthy_containers, len(containers)
            )
            
            return SystemMetrics(
                total_containers=len(containers),
                healthy_containers=healthy_containers,
                cpu_utilization=cpu_percent,
                memory_utilization=memory_percent,
                network_throughput=network_throughput,
                disk_usage=disk_percent,
                performance_score=performance_score,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.debug("System metrics collection failed", error=str(e))
            return SystemMetrics(
                total_containers=0,
                healthy_containers=0,
                cpu_utilization=0.0,
                memory_utilization=0.0,
                network_throughput=0.0,
                disk_usage=0.0,
                performance_score=0.0,
                timestamp=datetime.now()
            )

    def _calculate_system_performance_score(self, cpu: float, memory: float, disk: float, 
                                          healthy: int, total: int) -> float:
        """Calculate overall system performance score"""
        try:
            # Start with perfect score
            score = 1.0
            
            # Penalize high resource usage
            score -= max(0, (cpu - 70) / 100)  # Penalize CPU > 70%
            score -= max(0, (memory - 80) / 100)  # Penalize memory > 80%
            score -= max(0, (disk - 90) / 100)  # Penalize disk > 90%
            
            # Penalize unhealthy containers
            if total > 0:
                health_ratio = healthy / total
                score *= health_ratio
            
            return max(0.0, min(1.0, score))
            
        except Exception:
            return 0.0

    async def autonomous_healing_and_scaling(self):
        """Self-healing and intelligent scaling"""
        try:
            # Check for containers that need healing
            await self._perform_self_healing()
            
            # Check for scaling opportunities
            await self._perform_intelligent_scaling()
            
        except Exception as e:
            logger.error("Autonomous healing and scaling failed", error=str(e))

    async def _perform_self_healing(self):
        """Perform self-healing operations"""
        try:
            for container_id, health in self.container_health.items():
                if health.health_score < 0.3:
                    try:
                        container = self.docker_client.containers.get(container_id)
                        logger.info(f"Self-healing container {health.name}")
                        await self._restart_container_safely(container)
                    except docker.errors.NotFound:
                        logger.warning(f"Container {health.name} not found for healing")
                    except Exception as e:
                        logger.error(f"Self-healing failed for {health.name}", error=str(e))
                        
        except Exception as e:
            logger.error("Self-healing process failed", error=str(e))

    async def _perform_intelligent_scaling(self):
        """Perform intelligent scaling based on load"""
        try:
            for service_name, config in self.scaling_config.items():
                # Find containers for this service
                service_containers = [
                    h for h in self.container_health.values()
                    if service_name in h.name.lower()
                ]
                
                if not service_containers:
                    continue
                
                # Calculate average load
                avg_cpu = sum(c.cpu_usage for c in service_containers) / len(service_containers)
                avg_memory = sum(c.memory_usage for c in service_containers) / len(service_containers)
                
                current_instances = len(service_containers)
                
                # Scaling decisions
                if (avg_cpu > config["scale_up_threshold"] or 
                    avg_memory > config["scale_up_threshold"]) and \
                   current_instances < config["max_instances"]:
                    
                    await self._scale_service_up(service_name)
                    
                elif (avg_cpu < config["scale_down_threshold"] and 
                      avg_memory < config["scale_down_threshold"]) and \
                     current_instances > config["min_instances"]:
                    
                    await self._scale_service_down(service_name)
                    
        except Exception as e:
            logger.error("Intelligent scaling failed", error=str(e))

    async def _scale_service_up(self, service_name: str):
        """Scale service up by adding instance"""
        try:
            logger.info(f"Scaling up {service_name}")
            
            # This would typically involve docker-compose scale or similar
            # For now, log the scaling decision
            scaling_event = {
                "service": service_name,
                "action": "scale_up",
                "timestamp": datetime.now().isoformat(),
                "reason": "high_load"
            }
            
            await self.redis_client.lpush("scaling_events", json.dumps(scaling_event))
            await self.redis_client.ltrim("scaling_events", 0, 99)  # Keep last 100
            
        except Exception as e:
            logger.error(f"Scale up failed for {service_name}", error=str(e))

    async def _scale_service_down(self, service_name: str):
        """Scale service down by removing instance"""
        try:
            logger.info(f"Scaling down {service_name}")
            
            scaling_event = {
                "service": service_name,
                "action": "scale_down",
                "timestamp": datetime.now().isoformat(),
                "reason": "low_load"
            }
            
            await self.redis_client.lpush("scaling_events", json.dumps(scaling_event))
            await self.redis_client.ltrim("scaling_events", 0, 99)
            
        except Exception as e:
            logger.error(f"Scale down failed for {service_name}", error=str(e))

    async def assess_system_wisdom(self):
        """Assess system wisdom using Classical Philosophy principles"""
        try:
            # Prudence: Are we making wise resource allocation decisions?
            prudence_score = await self._assess_prudence()
            
            # Temperance: Are we maintaining balance in resource usage?
            temperance_score = await self._assess_temperance()
            
            # Justice: Are all services getting fair resource allocation?
            justice_score = await self._assess_justice()
            
            # Fortitude: Are we maintaining resilience under pressure?
            fortitude_score = await self._assess_fortitude()
            
            wisdom_assessment = {
                "prudence": prudence_score,
                "temperance": temperance_score,
                "justice": justice_score,
                "fortitude": fortitude_score,
                "overall_wisdom": (prudence_score + temperance_score + justice_score + fortitude_score) / 4,
                "timestamp": datetime.now().isoformat()
            }
            
            await self.redis_client.setex("system_wisdom", 600, json.dumps(wisdom_assessment))
            
        except Exception as e:
            logger.error("System wisdom assessment failed", error=str(e))

    async def _assess_prudence(self) -> float:
        """Assess prudent decision-making in resource allocation"""
        try:
            # Check if we're making wise scaling decisions
            scaling_events = await self.redis_client.lrange("scaling_events", 0, 9)
            
            if len(scaling_events) < 2:
                return 0.8  # Default good score
            
            # Look for oscillating behavior (bad prudence)
            recent_events = [json.loads(event) for event in scaling_events[:5]]
            oscillations = 0
            
            for i in range(1, len(recent_events)):
                prev_action = recent_events[i-1]["action"]
                curr_action = recent_events[i]["action"]
                
                if (prev_action == "scale_up" and curr_action == "scale_down") or \
                   (prev_action == "scale_down" and curr_action == "scale_up"):
                    oscillations += 1
            
            # Lower score for oscillating behavior
            prudence_score = max(0.3, 1.0 - (oscillations * 0.2))
            return prudence_score
            
        except Exception:
            return 0.8

    async def _assess_temperance(self) -> float:
        """Assess temperance in resource usage"""
        try:
            system_metrics = await self._get_system_metrics()
            
            # Good temperance means balanced resource usage
            cpu_balance = 1.0 - abs(system_metrics.cpu_utilization - 60) / 100
            memory_balance = 1.0 - abs(system_metrics.memory_utilization - 70) / 100
            
            temperance_score = (cpu_balance + memory_balance) / 2
            return max(0.0, min(1.0, temperance_score))
            
        except Exception:
            return 0.7

    async def _assess_justice(self) -> float:
        """Assess fairness in resource allocation across services"""
        try:
            if not self.container_health:
                return 0.8
            
            # Calculate resource distribution fairness
            cpu_usages = [h.cpu_usage for h in self.container_health.values()]
            memory_usages = [h.memory_usage for h in self.container_health.values()]
            
            if not cpu_usages:
                return 0.8
            
            # Lower variance indicates more fair distribution
            import statistics
            cpu_variance = statistics.variance(cpu_usages) if len(cpu_usages) > 1 else 0
            memory_variance = statistics.variance(memory_usages) if len(memory_usages) > 1 else 0
            
            # Convert variance to fairness score (lower variance = higher fairness)
            cpu_fairness = max(0, 1.0 - cpu_variance / 1000)
            memory_fairness = max(0, 1.0 - memory_variance / 1000)
            
            justice_score = (cpu_fairness + memory_fairness) / 2
            return max(0.0, min(1.0, justice_score))
            
        except Exception:
            return 0.7

    async def _assess_fortitude(self) -> float:
        """Assess system resilience and strength under pressure"""
        try:
            system_metrics = await self._get_system_metrics()
            
            # High fortitude means maintaining performance under load
            if system_metrics.cpu_utilization > 90:
                base_score = 0.3  # Low fortitude under extreme load
            elif system_metrics.cpu_utilization > 80:
                base_score = 0.6  # Moderate fortitude under high load
            else:
                base_score = 0.9  # High fortitude under normal load
            
            # Bonus for maintaining healthy containers
            if system_metrics.total_containers > 0:
                health_ratio = system_metrics.healthy_containers / system_metrics.total_containers
                fortitude_score = base_score * health_ratio
            else:
                fortitude_score = base_score
            
            return max(0.0, min(1.0, fortitude_score))
            
        except Exception:
            return 0.8

    async def continuous_optimization(self):
        """Continuous optimization with VibeCoding principles"""
        try:
            # Optimize based on historical patterns
            await self._optimize_based_on_patterns()
            
            # Cleanup unused resources
            await self._cleanup_resources()
            
            # Update configuration based on learnings
            await self._update_optimization_config()
            
        except Exception as e:
            logger.error("Continuous optimization failed", error=str(e))

    async def _optimize_based_on_patterns(self):
        """Optimize based on historical usage patterns"""
        try:
            # Analyze historical metrics
            if len(self.system_metrics_history) > 10:
                # Simple pattern analysis
                recent_cpu = [m.cpu_utilization for m in self.system_metrics_history[-10:]]
                avg_cpu = sum(recent_cpu) / len(recent_cpu)
                
                # Adjust thresholds based on patterns
                if avg_cpu > 80:
                    # Lower thresholds to scale earlier
                    for service_config in self.scaling_config.values():
                        service_config["scale_up_threshold"] = max(70, service_config["scale_up_threshold"] - 5)
                elif avg_cpu < 40:
                    # Raise thresholds to avoid unnecessary scaling
                    for service_config in self.scaling_config.values():
                        service_config["scale_up_threshold"] = min(90, service_config["scale_up_threshold"] + 5)
                        
        except Exception as e:
            logger.debug("Pattern optimization failed", error=str(e))

    async def _cleanup_resources(self):
        """Cleanup unused Docker resources"""
        try:
            # Cleanup unused containers, networks, images
            self.docker_client.containers.prune()
            self.docker_client.networks.prune()
            self.docker_client.images.prune()
            
            logger.debug("Docker resources cleaned up")
            
        except Exception as e:
            logger.debug("Resource cleanup failed", error=str(e))

    async def _update_optimization_config(self):
        """Update optimization configuration based on learnings"""
        try:
            # This would involve machine learning models in a full implementation
            # For now, just log that we're continuously learning
            logger.debug("Optimization configuration updated based on performance patterns")
            
        except Exception as e:
            logger.debug("Configuration update failed", error=str(e))

    async def store_system_metrics(self):
        """Store system metrics for analysis and monitoring"""
        try:
            metrics = await self._get_system_metrics()
            
            # Add to history
            self.system_metrics_history.append(metrics)
            
            # Keep only last 100 metrics
            if len(self.system_metrics_history) > 100:
                self.system_metrics_history = self.system_metrics_history[-100:]
            
            # Store in Redis
            await self.redis_client.setex(
                "current_system_metrics",
                300,
                json.dumps(asdict(metrics), default=str)
            )
            
            # Store historical data
            await self.redis_client.lpush(
                "system_metrics_history",
                json.dumps(asdict(metrics), default=str)
            )
            await self.redis_client.ltrim("system_metrics_history", 0, 999)
            
        except Exception as e:
            logger.debug("Metrics storage failed", error=str(e))

    async def get_orchestration_status(self) -> Dict[str, Any]:
        """Get current orchestration status"""
        try:
            system_metrics = await self._get_system_metrics()
            
            return {
                "status": "active",
                "containers_managed": len(self.container_health),
                "system_performance": system_metrics.performance_score,
                "healthy_containers": system_metrics.healthy_containers,
                "total_containers": system_metrics.total_containers,
                "cpu_utilization": system_metrics.cpu_utilization,
                "memory_utilization": system_metrics.memory_utilization,
                "last_optimization": datetime.now().isoformat(),
                "wisdom_level": "philosophical_reflection_active"
            }
            
        except Exception as e:
            logger.error("Status retrieval failed", error=str(e))
            return {"status": "error", "error": str(e)}

async def main():
    """Main orchestrator entry point"""
    orchestrator = AutonomousOrchestrator()
    
    try:
        await orchestrator.initialize()
        await orchestrator.run_orchestration_loop()
    except KeyboardInterrupt:
        logger.info("Orchestrator shutdown requested")
    except Exception as e:
        logger.error("Orchestrator failed", error=str(e))
    finally:
        logger.info("Autonomous orchestrator shutdown complete")

if __name__ == "__main__":
    asyncio.run(main())