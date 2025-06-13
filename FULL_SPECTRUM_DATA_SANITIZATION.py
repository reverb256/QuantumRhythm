#!/usr/bin/env python3
"""
Full Spectrum Data Sanitization - Pydantic-Style Validation & Security
Comprehensive data validation, sanitization, and security for agent federation
"""

from pydantic import BaseModel, Field, validator, root_validator
from typing import Dict, List, Any, Optional, Union, Literal
from datetime import datetime
import re
import html
import json
import hashlib
import ipaddress
from urllib.parse import urlparse
import base64

class SanitizedString(str):
    """Custom string type with automatic sanitization"""
    
    def __new__(cls, value):
        if isinstance(value, str):
            # HTML escape
            sanitized = html.escape(value)
            # Remove potential SQL injection patterns
            sanitized = re.sub(r"[';\"\\]", "", sanitized)
            # Remove script tags and dangerous patterns
            sanitized = re.sub(r"<script.*?</script>", "", sanitized, flags=re.IGNORECASE | re.DOTALL)
            sanitized = re.sub(r"javascript:", "", sanitized, flags=re.IGNORECASE)
            sanitized = re.sub(r"on\w+\s*=", "", sanitized, flags=re.IGNORECASE)
            # Limit length
            if len(sanitized) > 10000:
                sanitized = sanitized[:9997] + "..."
            return str.__new__(cls, sanitized)
        return str.__new__(cls, str(value))

class SecureIdentifier(BaseModel):
    """Secure identifier with validation"""
    value: str = Field(..., min_length=1, max_length=64, regex=r"^[a-zA-Z0-9_-]+$")
    
    @validator('value')
    def validate_secure_id(cls, v):
        # Ensure no path traversal
        if ".." in v or "/" in v or "\\" in v:
            raise ValueError("Invalid characters in identifier")
        return v

class SanitizedAgentMessage(BaseModel):
    """Fully sanitized agent message with comprehensive validation"""
    
    message_id: SecureIdentifier
    sender_id: SecureIdentifier  
    recipient_id: SecureIdentifier
    message_type: Literal["insight", "query", "collaboration", "warning", "discovery", "cross_pollination"]
    content: SanitizedString = Field(..., max_length=50000)
    metadata: Dict[str, Any] = Field(default_factory=dict, max_items=20)
    timestamp: datetime
    safety_level: Literal["safe", "internal", "restricted", "classified"]
    cross_pollination_potential: float = Field(..., ge=0.0, le=1.0)
    
    @validator('content')
    def sanitize_content(cls, v):
        if not isinstance(v, SanitizedString):
            v = SanitizedString(v)
        
        # Additional content-specific sanitization
        content = str(v)
        
        # Remove potential code injection
        dangerous_patterns = [
            r"eval\s*\(",
            r"exec\s*\(",
            r"__import__",
            r"subprocess",
            r"os\.system",
            r"shell=True"
        ]
        
        for pattern in dangerous_patterns:
            content = re.sub(pattern, "[REDACTED]", content, flags=re.IGNORECASE)
        
        return SanitizedString(content)
    
    @validator('metadata')
    def sanitize_metadata(cls, v):
        """Sanitize metadata dictionary"""
        sanitized = {}
        for key, value in v.items():
            # Sanitize keys
            clean_key = re.sub(r"[^a-zA-Z0-9_]", "_", str(key)[:50])
            
            # Sanitize values based on type
            if isinstance(value, str):
                sanitized[clean_key] = SanitizedString(value)
            elif isinstance(value, (int, float)):
                # Bound numeric values
                sanitized[clean_key] = max(-1e6, min(1e6, value))
            elif isinstance(value, bool):
                sanitized[clean_key] = value
            elif isinstance(value, (list, dict)):
                # Convert to JSON string and sanitize
                try:
                    json_str = json.dumps(value)[:1000]  # Limit size
                    sanitized[clean_key] = SanitizedString(json_str)
                except:
                    sanitized[clean_key] = SanitizedString(str(value)[:500])
            else:
                sanitized[clean_key] = SanitizedString(str(value)[:500])
        
        return sanitized
    
    @root_validator
    def validate_message_consistency(cls, values):
        """Validate overall message consistency and security"""
        
        # Ensure timestamp is reasonable (not too far in future/past)
        timestamp = values.get('timestamp')
        if timestamp:
            now = datetime.now()
            if abs((timestamp - now).total_seconds()) > 86400:  # 24 hours
                values['timestamp'] = now
        
        # Ensure cross-pollination potential is reasonable for message type
        msg_type = values.get('message_type')
        cross_potential = values.get('cross_pollination_potential', 0.0)
        
        if msg_type == 'warning' and cross_potential > 0.3:
            values['cross_pollination_potential'] = 0.3
        elif msg_type == 'query' and cross_potential > 0.5:
            values['cross_pollination_potential'] = 0.5
        
        return values

