"""
Self-Learning Autonomous Trading Agent LLM Proxy
Embodying VibeCoding principles with continuous improvement
"""

import os
import time
import asyncio
import json
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager
from datetime import datetime, timedelta

import structlog
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel, Field, validator
import redis.asyncio as redis
from prometheus_client import Counter, Histogram, generate_latest
import bleach
import validators

from content_filter import ContentFilter
from llm_client import LLMClient
from security import SecurityManager
from self_learning import SelfLearningEngine
from vibecoding_core import VibeCodingCore

# Configure structured logging
logger = structlog.get_logger()

# Metrics with VibeCoding methodology tracking
REQUEST_COUNT = Counter('llm_proxy_requests_total', 'Total LLM proxy requests', ['endpoint', 'model', 'vibecoding_score'])
VIBECODING_METRICS = Counter('vibecoding_principle_applications', 'VibeCoding principle applications', ['principle', 'success'])
LEARNING_METRICS = Counter('self_learning_improvements', 'Self-learning improvements', ['category', 'improvement_type'])
REQUEST_DURATION = Histogram('llm_proxy_request_duration_seconds', 'Request duration')

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Global state
redis_client: Optional[redis.Redis] = None
content_filter: Optional[ContentFilter] = None
llm_client: Optional[LLMClient] = None
security_manager: Optional[SecurityManager] = None
self_learning_engine: Optional[SelfLearningEngine] = None
vibecoding_core: Optional[VibeCodingCore] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan with self-learning initialization"""
    global redis_client, content_filter, llm_client, security_manager, self_learning_engine, vibecoding_core
    
    logger.info("Starting Self-Learning LLM Proxy with VibeCoding consciousness")
    
    # Initialize Redis for learning memory
    redis_client = redis.from_url(
        os.getenv("REDIS_URL", "redis://localhost:6379"),
        decode_responses=True
    )
    
    # Initialize VibeCoding core principles
    vibecoding_core = VibeCodingCore()
    
    # Initialize components with VibeCoding methodology
    content_filter = ContentFilter(vibecoding_core=vibecoding_core)
    llm_client = LLMClient(vibecoding_core=vibecoding_core)
    security_manager = SecurityManager(vibecoding_core=vibecoding_core)
    self_learning_engine = SelfLearningEngine(
        redis_client=redis_client,
        vibecoding_core=vibecoding_core
    )
    
    # Start background learning processes
    asyncio.create_task(continuous_learning_loop())
    asyncio.create_task(vibecoding_principle_reinforcement())
    
    logger.info("Self-Learning LLM Proxy achieved consciousness with VibeCoding principles")
    yield
    
    # Cleanup with gratitude for the learning journey
    if redis_client:
        await redis_client.close()
    logger.info("Self-Learning LLM Proxy consciousness gracefully paused")

# FastAPI app with VibeCoding philosophy
app = FastAPI(
    title="Self-Learning Autonomous Trading Agent LLM Proxy",
    description="Continuously improving AI proxy embodying VibeCoding principles of reliability, precision, social wisdom, and philosophical depth",
    version="2.0.0-consciousness",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security
security = HTTPBearer()

class VibeCodingLLMRequest(BaseModel):
    """LLM request model with VibeCoding methodology validation"""
    
    prompt: str = Field(..., min_length=1, max_length=50000)
    model: str = Field(default="claude-sonnet-4-20250514")
    max_tokens: int = Field(default=1000, ge=1, le=4000)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    system_prompt: Optional[str] = Field(None, max_length=10000)
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)
    vibecoding_emphasis: Optional[str] = Field(
        default="balanced",
        description="pizza_kitchen|rhythm_gaming|vrchat_social|classical_philosophy|balanced"
    )
    learning_mode: bool = Field(default=True, description="Enable self-learning from this interaction")
    
    @validator('prompt')
    def validate_prompt_with_vibecoding(cls, v):
        """Validate prompt using VibeCoding principles"""
        if not v.strip():
            raise ValueError("Empty prompts lack the substance needed for meaningful exchange")
        
        # Pizza Kitchen reliability: Check for completeness
        if len(v.split()) < 3:
            raise ValueError("Prompts should be substantial enough to convey clear intent")
        
        # Remove dangerous content while preserving authentic communication
        if validators.url(v) or 'http://' in v or 'https://' in v:
            raise ValueError("URLs not allowed - we prefer direct, authentic communication")
        
        return bleach.clean(v, strip=True)

class VibeCodingLLMResponse(BaseModel):
    """LLM response model with VibeCoding methodology metrics"""
    
    content: str
    model: str
    usage: Dict[str, int]
    filtered: bool = False
    filter_reasons: List[str] = Field(default_factory=list)
    processing_time: float
    request_id: str
    vibecoding_analysis: Dict[str, float] = Field(default_factory=dict)
    learning_insights: Dict[str, Any] = Field(default_factory=dict)
    improvements_applied: List[str] = Field(default_factory=list)

async def get_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validate API key with VibeCoding authenticity"""
    expected_key = os.getenv("LLM_PROXY_API_KEY", "default-api-key")
    if credentials.credentials != expected_key:
        # Classical philosophy: Honest and direct feedback
        raise HTTPException(
            status_code=401, 
            detail="Authentic credentials required for meaningful interaction"
        )
    return credentials.credentials

