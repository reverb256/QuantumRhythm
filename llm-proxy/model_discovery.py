"""
Intelligent Model Discovery and Optimization System
Automatically discovers, evaluates, and optimizes AI model usage
Implements dynamic rate limiting and cost optimization
"""

import asyncio
import time
import json
import hashlib
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import httpx
import structlog
import redis.asyncio as redis
from enum import Enum

logger = structlog.get_logger()

class ModelProvider(Enum):
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    HUGGINGFACE = "huggingface"
    IO_INTELLIGENCE = "io_intelligence"

@dataclass
class ModelCapability:
    """Model capability assessment"""
    model_id: str
    provider: ModelProvider
    max_tokens: int
    cost_per_1k_tokens: float
    latency_percentile_95: float
    accuracy_score: float
    reliability_score: float
    context_window: int
    supports_streaming: bool
    supports_function_calling: bool
    specialized_tasks: List[str]
    rate_limits: Dict[str, int]
    availability_score: float
    last_updated: datetime

@dataclass
class ModelPerformance:
    """Real-time model performance metrics"""
    model_id: str
    requests_per_minute: int
    average_latency: float
    error_rate: float
    cost_efficiency: float
    user_satisfaction: float
    success_rate: float
    throughput_score: float
    queue_depth: int
    last_measurement: datetime

@dataclass
class RateLimitState:
    """Current rate limit state for a model"""
    model_id: str
    requests_remaining: int
    tokens_remaining: int
    reset_time: datetime
    daily_usage: int
    monthly_usage: int
    cost_accumulated: float
    overage_risk: float