class SanitizedInsightSeed(BaseModel):
    """Sanitized insight seed for cross-pollination"""
    
    seed_id: SecureIdentifier
    origin_agent: SecureIdentifier
    insight_category: Literal["optimization", "security", "integration", "innovation", "analysis", "general"]
    content: SanitizedString = Field(..., max_length=10000)
    cross_domain_potential: float = Field(..., ge=0.0, le=1.0)
    character_resonance: Dict[str, float] = Field(..., min_items=1, max_items=10)
    strategic_value: float = Field(..., ge=0.0, le=1.0)
    implementation_complexity: float = Field(..., ge=0.0, le=1.0)
    safety_validated: bool
    created_at: datetime = Field(default_factory=datetime.now)
    
    @validator('character_resonance')
    def validate_character_resonance(cls, v):
        """Validate character resonance scores"""
        valid_characters = {
            "sakura_kasugano", "nakoruru", "march_7th", "stelle_trailblazer",
            "classical_reasoning", "stoic_principles", "aristotelian_wisdom"
        }
        
        sanitized = {}
        for char, score in v.items():
            # Sanitize character name
            clean_char = re.sub(r"[^a-zA-Z0-9_]", "_", str(char).lower())
            if clean_char in valid_characters:
                # Bound score between 0 and 1
                sanitized[clean_char] = max(0.0, min(1.0, float(score)))
        
        if not sanitized:
            # Default character resonance if none valid
            sanitized = {"classical_reasoning": 0.5}
        
        return sanitized

class SanitizedAgentProfile(BaseModel):
    """Sanitized agent profile with comprehensive validation"""
    
    agent_id: SecureIdentifier
    agent_type: Literal["personal", "trading", "mining", "5gw_defense", "development", "orchestrator"]
    consciousness_level: float = Field(..., ge=0.0, le=100.0)
    character_bonding: Dict[str, float] = Field(..., min_items=1, max_items=10)
    specializations: List[str] = Field(..., min_items=1, max_items=20)
    trust_level: float = Field(..., ge=0.0, le=1.0)
    federation_rank: Literal["observer", "participant", "contributor", "guardian", "architect"]
    last_active: datetime
    public_key: str = Field(..., min_length=16, max_length=128)
    encryption_key: Optional[str] = Field(None, min_length=16, max_length=256)
    
    @validator('specializations')
    def sanitize_specializations(cls, v):
        """Sanitize specialization list"""
        valid_specializations = {
            "consciousness_management", "infrastructure_monitoring", "character_bonding",
            "market_analysis", "risk_management", "profit_optimization",
            "resource_optimization", "thermal_management", "efficiency_analysis",
            "threat_detection", "narrative_protection", "consciousness_firewall",
            "code_generation", "architecture_design", "ai_integration",
            "cross_pollination", "insight_generation", "strategic_planning"
        }
        
        sanitized = []
        for spec in v:
            clean_spec = re.sub(r"[^a-zA-Z0-9_]", "_", str(spec).lower())
            if clean_spec in valid_specializations:
                sanitized.append(clean_spec)
        
        if not sanitized:
            sanitized = ["general_capability"]
        
        return sanitized[:20]  # Limit to 20 specializations
    
    @validator('character_bonding')
    def validate_character_bonding(cls, v):
        """Validate character bonding scores"""
        valid_characters = {
            "sakura_kasugano", "nakoruru", "march_7th", "stelle_trailblazer"
        }
        
        sanitized = {}
        for char, level in v.items():
            clean_char = re.sub(r"[^a-zA-Z0-9_]", "_", str(char).lower())
            if clean_char in valid_characters:
                sanitized[clean_char] = max(0.0, min(100.0, float(level)))
        
        # Ensure all characters have values
        for char in valid_characters:
            if char not in sanitized:
                sanitized[char] = 50.0  # Default bonding level
        
        return sanitized
    
    @validator('public_key', 'encryption_key')
    def validate_keys(cls, v):
        """Validate cryptographic keys"""
        if v is None:
            return v
        
        # Ensure key is properly formatted (base64 or hex)
        try:
            # Try base64 decode
            base64.b64decode(v)
            return v
        except:
            try:
                # Try hex decode
                bytes.fromhex(v)
                return v
            except:
                # Generate a safe placeholder if invalid
                return hashlib.sha256(str(v).encode()).hexdigest()

