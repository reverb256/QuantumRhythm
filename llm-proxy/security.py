"""
Security Manager with VibeCoding Principles
Lightweight security utilities for LLM proxy
"""

import secrets
import hashlib
import time
from typing import Dict, Any, Optional
from datetime import datetime
import structlog

logger = structlog.get_logger()

class SecurityManager:
    """Security manager implementing VibeCoding reliability standards"""
    
    def __init__(self, vibecoding_core=None):
        self.vibecoding_core = vibecoding_core
        self.request_counter = 0

    def generate_request_id(self) -> str:
        """Generate secure request ID with Pizza Kitchen reliability"""
        timestamp = int(time.time() * 1000)  # Millisecond precision
        random_part = secrets.token_hex(8)
        self.request_counter += 1
        
        id_string = f"{timestamp}_{self.request_counter}_{random_part}"
        return hashlib.sha256(id_string.encode()).hexdigest()[:16]

    def validate_request_structure(self, request_data: Dict[str, Any]) -> bool:
        """Validate basic request structure with VibeCoding standards"""
        try:
            # Required fields check
            if not isinstance(request_data, dict):
                return False
            
            # Basic validation for common fields
            if "prompt" in request_data:
                if not isinstance(request_data["prompt"], str):
                    return False
                if len(request_data["prompt"]) > 100000:  # 100KB limit
                    return False
            
            return True
            
        except Exception as e:
            logger.debug("Request validation failed", error=str(e))
            return False

    async def check_rate_limits(self, client_ip: str) -> bool:
        """Basic rate limit check"""
        # This would integrate with Redis in full implementation
        # For now, return True (allow all requests)
        return True

    def sanitize_log_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize data for logging - remove sensitive information"""
        sanitized = data.copy()
        
        # Remove or mask sensitive fields
        sensitive_fields = ['password', 'token', 'api_key', 'secret', 'private_key']
        
        for field in sensitive_fields:
            if field in sanitized:
                sanitized[field] = '[REDACTED]'
        
        return sanitized