class IntelligentModelDiscovery:
    """
    Intelligent model discovery and optimization system
    Automatically finds the best model for each task while respecting limits
    """
    
    def __init__(self, redis_client: redis.Redis):
        self.redis_client = redis_client
        self.model_capabilities: Dict[str, ModelCapability] = {}
        self.model_performance: Dict[str, ModelPerformance] = {}
        self.rate_limits: Dict[str, RateLimitState] = {}
        
        # Model discovery endpoints
        self.discovery_endpoints = {
            ModelProvider.ANTHROPIC: {
                "base_url": "https://api.anthropic.com",
                "models_endpoint": "/v1/models",
                "known_models": [
                    "claude-sonnet-4-20250514",  # Latest as of knowledge cutoff
                    "claude-3-7-sonnet-20250219",
                    "claude-3-opus-20240229",
                    "claude-3-sonnet-20240229",
                    "claude-3-haiku-20240307"
                ]
            },
            ModelProvider.OPENAI: {
                "base_url": "https://api.openai.com",
                "models_endpoint": "/v1/models",
                "known_models": [
                    "gpt-4-turbo-preview",
                    "gpt-4",
                    "gpt-3.5-turbo",
                    "gpt-3.5-turbo-16k"
                ]
            },
            ModelProvider.HUGGINGFACE: {
                "base_url": "https://api-inference.huggingface.co",
                "models_endpoint": "/models",
                "known_models": [
                    "microsoft/DialoGPT-large",
                    "facebook/blenderbot-400M-distill",
                    "microsoft/GODEL-v1_1-large-seq2seq"
                ]
            },
            ModelProvider.IO_INTELLIGENCE: {
                "base_url": "https://api.iointelligence.ai",
                "models_endpoint": "/v1/models",
                "known_models": []  # Will be discovered dynamically
            }
        }
        
        # Performance optimization weights
        self.optimization_weights = {
            "latency": 0.25,
            "cost": 0.20,
            "accuracy": 0.25,
            "reliability": 0.20,
            "availability": 0.10
        }
        
        # Task-specific model preferences
        self.task_model_mapping = {
            "trading_analysis": ["claude-sonnet-4-20250514", "gpt-4"],
            "sentiment_analysis": ["claude-3-haiku-20240307", "gpt-3.5-turbo"],
            "content_filtering": ["claude-3-sonnet-20240229", "gpt-3.5-turbo"],
            "general_chat": ["claude-sonnet-4-20250514", "gpt-4-turbo-preview"],
            "code_analysis": ["claude-sonnet-4-20250514", "gpt-4"],
            "summarization": ["claude-3-haiku-20240307", "gpt-3.5-turbo-16k"]
        }

    async def discover_available_models(self) -> Dict[str, ModelCapability]:
        """
        Discover all available models across providers
        Cache results for performance optimization
        """
        try:
            cache_key = "model_discovery_cache"
            cached_models = await self.redis_client.get(cache_key)
            
            if cached_models:
                # Use cached results if less than 1 hour old
                try:
                    cached_data = json.loads(cached_models)
                    cache_time = datetime.fromisoformat(cached_data.get("timestamp", ""))
                    if datetime.now() - cache_time < timedelta(hours=1):
                        logger.info("Using cached model discovery results")
                        return {k: ModelCapability(**v) for k, v in cached_data["models"].items()}
                except Exception as e:
                    logger.debug("Cache parsing failed", error=str(e))
            
            discovered_models = {}
            
            # Discover models from each provider in parallel
            tasks = []
            for provider in ModelProvider:
                task = self._discover_provider_models(provider)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Aggregate results
            for provider, result in zip(ModelProvider, results):
                if isinstance(result, Exception):
                    logger.warning(f"Model discovery failed for {provider.value}", error=str(result))
                    continue
                
                if result:
                    discovered_models.update(result)
            
            # Cache the results
            cache_data = {
                "timestamp": datetime.now().isoformat(),
                "models": {k: asdict(v) for k, v in discovered_models.items()}
            }
            await self.redis_client.setex(
                cache_key, 
                3600,  # 1 hour cache
                json.dumps(cache_data, default=str)
            )
            
            self.model_capabilities = discovered_models
            logger.info(f"Discovered {len(discovered_models)} models across all providers")
            
            return discovered_models
            
        except Exception as e:
            logger.error("Model discovery failed", error=str(e))
            return {}

    async def _discover_provider_models(self, provider: ModelProvider) -> Dict[str, ModelCapability]:
        """Discover models from a specific provider"""
        try:
            provider_config = self.discovery_endpoints[provider]
            discovered = {}
            
            # Start with known models
            for model_id in provider_config["known_models"]:
                capability = await self._assess_model_capability(model_id, provider)
                if capability:
                    discovered[model_id] = capability
            
            # Try to discover additional models via API
            try:
                api_models = await self._query_provider_api(provider)
                for model_data in api_models:
                    model_id = model_data.get("id", model_data.get("name", ""))
                    if model_id and model_id not in discovered:
                        capability = await self._assess_model_capability(model_id, provider, model_data)
                        if capability:
                            discovered[model_id] = capability
            except Exception as e:
                logger.debug(f"API discovery failed for {provider.value}", error=str(e))
            
            return discovered
            
        except Exception as e:
            logger.error(f"Provider model discovery failed for {provider.value}", error=str(e))
            return {}

    async def _query_provider_api(self, provider: ModelProvider) -> List[Dict[str, Any]]:
        """Query provider API for available models"""
        try:
            config = self.discovery_endpoints[provider]
            
            # Get API key for provider
            api_key = self._get_provider_api_key(provider)
            if not api_key:
                return []
            
            headers = self._get_provider_headers(provider, api_key)
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{config['base_url']}{config['models_endpoint']}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, dict) and "data" in data:
                        return data["data"]
                    elif isinstance(data, list):
                        return data
                    else:
                        return []
                else:
                    logger.debug(f"API query failed for {provider.value}", 
                               status_code=response.status_code)
                    return []
                    
        except Exception as e:
            logger.debug(f"Provider API query failed for {provider.value}", error=str(e))
            return []

    def _get_provider_api_key(self, provider: ModelProvider) -> Optional[str]:
        """Get API key for provider"""
        key_mapping = {
            ModelProvider.ANTHROPIC: "ANTHROPIC_API_KEY",
            ModelProvider.OPENAI: "OPENAI_API_KEY", 
            ModelProvider.HUGGINGFACE: "HUGGINGFACE_API_KEY",
            ModelProvider.IO_INTELLIGENCE: "IO_INTELLIGENCE_API_KEY"
        }
        
        env_var = key_mapping.get(provider)
        if env_var:
            import os
            return os.getenv(env_var)
        return None

    def _get_provider_headers(self, provider: ModelProvider, api_key: str) -> Dict[str, str]:
        """Get headers for provider API requests"""
        base_headers = {"Content-Type": "application/json"}
        
        if provider == ModelProvider.ANTHROPIC:
            base_headers["x-api-key"] = api_key
            base_headers["anthropic-version"] = "2023-06-01"
        elif provider == ModelProvider.OPENAI:
            base_headers["Authorization"] = f"Bearer {api_key}"
        elif provider == ModelProvider.HUGGINGFACE:
            base_headers["Authorization"] = f"Bearer {api_key}"
        elif provider == ModelProvider.IO_INTELLIGENCE:
            base_headers["Authorization"] = f"Bearer {api_key}"
        
        return base_headers

    async def _assess_model_capability(self, model_id: str, provider: ModelProvider, 
                                     model_data: Optional[Dict[str, Any]] = None) -> Optional[ModelCapability]:
        """Assess a model's capabilities and create capability profile"""
        try:
            # Default capabilities based on known information
            default_capabilities = self._get_default_capabilities(model_id, provider)
            
            # Override with discovered data if available
            if model_data:
                default_capabilities.update(self._parse_model_metadata(model_data))
            
            # Test model performance if API key available
            performance_metrics = await self._test_model_performance(model_id, provider)
            if performance_metrics:
                default_capabilities.update(performance_metrics)
            
            return ModelCapability(
                model_id=model_id,
                provider=provider,
                max_tokens=default_capabilities.get("max_tokens", 4000),
                cost_per_1k_tokens=default_capabilities.get("cost_per_1k_tokens", 0.01),
                latency_percentile_95=default_capabilities.get("latency_p95", 2.0),
                accuracy_score=default_capabilities.get("accuracy", 0.85),
                reliability_score=default_capabilities.get("reliability", 0.9),
                context_window=default_capabilities.get("context_window", 8000),
                supports_streaming=default_capabilities.get("streaming", True),
                supports_function_calling=default_capabilities.get("function_calling", False),
                specialized_tasks=default_capabilities.get("specialized_tasks", []),
                rate_limits=default_capabilities.get("rate_limits", {"rpm": 60, "tpm": 60000}),
                availability_score=default_capabilities.get("availability", 0.95),
                last_updated=datetime.now()
            )
            
        except Exception as e:
            logger.debug(f"Model capability assessment failed for {model_id}", error=str(e))
            return None

    def _get_default_capabilities(self, model_id: str, provider: ModelProvider) -> Dict[str, Any]:
        """Get default capabilities based on known model characteristics"""
        defaults = {
            "max_tokens": 4000,
            "cost_per_1k_tokens": 0.01,
            "latency_p95": 2.0,
            "accuracy": 0.85,
            "reliability": 0.9,
            "context_window": 8000,
            "streaming": True,
            "function_calling": False,
            "specialized_tasks": [],
            "rate_limits": {"rpm": 60, "tpm": 60000},
            "availability": 0.95
        }
        
        # Model-specific overrides
        if "claude-sonnet-4" in model_id:
            defaults.update({
                "max_tokens": 4000,
                "cost_per_1k_tokens": 0.015,
                "accuracy": 0.95,
                "context_window": 200000,
                "specialized_tasks": ["reasoning", "analysis", "coding"],
                "rate_limits": {"rpm": 50, "tpm": 40000}
            })
        elif "claude-3-opus" in model_id:
            defaults.update({
                "max_tokens": 4000,
                "cost_per_1k_tokens": 0.075,
                "accuracy": 0.98,
                "context_window": 200000,
                "specialized_tasks": ["complex_reasoning", "creative_writing"],
                "rate_limits": {"rpm": 20, "tpm": 10000}
            })
        elif "claude-3-haiku" in model_id:
            defaults.update({
                "max_tokens": 4000,
                "cost_per_1k_tokens": 0.00025,
                "latency_p95": 0.8,
                "context_window": 200000,
                "specialized_tasks": ["fast_responses", "summarization"],
                "rate_limits": {"rpm": 100, "tpm": 100000}
            })
        elif "gpt-4" in model_id:
            defaults.update({
                "max_tokens": 4000,
                "cost_per_1k_tokens": 0.03,
                "accuracy": 0.92,
                "context_window": 8000 if "32k" not in model_id else 32000,
                "function_calling": True,
                "specialized_tasks": ["reasoning", "coding", "analysis"],
                "rate_limits": {"rpm": 40, "tpm": 40000}
            })
        elif "gpt-3.5-turbo" in model_id:
            defaults.update({
                "max_tokens": 4000,
                "cost_per_1k_tokens": 0.002,
                "latency_p95": 1.2,
                "context_window": 4000 if "16k" not in model_id else 16000,
                "function_calling": True,
                "specialized_tasks": ["general_chat", "summarization"],
                "rate_limits": {"rpm": 60, "tpm": 60000}
            })
        
        return defaults

    def _parse_model_metadata(self, model_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse model metadata from API response"""
        parsed = {}
        
        # Extract common metadata fields
        if "max_tokens" in model_data:
            parsed["max_tokens"] = model_data["max_tokens"]
        
        if "context_length" in model_data:
            parsed["context_window"] = model_data["context_length"]
        
        if "pricing" in model_data:
            pricing = model_data["pricing"]
            if "input_cost_per_token" in pricing:
                parsed["cost_per_1k_tokens"] = pricing["input_cost_per_token"] * 1000
        
        return parsed

    async def _test_model_performance(self, model_id: str, provider: ModelProvider) -> Optional[Dict[str, Any]]:
        """Test model performance with a lightweight request"""
        try:
            api_key = self._get_provider_api_key(provider)
            if not api_key:
                return None
            
            # Simple test prompt
            test_prompt = "Hello, how are you today?"
            
            start_time = time.time()
            
            # Make test request
            success = await self._make_test_request(model_id, provider, api_key, test_prompt)
            
            latency = time.time() - start_time
            
            if success:
                return {
                    "latency_p95": latency,
                    "availability": 1.0,
                    "reliability": 1.0
                }
            else:
                return {
                    "availability": 0.0,
                    "reliability": 0.0
                }
                
        except Exception as e:
            logger.debug(f"Performance test failed for {model_id}", error=str(e))
            return None

    async def _make_test_request(self, model_id: str, provider: ModelProvider, 
                               api_key: str, prompt: str) -> bool:
        """Make a test request to validate model availability"""
        try:
            config = self.discovery_endpoints[provider]
            headers = self._get_provider_headers(provider, api_key)
            
            # Provider-specific request formats
            if provider == ModelProvider.ANTHROPIC:
                payload = {
                    "model": model_id,
                    "max_tokens": 50,
                    "messages": [{"role": "user", "content": prompt}]
                }
                endpoint = "/v1/messages"
            elif provider == ModelProvider.OPENAI:
                payload = {
                    "model": model_id,
                    "max_tokens": 50,
                    "messages": [{"role": "user", "content": prompt}]
                }
                endpoint = "/v1/chat/completions"
            else:
                return False  # Unknown provider format
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{config['base_url']}{endpoint}",
                    headers=headers,
                    json=payload
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.debug(f"Test request failed for {model_id}", error=str(e))
            return False

    async def select_optimal_model(self, task_type: str, requirements: Dict[str, Any]) -> Optional[str]:
        """
        Select the optimal model for a specific task based on requirements
        Considers performance, cost, availability, and rate limits
        """
        try:
            # Get available models
            if not self.model_capabilities:
                await self.discover_available_models()
            
            # Get candidate models for task
            candidates = self._get_task_candidates(task_type)
            
            # Filter by requirements
            filtered_candidates = []
            for model_id in candidates:
                if model_id in self.model_capabilities:
                    capability = self.model_capabilities[model_id]
                    if self._meets_requirements(capability, requirements):
                        filtered_candidates.append(model_id)
            
            if not filtered_candidates:
                # Fall back to general models if no specialized ones available
                filtered_candidates = list(self.model_capabilities.keys())
            
            # Score candidates based on optimization criteria
            scored_models = []
            for model_id in filtered_candidates:
                score = await self._calculate_model_score(model_id, requirements)
                if score > 0:
                    scored_models.append((model_id, score))
            
            # Sort by score and return best available model
            scored_models.sort(key=lambda x: x[1], reverse=True)
            
            # Check rate limits for top models
            for model_id, score in scored_models:
                if await self._check_rate_limit_availability(model_id):
                    logger.info(f"Selected optimal model: {model_id} (score: {score:.2f})")
                    return model_id
            
            # If all models are rate limited, return the best one anyway
            if scored_models:
                model_id = scored_models[0][0]
                logger.warning(f"Selected rate-limited model: {model_id}")
                return model_id
            
            return None
            
        except Exception as e:
            logger.error("Model selection failed", error=str(e))
            return None

    def _get_task_candidates(self, task_type: str) -> List[str]:
        """Get candidate models for a specific task type"""
        candidates = self.task_model_mapping.get(task_type, [])
        
        # Add all available models as fallback
        all_models = list(self.model_capabilities.keys())
        
        # Combine and deduplicate
        return list(dict.fromkeys(candidates + all_models))

    def _meets_requirements(self, capability: ModelCapability, requirements: Dict[str, Any]) -> bool:
        """Check if model meets requirements"""
        if requirements.get("min_context_window", 0) > capability.context_window:
            return False
        
        if requirements.get("max_cost_per_1k", float('inf')) < capability.cost_per_1k_tokens:
            return False
        
        if requirements.get("min_accuracy", 0) > capability.accuracy_score:
            return False
        
        if requirements.get("max_latency", float('inf')) < capability.latency_percentile_95:
            return False
        
        required_tasks = requirements.get("required_capabilities", [])
        if required_tasks and not any(task in capability.specialized_tasks for task in required_tasks):
            return False
        
        return True

    async def _calculate_model_score(self, model_id: str, requirements: Dict[str, Any]) -> float:
        """Calculate optimization score for a model"""
        try:
            capability = self.model_capabilities[model_id]
            
            # Get current performance metrics
            performance = await self._get_current_performance(model_id)
            
            # Calculate individual scores (0-1 scale)
            latency_score = max(0, 1 - (capability.latency_percentile_95 / 10.0))  # Penalize >10s latency
            cost_score = max(0, 1 - (capability.cost_per_1k_tokens / 0.1))  # Penalize >$0.1/1k tokens
            accuracy_score = capability.accuracy_score
            reliability_score = capability.reliability_score * performance.success_rate
            availability_score = capability.availability_score
            
            # Apply weights
            weights = self.optimization_weights
            total_score = (
                latency_score * weights["latency"] +
                cost_score * weights["cost"] +
                accuracy_score * weights["accuracy"] +
                reliability_score * weights["reliability"] +
                availability_score * weights["availability"]
            )
            
            # Apply requirement bonuses
            if requirements.get("prefer_fast", False) and capability.latency_percentile_95 < 1.0:
                total_score += 0.1
            
            if requirements.get("prefer_accurate", False) and capability.accuracy_score > 0.9:
                total_score += 0.1
            
            if requirements.get("prefer_cheap", False) and capability.cost_per_1k_tokens < 0.01:
                total_score += 0.1
            
            return min(1.0, total_score)
            
        except Exception as e:
            logger.debug(f"Score calculation failed for {model_id}", error=str(e))
            return 0.0

    async def _get_current_performance(self, model_id: str) -> ModelPerformance:
        """Get current performance metrics for a model"""
        if model_id in self.model_performance:
            return self.model_performance[model_id]
        
        # Return default performance if no data available
        return ModelPerformance(
            model_id=model_id,
            requests_per_minute=0,
            average_latency=2.0,
            error_rate=0.05,
            cost_efficiency=0.8,
            user_satisfaction=0.8,
            success_rate=0.95,
            throughput_score=0.8,
            queue_depth=0,
            last_measurement=datetime.now()
        )

    async def _check_rate_limit_availability(self, model_id: str) -> bool:
        """Check if model is available within rate limits"""
        try:
            rate_limit_key = f"rate_limit:{model_id}"
            current_usage = await self.redis_client.get(rate_limit_key)
            
            if not current_usage:
                return True
            
            usage_data = json.loads(current_usage)
            current_minute = int(time.time() // 60)
            
            # Check if we're in a new minute
            if usage_data.get("minute", 0) != current_minute:
                return True
            
            # Check against rate limits
            capability = self.model_capabilities.get(model_id)
            if not capability:
                return True
            
            requests_this_minute = usage_data.get("requests", 0)
            tokens_this_minute = usage_data.get("tokens", 0)
            
            rpm_limit = capability.rate_limits.get("rpm", 60)
            tpm_limit = capability.rate_limits.get("tpm", 60000)
            
            return (requests_this_minute < rpm_limit and 
                   tokens_this_minute < tpm_limit)
            
        except Exception as e:
            logger.debug(f"Rate limit check failed for {model_id}", error=str(e))
            return True  # Default to available if check fails

    async def update_rate_limit_usage(self, model_id: str, tokens_used: int):
        """Update rate limit usage tracking"""
        try:
            rate_limit_key = f"rate_limit:{model_id}"
            current_minute = int(time.time() // 60)
            
            current_usage = await self.redis_client.get(rate_limit_key)
            
            if current_usage:
                usage_data = json.loads(current_usage)
                if usage_data.get("minute", 0) == current_minute:
                    # Same minute, increment
                    usage_data["requests"] += 1
                    usage_data["tokens"] += tokens_used
                else:
                    # New minute, reset
                    usage_data = {
                        "minute": current_minute,
                        "requests": 1,
                        "tokens": tokens_used
                    }
            else:
                # First request
                usage_data = {
                    "minute": current_minute,
                    "requests": 1,
                    "tokens": tokens_used
                }
            
            await self.redis_client.setex(
                rate_limit_key,
                120,  # 2 minutes TTL
                json.dumps(usage_data)
            )
            
        except Exception as e:
            logger.debug(f"Rate limit update failed for {model_id}", error=str(e))

    async def get_model_analytics(self) -> Dict[str, Any]:
        """Get comprehensive model analytics and insights"""
        try:
            analytics = {
                "total_models_discovered": len(self.model_capabilities),
                "providers": {},
                "performance_leaders": {},
                "cost_efficiency": {},
                "rate_limit_status": {},
                "recommendations": []
            }
            
            # Provider breakdown
            for provider in ModelProvider:
                provider_models = [m for m in self.model_capabilities.values() 
                                 if m.provider == provider]
                analytics["providers"][provider.value] = {
                    "model_count": len(provider_models),
                    "avg_cost": sum(m.cost_per_1k_tokens for m in provider_models) / len(provider_models) if provider_models else 0,
                    "avg_latency": sum(m.latency_percentile_95 for m in provider_models) / len(provider_models) if provider_models else 0
                }
            
            # Performance leaders
            if self.model_capabilities:
                fastest_model = min(self.model_capabilities.values(), key=lambda m: m.latency_percentile_95)
                cheapest_model = min(self.model_capabilities.values(), key=lambda m: m.cost_per_1k_tokens)
                most_accurate = max(self.model_capabilities.values(), key=lambda m: m.accuracy_score)
                
                analytics["performance_leaders"] = {
                    "fastest": {
                        "model": fastest_model.model_id,
                        "latency": fastest_model.latency_percentile_95
                    },
                    "cheapest": {
                        "model": cheapest_model.model_id,
                        "cost": cheapest_model.cost_per_1k_tokens
                    },
                    "most_accurate": {
                        "model": most_accurate.model_id,
                        "accuracy": most_accurate.accuracy_score
                    }
                }
            
            # Rate limit status
            for model_id in self.model_capabilities:
                is_available = await self._check_rate_limit_availability(model_id)
                analytics["rate_limit_status"][model_id] = "available" if is_available else "limited"
            
            return analytics
            
        except Exception as e:
            logger.error("Model analytics generation failed", error=str(e))
            return {"error": "analytics_failed"}

    async def optimize_model_selection(self):
        """Background task to continuously optimize model selection"""
        while True:
            try:
                # Rediscover models periodically
                if datetime.now().hour % 6 == 0:  # Every 6 hours
                    await self.discover_available_models()
                
                # Update performance metrics
                await self._update_performance_metrics()
                
                # Optimize task mappings based on performance
                await self._optimize_task_mappings()
                
                await asyncio.sleep(300)  # 5 minute intervals
                
            except Exception as e:
                logger.error("Model optimization failed", error=str(e))
                await asyncio.sleep(60)

    async def _update_performance_metrics(self):
        """Update real-time performance metrics for all models"""
        for model_id in self.model_capabilities:
            try:
                # Get recent performance data from cache
                perf_key = f"model_performance:{model_id}"
                perf_data = await self.redis_client.get(perf_key)
                
                if perf_data:
                    data = json.loads(perf_data)
                    self.model_performance[model_id] = ModelPerformance(**data)
                
            except Exception as e:
                logger.debug(f"Performance update failed for {model_id}", error=str(e))

    async def _optimize_task_mappings(self):
        """Optimize task-to-model mappings based on performance data"""
        try:
            # Analyze which models perform best for each task type
            for task_type in self.task_model_mapping:
                task_models = self.task_model_mapping[task_type]
                
                # Score current models for this task
                model_scores = []
                for model_id in task_models:
                    if model_id in self.model_capabilities:
                        score = await self._calculate_model_score(model_id, {"task_type": task_type})
                        model_scores.append((model_id, score))
                
                # Re-rank based on current performance
                model_scores.sort(key=lambda x: x[1], reverse=True)
                
                # Update mapping with top performers
                self.task_model_mapping[task_type] = [m[0] for m in model_scores[:3]]
                
            logger.debug("Task mappings optimized based on performance")
            
        except Exception as e:
            logger.debug("Task mapping optimization failed", error=str(e))