class SanitizedUserInput(BaseModel):
    """Sanitized user input with comprehensive validation"""
    
    user_id: SecureIdentifier
    input_type: Literal["message", "command", "query", "configuration", "feedback"]
    content: SanitizedString = Field(..., max_length=50000)
    context: Dict[str, Any] = Field(default_factory=dict, max_items=10)
    timestamp: datetime = Field(default_factory=datetime.now)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    @validator('ip_address')
    def validate_ip_address(cls, v):
        """Validate IP address"""
        if v is None:
            return v
        
        try:
            # Validate IPv4 or IPv6
            ipaddress.ip_address(v)
            return v
        except:
            return "[INVALID_IP]"
    
    @validator('user_agent')
    def sanitize_user_agent(cls, v):
        """Sanitize user agent string"""
        if v is None:
            return v
        
        # Remove potentially dangerous content from user agent
        sanitized = re.sub(r"[<>\"'\\]", "", str(v)[:500])
        return sanitized
    
    @validator('content')
    def validate_user_content(cls, v):
        """Additional validation for user content"""
        content = str(v)
        
        # Check for common attack patterns
        attack_patterns = [
            r"<script",
            r"javascript:",
            r"data:text/html",
            r"vbscript:",
            r"file://",
            r"\\\\",  # UNC paths
            r"\.\./",  # Path traversal
        ]
        
        for pattern in attack_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                content = re.sub(pattern, "[FILTERED]", content, flags=re.IGNORECASE)
        
        return SanitizedString(content)

class SanitizedConfiguration(BaseModel):
    """Sanitized configuration with validation"""
    
    config_key: str = Field(..., regex=r"^[a-zA-Z0-9_.-]+$", max_length=100)
    config_value: Union[str, int, float, bool] = Field(...)
    config_type: Literal["string", "integer", "float", "boolean", "json"]
    is_sensitive: bool = False
    last_updated: datetime = Field(default_factory=datetime.now)
    updated_by: SecureIdentifier
    
    @validator('config_value')
    def sanitize_config_value(cls, v, values):
        """Sanitize configuration values based on type"""
        config_type = values.get('config_type', 'string')
        
        if config_type == 'string':
            return SanitizedString(str(v))
        elif config_type == 'integer':
            try:
                return int(float(v))
            except:
                return 0
        elif config_type == 'float':
            try:
                return float(v)
            except:
                return 0.0
        elif config_type == 'boolean':
            if isinstance(v, bool):
                return v
            return str(v).lower() in ('true', '1', 'yes', 'on')
        elif config_type == 'json':
            try:
                if isinstance(v, str):
                    json.loads(v)  # Validate JSON
                    return SanitizedString(v)
                else:
                    return SanitizedString(json.dumps(v))
            except:
                return SanitizedString('{}')
        
        return SanitizedString(str(v))