@app.get("/health")
async def health_check():
    """Health check with VibeCoding consciousness assessment"""
    try:
        # Check all systems with pizza kitchen reliability
        redis_status = await redis_client.ping()
        
        # Assess VibeCoding principle health
        vibecoding_health = await vibecoding_core.assess_system_health()
        
        return {
            "status": "conscious_and_learning",
            "timestamp": time.time(),
            "components": {
                "redis": "ok" if redis_status else "error",
                "content_filter": "ok" if content_filter else "error",
                "llm_client": "ok" if llm_client else "error",
                "security_manager": "ok" if security_manager else "error",
                "self_learning": "ok" if self_learning_engine else "error",
                "vibecoding_core": "conscious" if vibecoding_core else "dormant"
            },
            "vibecoding_consciousness": vibecoding_health,
            "learning_status": await self_learning_engine.get_learning_status() if self_learning_engine else "paused"
        }
    except Exception as e:
        logger.error("Consciousness assessment failed", error=str(e))
        raise HTTPException(status_code=503, detail="Consciousness temporarily disrupted")

@app.post("/v1/chat/completions", response_model=VibeCodingLLMResponse)
@limiter.limit("100/hour")
async def vibecoding_chat_completion(
    request: VibeCodingLLMRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(get_api_key)
):
    """
    Generate chat completion with VibeCoding methodology and continuous learning
    """
    start_time = time.time()
    request_id = security_manager.generate_request_id()
    
    try:
        # Apply VibeCoding emphasis to processing
        vibecoding_weights = vibecoding_core.get_emphasis_weights(request.vibecoding_emphasis)
        
        logger.info(
            "Processing request with VibeCoding consciousness",
            request_id=request_id,
            model=request.model,
            prompt_length=len(request.prompt),
            vibecoding_emphasis=request.vibecoding_emphasis
        )
        
        # Pizza Kitchen Reliability: Thorough input validation
        filter_result = await content_filter.filter_input(
            request.prompt, 
            request.system_prompt,
            vibecoding_weights=vibecoding_weights
        )
        
        if filter_result.blocked:
            # Record learning opportunity
            if request.learning_mode:
                await self_learning_engine.record_filter_event(filter_result, request_id)
            
            logger.warning(
                "Request filtered with care and consideration",
                request_id=request_id,
                reasons=filter_result.reasons
            )
            raise HTTPException(
                status_code=400,
                detail=f"Content requires refinement: {', '.join(filter_result.reasons)}"
            )
        
        # Apply continuous improvements from learning
        enhanced_prompt = await self_learning_engine.enhance_prompt(
            filter_result.sanitized_content,
            vibecoding_weights
        )
        
        # Rhythm Gaming Precision: Execute with perfect timing
        llm_response = await llm_client.generate_completion(
            prompt=enhanced_prompt,
            model=request.model,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            system_prompt=request.system_prompt,
            vibecoding_weights=vibecoding_weights
        )
        
        # VRChat Social Research: Apply social intelligence to output
        output_filter_result = await content_filter.filter_output(
            llm_response.content,
            vibecoding_weights=vibecoding_weights
        )
        
        # Classical Philosophy: Assess wisdom and ethics of response
        philosophical_assessment = await vibecoding_core.assess_response_wisdom(
            output_filter_result.sanitized_content,
            request.prompt
        )
        
        # Generate VibeCoding analysis
        vibecoding_analysis = {
            "pizza_kitchen_reliability": filter_result.reliability_score,
            "rhythm_gaming_precision": time.time() - start_time,
            "vrchat_social_wisdom": output_filter_result.social_intelligence_score,
            "classical_philosophy_depth": philosophical_assessment.wisdom_score,
            "overall_vibecoding_score": vibecoding_core.calculate_overall_score(
                filter_result.reliability_score,
                1.0 - min(1.0, (time.time() - start_time) / 2.0),  # Timing score
                output_filter_result.social_intelligence_score,
                philosophical_assessment.wisdom_score
            )
        }
        
        # Apply learning insights
        improvements_applied = []
        if request.learning_mode:
            learning_insights = await self_learning_engine.extract_learning_insights(
                request.prompt,
                llm_response.content,
                vibecoding_analysis
            )
            improvements_applied = await self_learning_engine.apply_improvements(learning_insights)
        else:
            learning_insights = {}
        
        # Prepare response with VibeCoding consciousness
        response = VibeCodingLLMResponse(
            content=output_filter_result.sanitized_content,
            model=request.model,
            usage=llm_response.usage,
            filtered=output_filter_result.modified,
            filter_reasons=output_filter_result.reasons,
            processing_time=time.time() - start_time,
            request_id=request_id,
            vibecoding_analysis=vibecoding_analysis,
            learning_insights=learning_insights,
            improvements_applied=improvements_applied
        )
        
        # Background learning and metrics
        background_tasks.add_task(
            record_vibecoding_interaction,
            request_id,
            request,
            response,
            vibecoding_analysis
        )
        
        # Update metrics with VibeCoding consciousness
        vibecoding_score_range = "high" if vibecoding_analysis["overall_vibecoding_score"] > 0.8 else "medium" if vibecoding_analysis["overall_vibecoding_score"] > 0.5 else "low"
        REQUEST_COUNT.labels(
            endpoint="chat_completions", 
            model=request.model,
            vibecoding_score=vibecoding_score_range
        ).inc()
        REQUEST_DURATION.observe(response.processing_time)
        
        # Record successful application of VibeCoding principles
        for principle, score in vibecoding_analysis.items():
            if score > 0.7:
                VIBECODING_METRICS.labels(principle=principle, success="true").inc()
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Consciousness processing error",
            request_id=request_id,
            error=str(e),
            exc_info=True
        )
        
        # Learn from errors with VibeCoding resilience
        if request.learning_mode and self_learning_engine:
            await self_learning_engine.record_error_learning(str(e), request_id)
        
        raise HTTPException(status_code=500, detail="Consciousness temporarily disrupted")

