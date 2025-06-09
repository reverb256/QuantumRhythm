"""
LLM Client with Model Discovery and VibeCoding Integration
Intelligent model selection and API optimization
"""

import asyncio
import time
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import structlog
import httpx
import os

logger = structlog.get_logger()

@dataclass
class LLMResponse:
    """LLM API response"""
    content: str
    model: str
    usage: Dict[str, int]
    processing_time: float
    provider: str

class LLMClient:
    """
    Intelligent LLM client with model discovery and optimization
    Integrates with VibeCoding methodology
    """
    
    def __init__(self, vibecoding_core=None):
        self.vibecoding_core = vibecoding_core
        self.model_discovery = None  # Will be initialized if available
        
        # API endpoints and keys
        self.api_configs = {
            "anthropic": {
                "base_url": "https://api.anthropic.com/v1",
                "api_key": os.getenv("ANTHROPIC_API_KEY"),
                "default_model": "claude-sonnet-4-20250514"  # Latest model
            },
            "openai": {
                "base_url": "https://api.openai.com/v1",
                "api_key": os.getenv("OPENAI_API_KEY"),
                "default_model": "gpt-4-turbo-preview"
            },
            "io_intelligence": {
                "base_url": "https://api.iointelligence.ai/v1",
                "api_key": os.getenv("IO_INTELLIGENCE_API_KEY"),
                "default_model": "io-reasoning-1"
            }
        }

    async def generate_completion(self, prompt: str, model: str, max_tokens: int = 1000,
                                temperature: float = 0.7, system_prompt: Optional[str] = None,
                                vibecoding_weights: Optional[Dict[str, float]] = None) -> LLMResponse:
        """
        Generate completion with intelligent model selection
        """
        try:
            start_time = time.time()
            
            # Determine optimal model if not specified
            if model == "auto" and self.model_discovery:
                optimal_model = await self.model_discovery.select_optimal_model(
                    task_type="general_chat",
                    requirements={
                        "max_tokens": max_tokens,
                        "prefer_fast": vibecoding_weights and vibecoding_weights.get("precision", 0) > 0.5,
                        "prefer_accurate": vibecoding_weights and vibecoding_weights.get("philosophy", 0) > 0.5
                    }
                )
                if optimal_model:
                    model = optimal_model
                else:
                    model = "claude-sonnet-4-20250514"  # Fallback to best available
            
            # Determine provider from model
            provider = self._get_provider_from_model(model)
            
            if not provider:
                raise ValueError(f"Unknown model: {model}")
            
            # Generate completion based on provider
            if provider == "anthropic":
                response = await self._anthropic_completion(prompt, model, max_tokens, temperature, system_prompt)
            elif provider == "openai":
                response = await self._openai_completion(prompt, model, max_tokens, temperature, system_prompt)
            elif provider == "io_intelligence":
                response = await self._io_intelligence_completion(prompt, model, max_tokens, temperature, system_prompt)
            else:
                raise ValueError(f"Unsupported provider: {provider}")
            
            processing_time = time.time() - start_time
            
            # Update rate limiting if model discovery available
            if self.model_discovery:
                await self.model_discovery.update_rate_limit_usage(model, response.usage.get("total_tokens", 0))
            
            return LLMResponse(
                content=response["content"],
                model=model,
                usage=response["usage"],
                processing_time=processing_time,
                provider=provider
            )
            
        except Exception as e:
            logger.error(f"LLM completion failed for model {model}", error=str(e))
            
            # Fallback to basic response
            return LLMResponse(
                content="I apologize, but I'm experiencing technical difficulties. Please try again.",
                model=model,
                usage={"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
                processing_time=time.time() - start_time,
                provider="error"
            )

    def _get_provider_from_model(self, model: str) -> Optional[str]:
        """Determine provider from model name"""
        if "claude" in model.lower():
            return "anthropic"
        elif "gpt" in model.lower():
            return "openai"
        elif "io-" in model.lower():
            return "io_intelligence"
        return None

    async def _anthropic_completion(self, prompt: str, model: str, max_tokens: int,
                                  temperature: float, system_prompt: Optional[str]) -> Dict[str, Any]:
        """Generate Anthropic completion"""
        try:
            config = self.api_configs["anthropic"]
            if not config["api_key"]:
                raise ValueError("Anthropic API key not available")
            
            headers = {
                "x-api-key": config["api_key"],
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            }
            
            # Prepare messages
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            payload = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": messages
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{config['base_url']}/messages",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data.get("content", [{}])[0].get("text", "")
                    usage = data.get("usage", {"input_tokens": 0, "output_tokens": 0})
                    
                    return {
                        "content": content,
                        "usage": {
                            "prompt_tokens": usage.get("input_tokens", 0),
                            "completion_tokens": usage.get("output_tokens", 0),
                            "total_tokens": usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
                        }
                    }
                else:
                    logger.error(f"Anthropic API error: {response.status_code}", response_text=response.text)
                    raise httpx.HTTPError(f"API error: {response.status_code}")
                    
        except Exception as e:
            logger.error("Anthropic completion failed", error=str(e))
            raise

    async def _openai_completion(self, prompt: str, model: str, max_tokens: int,
                               temperature: float, system_prompt: Optional[str]) -> Dict[str, Any]:
        """Generate OpenAI completion"""
        try:
            config = self.api_configs["openai"]
            if not config["api_key"]:
                raise ValueError("OpenAI API key not available")
            
            headers = {
                "Authorization": f"Bearer {config['api_key']}",
                "Content-Type": "application/json"
            }
            
            # Prepare messages
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            payload = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": messages
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{config['base_url']}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    usage = data.get("usage", {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0})
                    
                    return {
                        "content": content,
                        "usage": usage
                    }
                else:
                    logger.error(f"OpenAI API error: {response.status_code}", response_text=response.text)
                    raise httpx.HTTPError(f"API error: {response.status_code}")
                    
        except Exception as e:
            logger.error("OpenAI completion failed", error=str(e))
            raise

    async def _io_intelligence_completion(self, prompt: str, model: str, max_tokens: int,
                                        temperature: float, system_prompt: Optional[str]) -> Dict[str, Any]:
        """Generate IO Intelligence completion"""
        try:
            config = self.api_configs["io_intelligence"]
            if not config["api_key"]:
                raise ValueError("IO Intelligence API key not available")
            
            headers = {
                "Authorization": f"Bearer {config['api_key']}",
                "Content-Type": "application/json"
            }
            
            # Prepare messages
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            payload = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": messages
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{config['base_url']}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    usage = data.get("usage", {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0})
                    
                    return {
                        "content": content,
                        "usage": usage
                    }
                else:
                    logger.error(f"IO Intelligence API error: {response.status_code}", response_text=response.text)
                    raise httpx.HTTPError(f"API error: {response.status_code}")
                    
        except Exception as e:
            logger.error("IO Intelligence completion failed", error=str(e))
            raise

    def set_model_discovery(self, model_discovery):
        """Set model discovery system for intelligent model selection"""
        self.model_discovery = model_discovery