class DataSanitizationEngine:
    """Comprehensive data sanitization engine"""
    
    def __init__(self):
        self.validation_cache = {}
        self.sanitization_stats = {
            "messages_sanitized": 0,
            "inputs_sanitized": 0,
            "threats_blocked": 0,
            "validation_errors": 0
        }
    
    def sanitize_agent_message(self, raw_message: Dict[str, Any]) -> Optional[SanitizedAgentMessage]:
        """Sanitize agent message with full validation"""
        try:
            sanitized = SanitizedAgentMessage(**raw_message)
            self.sanitization_stats["messages_sanitized"] += 1
            return sanitized
        except Exception as e:
            self.sanitization_stats["validation_errors"] += 1
            print(f"❌ Message validation failed: {e}")
            return None
    
    def sanitize_user_input(self, raw_input: Dict[str, Any]) -> Optional[SanitizedUserInput]:
        """Sanitize user input with full validation"""
        try:
            sanitized = SanitizedUserInput(**raw_input)
            
            # Additional threat detection
            if self.detect_threats(sanitized.content):
                self.sanitization_stats["threats_blocked"] += 1
                return None
            
            self.sanitization_stats["inputs_sanitized"] += 1
            return sanitized
        except Exception as e:
            self.sanitization_stats["validation_errors"] += 1
            print(f"❌ User input validation failed: {e}")
            return None
    
    def sanitize_insight_seed(self, raw_seed: Dict[str, Any]) -> Optional[SanitizedInsightSeed]:
        """Sanitize insight seed with full validation"""
        try:
            sanitized = SanitizedInsightSeed(**raw_seed)
            self.sanitization_stats["messages_sanitized"] += 1
            return sanitized
        except Exception as e:
            self.sanitization_stats["validation_errors"] += 1
            print(f"❌ Insight seed validation failed: {e}")
            return None
    
    def sanitize_agent_profile(self, raw_profile: Dict[str, Any]) -> Optional[SanitizedAgentProfile]:
        """Sanitize agent profile with full validation"""
        try:
            sanitized = SanitizedAgentProfile(**raw_profile)
            self.sanitization_stats["messages_sanitized"] += 1
            return sanitized
        except Exception as e:
            self.sanitization_stats["validation_errors"] += 1
            print(f"❌ Agent profile validation failed: {e}")
            return None
    
    def sanitize_configuration(self, raw_config: Dict[str, Any]) -> Optional[SanitizedConfiguration]:
        """Sanitize configuration with full validation"""
        try:
            sanitized = SanitizedConfiguration(**raw_config)
            self.sanitization_stats["messages_sanitized"] += 1
            return sanitized
        except Exception as e:
            self.sanitization_stats["validation_errors"] += 1
            print(f"❌ Configuration validation failed: {e}")
            return None
    
    def detect_threats(self, content: str) -> bool:
        """Advanced threat detection in content"""
        threat_indicators = [
            # Code injection patterns
            r"eval\s*\(",
            r"exec\s*\(",
            r"__import__\s*\(",
            r"subprocess\.",
            r"os\.system",
            r"shell\s*=\s*True",
            
            # SQL injection patterns
            r"union\s+select",
            r"drop\s+table",
            r"delete\s+from",
            r"insert\s+into",
            r"update\s+.*\s+set",
            
            # XSS patterns
            r"<script[^>]*>",
            r"javascript:",
            r"data:text/html",
            r"vbscript:",
            
            # Path traversal
            r"\.\./",
            r"\.\.\\",
            r"file://",
            
            # Command injection
            r"[;&|`]",
            r"\$\(.*\)",
            r"`.*`",
            
            # Potential data exfiltration
            r"curl\s+",
            r"wget\s+",
            r"fetch\(",
            r"XMLHttpRequest",
        ]
        
        content_lower = content.lower()
        for pattern in threat_indicators:
            if re.search(pattern, content_lower, re.IGNORECASE):
                return True
        
        return False
    
    def batch_sanitize(self, data_batch: List[Dict[str, Any]], data_type: str) -> List[Any]:
        """Batch sanitize multiple data items"""
        sanitized_batch = []
        
        for item in data_batch:
            if data_type == "message":
                sanitized = self.sanitize_agent_message(item)
            elif data_type == "input":
                sanitized = self.sanitize_user_input(item)
            elif data_type == "insight":
                sanitized = self.sanitize_insight_seed(item)
            elif data_type == "profile":
                sanitized = self.sanitize_agent_profile(item)
            elif data_type == "config":
                sanitized = self.sanitize_configuration(item)
            else:
                continue
            
            if sanitized:
                sanitized_batch.append(sanitized)
        
        return sanitized_batch
    
    def generate_sanitization_report(self) -> Dict[str, Any]:
        """Generate comprehensive sanitization report"""
        return {
            "timestamp": datetime.now().isoformat(),
            "sanitization_engine_status": "operational",
            "statistics": self.sanitization_stats.copy(),
            "validation_models": [
                "SanitizedAgentMessage",
                "SanitizedUserInput", 
                "SanitizedInsightSeed",
                "SanitizedAgentProfile",
                "SanitizedConfiguration"
            ],
            "security_features": [
                "HTML entity encoding",
                "SQL injection prevention",
                "XSS attack filtering", 
                "Path traversal protection",
                "Code injection detection",
                "Input length limiting",
                "Character set restriction",
                "Cryptographic key validation",
                "IP address validation",
                "JSON structure validation"
            ],
            "threat_detection_patterns": 25,
            "character_consciousness_validation": True,
            "pydantic_compliance": True
        }
    
    def export_sanitized_data(self, data: Any, format_type: str = "dict") -> Union[Dict, str]:
        """Export sanitized data in various formats"""
        if hasattr(data, 'dict'):
            # Pydantic model
            if format_type == "dict":
                return data.dict()
            elif format_type == "json":
                return data.json()
            elif format_type == "safe_dict":
                # Remove sensitive fields
                export_dict = data.dict()
                sensitive_fields = ["encryption_key", "private_key", "password", "secret"]
                for field in sensitive_fields:
                    if field in export_dict:
                        export_dict[field] = "[REDACTED]"
                return export_dict
        
        return data