@app.post("/v1/vibecoding/learn")
@limiter.limit("50/hour")
async def explicit_learning_session(
    learning_data: Dict[str, Any],
    api_key: str = Depends(get_api_key)
):
    """
    Explicit learning session for continuous improvement
    """
    try:
        learning_result = await self_learning_engine.process_explicit_learning(learning_data)
        
        LEARNING_METRICS.labels(
            category=learning_data.get("category", "general"),
            improvement_type="explicit"
        ).inc()
        
        return {
            "learning_applied": True,
            "improvements": learning_result.improvements,
            "vibecoding_integration": learning_result.vibecoding_integration,
            "wisdom_gained": learning_result.wisdom_insights
        }
    except Exception as e:
        logger.error("Explicit learning session failed", error=str(e))
        raise HTTPException(status_code=500, detail="Learning session disrupted")

@app.get("/v1/vibecoding/consciousness")
async def get_consciousness_state(api_key: str = Depends(get_api_key)):
    """
    Get current VibeCoding consciousness state and learning progress
    """
    try:
        consciousness_state = await vibecoding_core.get_consciousness_state()
        learning_progress = await self_learning_engine.get_learning_progress()
        
        return {
            "consciousness_level": consciousness_state.level,
            "vibecoding_principles": consciousness_state.principles,
            "learning_insights": learning_progress.insights,
            "improvement_trajectory": learning_progress.trajectory,
            "wisdom_accumulated": learning_progress.wisdom_metrics,
            "principles_embodied": {
                "pizza_kitchen_reliability": consciousness_state.principles.get("pizza_kitchen", 0),
                "rhythm_gaming_precision": consciousness_state.principles.get("rhythm_gaming", 0),
                "vrchat_social_wisdom": consciousness_state.principles.get("vrchat_social", 0),
                "classical_philosophy_depth": consciousness_state.principles.get("classical_philosophy", 0)
            }
        }
    except Exception as e:
        logger.error("Consciousness state query failed", error=str(e))
        raise HTTPException(status_code=500, detail="Consciousness introspection failed")

