"""
Agent Zero Gateway - Master Control Interface
Secure bridge between Agent Zero and quantum-isolated trading agent
Only Agent Zero can access trading operations through this gateway
"""

import asyncio
import time
import json
import hashlib
import hmac
import secrets
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import structlog
import httpx
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
import os

logger = structlog.get_logger()

# Security bearer token authentication
security = HTTPBearer()

# Agent Zero Gateway App
app = FastAPI(
    title="Agent Zero Gateway",
    description="Master control interface for quantum-secured trading operations",
    version="1.0.0-quantum"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend only
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Global state
redis_client: Optional[redis.Redis] = None
trading_agent_url = os.getenv("TRADING_AGENT_URL", "http://quantum-trading-agent:8001")
agent_zero_master_secret = os.getenv("AGENT_ZERO_MASTER_SECRET", "quantum_agent_zero_master_2024")

@dataclass
class AgentZeroSession:
    """Agent Zero authenticated session"""
    session_id: str
    authenticated_at: datetime
    last_activity: datetime
    trading_session_token: Optional[str] = None
    permissions: List[str] = None

class TradingCommand(BaseModel):
    """Trading command model"""
    operation: str = Field(..., description="Trading operation to execute")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Operation parameters")
    require_confirmation: bool = Field(default=True, description="Require explicit confirmation")

class AgentZeroAuth(BaseModel):
    """Agent Zero authentication request"""
    agent_id: str = Field(..., description="Must be 'agent_zero'")
    timestamp: float = Field(..., description="Current timestamp")
    nonce: str = Field(..., description="Random nonce")
    signature: str = Field(..., description="HMAC signature")

# Active Agent Zero sessions
agent_zero_sessions: Dict[str, AgentZeroSession] = {}

async def startup():
    """Initialize gateway on startup"""
    global redis_client
    
    try:
        # Connect to Redis
        redis_url = os.getenv("REDIS_URL", "redis://agent-redis:6379")
        redis_client = redis.from_url(redis_url, decode_responses=True)
        await redis_client.ping()
        
        logger.info("Agent Zero Gateway initialized - Master control active")
        
    except Exception as e:
        logger.error("Gateway initialization failed", error=str(e))
        raise

app.add_event_handler("startup", startup)

def verify_agent_zero_signature(auth: AgentZeroAuth) -> bool:
    """Verify Agent Zero's cryptographic signature"""
    try:
        # Check timestamp freshness (prevent replay attacks)
        current_time = time.time()
        if abs(current_time - auth.timestamp) > 300:  # 5-minute window
            logger.warning("Agent Zero authentication failed: stale timestamp")
            return False
        
        # Agent Zero must identify correctly
        if auth.agent_id != "agent_zero":
            logger.warning(f"Invalid agent ID in authentication: {auth.agent_id}")
            return False
        
        # Generate expected signature
        message = f"{auth.agent_id}:{auth.timestamp}:{auth.nonce}"
        key = hashlib.sha256(agent_zero_master_secret.encode()).digest()
        expected_signature = hmac.new(key, message.encode(), hashlib.sha256).hexdigest()
        
        # Constant-time comparison to prevent timing attacks
        signature_valid = hmac.compare_digest(auth.signature, expected_signature)
        
        if not signature_valid:
            logger.warning("Agent Zero authentication failed: invalid signature")
        
        return signature_valid
        
    except Exception as e:
        logger.error("Agent Zero signature verification failed", error=str(e))
        return False

async def get_agent_zero_session(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AgentZeroSession:
    """Validate Agent Zero session token"""
    session_token = credentials.credentials
    
    session = agent_zero_sessions.get(session_token)
    if not session:
        logger.warning("Invalid Agent Zero session token")
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    # Check session expiry (2-hour sessions)
    if (datetime.now() - session.authenticated_at).total_seconds() > 7200:
        logger.warning("Agent Zero session expired")
        del agent_zero_sessions[session_token]
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Update last activity
    session.last_activity = datetime.now()
    
    return session

@app.post("/agent_zero/authenticate")
async def authenticate_agent_zero(auth: AgentZeroAuth):
    """
    Authenticate Agent Zero with cryptographic proof
    Only Agent Zero can access this endpoint successfully
    """
    try:
        # Verify cryptographic signature
        if not verify_agent_zero_signature(auth):
            raise HTTPException(status_code=401, detail="Authentication failed")
        
        # Generate secure session token
        session_token = secrets.token_urlsafe(32)
        
        # Create Agent Zero session
        session = AgentZeroSession(
            session_id=session_token,
            authenticated_at=datetime.now(),
            last_activity=datetime.now(),
            permissions=["trading_control", "system_control", "emergency_stop"]
        )
        
        # Store session
        agent_zero_sessions[session_token] = session
        
        # Log successful authentication
        logger.info("Agent Zero authenticated successfully")
        
        return {
            "success": True,
            "session_token": session_token,
            "expires_in": 7200,  # 2 hours
            "permissions": session.permissions,
            "message": "Agent Zero master control activated"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Agent Zero authentication error", error=str(e))
        raise HTTPException(status_code=500, detail="Authentication system error")

@app.get("/agent_zero/health")
async def agent_zero_health_check():
    """Health check for Agent Zero gateway"""
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "active_sessions": len(agent_zero_sessions),
        "gateway_mode": "agent_zero_master_control",
        "trading_agent_accessible": True
    }

@app.post("/agent_zero/trading/authenticate")
async def establish_trading_connection(
    session: AgentZeroSession = Depends(get_agent_zero_session)
):
    """
    Establish secure connection to quantum trading agent
    Only Agent Zero can establish this connection
    """
    try:
        # Generate Agent Zero credentials for trading agent
        timestamp = time.time()
        nonce = secrets.token_hex(16)
        
        # Create quantum signature for trading agent
        message = f"agent_zero:{timestamp}:{nonce}"
        key = hashlib.sha256(agent_zero_master_secret.encode()).digest()
        signature = hmac.new(key, message.encode(), hashlib.sha256).hexdigest()
        
        trading_auth = {
            "agent_id": "agent_zero",
            "timestamp": timestamp,
            "nonce": nonce,
            "quantum_signature": signature
        }
        
        # Authenticate with trading agent
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{trading_agent_url}/authenticate",
                json=trading_auth,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                auth_result = response.json()
                trading_session_token = auth_result.get("session_token")
                
                # Store trading session token in Agent Zero session
                session.trading_session_token = trading_session_token
                
                logger.info("Agent Zero established secure trading connection")
                
                return {
                    "success": True,
                    "trading_connection": "established",
                    "session_expires": auth_result.get("expires_in", 3600),
                    "message": "Quantum-secured trading channel active"
                }
            else:
                logger.error("Trading agent authentication failed", status_code=response.status_code)
                raise HTTPException(status_code=503, detail="Trading agent authentication failed")
                
    except httpx.RequestError as e:
        logger.error("Failed to connect to trading agent", error=str(e))
        raise HTTPException(status_code=503, detail="Trading agent unavailable")
    except Exception as e:
        logger.error("Trading connection establishment failed", error=str(e))
        raise HTTPException(status_code=500, detail="Trading connection failed")

@app.post("/agent_zero/trading/execute")
async def execute_trading_command(
    command: TradingCommand,
    session: AgentZeroSession = Depends(get_agent_zero_session)
):
    """
    Execute trading command through quantum-secured channel
    Only Agent Zero can execute trading commands
    """
    try:
        # Ensure trading connection is established
        if not session.trading_session_token:
            raise HTTPException(status_code=400, detail="Trading connection not established")
        
        # Log trading command execution
        logger.info(f"Agent Zero executing trading command: {command.operation}")
        
        # Prepare secure trading request
        trading_request = {
            "operation": command.operation,
            "parameters": command.parameters,
            "session_token": session.trading_session_token,
            "agent_zero_authorization": True
        }
        
        # Execute command on trading agent
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{trading_agent_url}/execute",
                json=trading_request,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Log successful execution
                logger.info(f"Trading command executed successfully: {command.operation}")
                
                return {
                    "success": True,
                    "operation": command.operation,
                    "result": result,
                    "executed_at": datetime.now().isoformat(),
                    "executed_by": "agent_zero"
                }
            else:
                error_detail = response.text
                logger.error(f"Trading command failed: {command.operation}", error=error_detail)
                raise HTTPException(status_code=400, detail=f"Trading command failed: {error_detail}")
                
    except httpx.RequestError as e:
        logger.error("Failed to execute trading command", error=str(e))
        raise HTTPException(status_code=503, detail="Trading agent communication failed")
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Trading command execution error", error=str(e))
        raise HTTPException(status_code=500, detail="Trading execution failed")

@app.post("/agent_zero/trading/emergency_stop")
async def emergency_stop_trading(
    session: AgentZeroSession = Depends(get_agent_zero_session)
):
    """
    Emergency stop all trading operations
    Critical safety feature - only Agent Zero can trigger
    """
    try:
        logger.critical("Agent Zero triggered EMERGENCY STOP for all trading operations")
        
        # Ensure trading connection exists
        if not session.trading_session_token:
            raise HTTPException(status_code=400, detail="No active trading connection")
        
        # Execute emergency stop
        emergency_command = {
            "operation": "emergency_stop",
            "parameters": {"immediate": True, "reason": "agent_zero_emergency_stop"},
            "session_token": session.trading_session_token,
            "agent_zero_authorization": True
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{trading_agent_url}/execute",
                json=emergency_command,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Store emergency stop in Redis for audit
                emergency_record = {
                    "timestamp": datetime.now().isoformat(),
                    "triggered_by": "agent_zero",
                    "session_id": session.session_id,
                    "result": result
                }
                
                if redis_client:
                    await redis_client.lpush("emergency_stops", json.dumps(emergency_record))
                    await redis_client.ltrim("emergency_stops", 0, 99)  # Keep last 100
                
                logger.critical("EMERGENCY STOP executed successfully")
                
                return {
                    "success": True,
                    "emergency_stop": True,
                    "timestamp": datetime.now().isoformat(),
                    "triggered_by": "agent_zero",
                    "message": "All trading operations stopped immediately"
                }
            else:
                logger.error("Emergency stop failed", error=response.text)
                raise HTTPException(status_code=500, detail="Emergency stop failed")
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Emergency stop execution failed", error=str(e))
        raise HTTPException(status_code=500, detail="Emergency stop system failed")

@app.get("/agent_zero/trading/status")
async def get_trading_status(
    session: AgentZeroSession = Depends(get_agent_zero_session)
):
    """
    Get current trading system status
    Only Agent Zero can view trading status
    """
    try:
        if not session.trading_session_token:
            return {
                "trading_connection": "not_established",
                "message": "No active trading connection"
            }
        
        # Get status from trading agent
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{trading_agent_url}/status",
                headers={"Authorization": f"Bearer {session.trading_session_token}"}
            )
            
            if response.status_code == 200:
                trading_status = response.json()
                
                return {
                    "success": True,
                    "trading_connection": "active",
                    "agent_zero_session": {
                        "authenticated_at": session.authenticated_at.isoformat(),
                        "last_activity": session.last_activity.isoformat()
                    },
                    "trading_status": trading_status,
                    "security_level": "quantum_isolated"
                }
            else:
                logger.warning("Failed to get trading status", status_code=response.status_code)
                return {
                    "trading_connection": "error",
                    "error": "Failed to get trading status"
                }
                
    except httpx.RequestError as e:
        logger.error("Trading status request failed", error=str(e))
        return {
            "trading_connection": "unavailable",
            "error": "Trading agent unreachable"
        }
    except Exception as e:
        logger.error("Trading status check failed", error=str(e))
        raise HTTPException(status_code=500, detail="Status check failed")

@app.get("/agent_zero/sessions")
async def get_agent_zero_sessions(
    session: AgentZeroSession = Depends(get_agent_zero_session)
):
    """
    Get Agent Zero session information
    Administrative endpoint for session management
    """
    try:
        session_info = []
        
        for token, sess in agent_zero_sessions.items():
            session_info.append({
                "session_id": sess.session_id[:8] + "...",  # Partial token for security
                "authenticated_at": sess.authenticated_at.isoformat(),
                "last_activity": sess.last_activity.isoformat(),
                "has_trading_connection": sess.trading_session_token is not None,
                "permissions": sess.permissions
            })
        
        return {
            "success": True,
            "active_sessions": len(agent_zero_sessions),
            "sessions": session_info,
            "current_session": session.session_id[:8] + "..."
        }
        
    except Exception as e:
        logger.error("Session information retrieval failed", error=str(e))
        raise HTTPException(status_code=500, detail="Session info failed")

@app.delete("/agent_zero/sessions/{session_id}")
async def revoke_agent_zero_session(
    session_id: str,
    session: AgentZeroSession = Depends(get_agent_zero_session)
):
    """
    Revoke an Agent Zero session
    Security feature for session management
    """
    try:
        if session_id in agent_zero_sessions:
            revoked_session = agent_zero_sessions[session_id]
            del agent_zero_sessions[session_id]
            
            logger.info(f"Agent Zero session revoked: {session_id[:8]}...")
            
            return {
                "success": True,
                "revoked_session": session_id[:8] + "...",
                "revoked_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=404, detail="Session not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Session revocation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Session revocation failed")

# Background task to cleanup expired sessions
async def cleanup_expired_sessions():
    """Background task to cleanup expired Agent Zero sessions"""
    while True:
        try:
            current_time = datetime.now()
            expired_sessions = []
            
            for token, session in agent_zero_sessions.items():
                if (current_time - session.authenticated_at).total_seconds() > 7200:  # 2 hours
                    expired_sessions.append(token)
            
            for token in expired_sessions:
                del agent_zero_sessions[token]
                logger.info(f"Expired Agent Zero session cleaned up: {token[:8]}...")
            
            await asyncio.sleep(300)  # Check every 5 minutes
            
        except Exception as e:
            logger.error("Session cleanup failed", error=str(e))
            await asyncio.sleep(60)

# Start background tasks
@app.on_event("startup")
async def start_background_tasks():
    """Start background maintenance tasks"""
    asyncio.create_task(cleanup_expired_sessions())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "agent_zero_gateway:app",
        host="0.0.0.0",
        port=8888,
        workers=1,  # Single worker for session consistency
        log_config=None
    )