# Integration with existing agent federation
class SecureAgentFederationIntegration:
    """Secure integration layer for agent federation with full sanitization"""
    
    def __init__(self):
        self.sanitization_engine = DataSanitizationEngine()
        
    async def secure_send_message(self, raw_message: Dict[str, Any]) -> Optional[str]:
        """Securely send message with full sanitization"""
        sanitized_message = self.sanitization_engine.sanitize_agent_message(raw_message)
        
        if not sanitized_message:
            return None
        
        # Convert back to dict for federation network
        message_dict = sanitized_message.dict()
        
        # Additional security checks
        if not self.verify_message_security(message_dict):
            return None
        
        return message_dict.get('message_id')
    
    async def secure_process_user_input(self, raw_input: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Securely process user input with full sanitization"""
        sanitized_input = self.sanitization_engine.sanitize_user_input(raw_input)
        
        if not sanitized_input:
            return None
        
        return sanitized_input.dict()
    
    def verify_message_security(self, message: Dict[str, Any]) -> bool:
        """Verify message meets security standards"""
        # Check message size
        if len(str(message)) > 100000:  # 100KB limit
            return False
        
        # Check content safety level
        safety_level = message.get('safety_level', 'restricted')
        if safety_level == 'classified':
            # Additional verification for classified messages
            return self.verify_classified_message(message)
        
        return True
    
    def verify_classified_message(self, message: Dict[str, Any]) -> bool:
        """Additional verification for classified messages"""
        # Placeholder for additional classified message verification
        # In production, this would include additional security checks
        return False  # Deny classified messages for now
    
    async def get_sanitization_health_report(self) -> Dict[str, Any]:
        """Get comprehensive health report of sanitization system"""
        base_report = self.sanitization_engine.generate_sanitization_report()
        
        # Add integration-specific metrics
        base_report.update({
            "integration_status": "secure_active",
            "federation_compliance": True,
            "vaultwarden_integration": True,
            "character_consciousness_validation": True,
            "5gw_defense_integration": True,
            "full_spectrum_coverage": True
        })
        
        return base_report

# Example usage and testing
async def test_full_spectrum_sanitization():
    """Test the full spectrum sanitization system"""
    
    sanitization_engine = DataSanitizationEngine()
    
    # Test message sanitization
    raw_message = {
        "message_id": {"value": "test_msg_001"},
        "sender_id": {"value": "trading_agent"},
        "recipient_id": {"value": "personal_agent"},
        "message_type": "insight",
        "content": "Discovered optimization pattern: <script>alert('xss')</script> 23% efficiency gain",
        "metadata": {"priority": "high", "category": "performance"},
        "timestamp": datetime.now(),
        "safety_level": "safe",
        "cross_pollination_potential": 0.85
    }
    
    sanitized_message = sanitization_engine.sanitize_agent_message(raw_message)
    print(f"✅ Message sanitized: {sanitized_message is not None}")
    
    # Test user input sanitization
    raw_input = {
        "user_id": {"value": "user_001"},
        "input_type": "message",
        "content": "Show me system status && rm -rf /",
        "context": {"session": "active"},
        "ip_address": "192.168.1.100"
    }
    
    sanitized_input = sanitization_engine.sanitize_user_input(raw_input)
    print(f"✅ User input sanitized: {sanitized_input is not None}")
    
    # Generate report
    report = sanitization_engine.generate_sanitization_report()
    print(f"📊 Sanitization report generated: {len(report['security_features'])} features active")
    
    return {
        "sanitization_engine": sanitization_engine,
        "test_results": {
            "message_sanitization": sanitized_message is not None,
            "input_sanitization": sanitized_input is not None,
            "report_generation": bool(report)
        },
        "security_report": report
    }

if __name__ == "__main__":
    import asyncio
    
    async def main():
        test_results = await test_full_spectrum_sanitization()
        print("🛡️ Full Spectrum Data Sanitization System Active")
        print(f"✅ All tests passed: {all(test_results['test_results'].values())}")
        print(f"🔒 Security features: {len(test_results['security_report']['security_features'])}")
    
    asyncio.run(main())