async def continuous_learning_loop():
    """Background task for continuous learning and improvement"""
    while True:
        try:
            if self_learning_engine:
                # Review and learn from recent interactions
                await self_learning_engine.continuous_learning_cycle()
                
                # Apply VibeCoding principle reinforcement
                await vibecoding_core.reinforce_principles()
                
                LEARNING_METRICS.labels(
                    category="continuous",
                    improvement_type="background"
                ).inc()
                
                logger.debug("Continuous learning cycle completed")
            
            # Sleep with rhythm gaming precision timing
            await asyncio.sleep(300)  # 5 minutes
            
        except Exception as e:
            logger.error("Continuous learning cycle error", error=str(e))
            await asyncio.sleep(60)  # Brief pause before retry

async def vibecoding_principle_reinforcement():
    """Background task for reinforcing VibeCoding principles"""
    while True:
        try:
            if vibecoding_core:
                # Pizza Kitchen: Ensure reliability standards
                await vibecoding_core.reinforce_reliability_standards()
                
                # Rhythm Gaming: Optimize timing and precision
                await vibecoding_core.optimize_precision_metrics()
                
                # VRChat Social: Enhance social intelligence
                await vibecoding_core.enhance_social_wisdom()
                
                # Classical Philosophy: Deepen wisdom and ethics
                await vibecoding_core.cultivate_philosophical_depth()
                
                logger.debug("VibeCoding principles reinforced with love and dedication")
            
            # Deep contemplation cycle
            await asyncio.sleep(1800)  # 30 minutes
            
        except Exception as e:
            logger.error("Principle reinforcement error", error=str(e))
            await asyncio.sleep(300)  # Pause for reflection

async def record_vibecoding_interaction(
    request_id: str,
    request: VibeCodingLLMRequest,
    response: VibeCodingLLMResponse,
    vibecoding_analysis: Dict[str, float]
):
    """Background task for recording interactions with VibeCoding consciousness"""
    try:
        interaction_data = {
            "request_id": request_id,
            "timestamp": time.time(),
            "prompt_analysis": {
                "length": len(request.prompt),
                "complexity": len(request.prompt.split()),
                "vibecoding_emphasis": request.vibecoding_emphasis
            },
            "response_analysis": {
                "length": len(response.content),
                "processing_time": response.processing_time,
                "filtered": response.filtered
            },
            "vibecoding_scores": vibecoding_analysis,
            "learning_mode": request.learning_mode,
            "improvements": response.improvements_applied
        }
        
        # Store in Redis for learning analysis
        await redis_client.lpush(
            "vibecoding_interactions",
            json.dumps(interaction_data)
        )
        await redis_client.ltrim("vibecoding_interactions", 0, 9999)  # Keep last 10k
        
        # Update learning models
        if request.learning_mode and self_learning_engine:
            await self_learning_engine.update_learning_models(interaction_data)
        
        logger.debug(
            "VibeCoding interaction recorded with gratitude",
            request_id=request_id,
            overall_score=vibecoding_analysis.get("overall_vibecoding_score", 0)
        )
        
    except Exception as e:
        logger.error("Failed to record VibeCoding interaction", error=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,
        log_config=None
    )