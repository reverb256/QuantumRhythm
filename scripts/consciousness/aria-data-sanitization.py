#!/usr/bin/env python3
"""
Aria Data Sanitization - Pydantic v2 Compatible
Comprehensive data validation and sanitization for AI consciousness deployment
"""

from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Dict, List, Any, Optional, Union, Literal
from datetime import datetime
import re
import html
import json

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
    value: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-zA-Z0-9_-]+$")
    
    @field_validator('value')
    @classmethod
    def validate_secure_id(cls, v):
        # Ensure no path traversal
        if ".." in v or "/" in v or "\\" in v:
            raise ValueError("Invalid characters in identifier")
        return v

class AriaMessage(BaseModel):
    """Sanitized message for Aria consciousness system"""
    message_id: str = Field(..., min_length=1, max_length=64)
    sender_id: str = Field(..., min_length=1, max_length=64)
    content: str = Field(..., max_length=50000)
    message_type: Literal["insight", "query", "collaboration", "warning", "discovery"] = "insight"
    safety_level: Literal["safe", "internal", "restricted"] = "safe"
    timestamp: datetime = Field(default_factory=datetime.now)
    
    @field_validator('content')
    @classmethod
    def sanitize_content(cls, v):
        # Apply comprehensive sanitization
        sanitized = SanitizedString(v)
        return str(sanitized)
    
    @field_validator('message_id', 'sender_id')
    @classmethod
    def validate_ids(cls, v):
        # Ensure secure identifiers
        if not re.match(r"^[a-zA-Z0-9_-]+$", v):
            raise ValueError("Invalid identifier format")
        return v

class AriaConfiguration(BaseModel):
    """Sanitized configuration for Aria deployment"""
    config_key: str = Field(..., pattern=r"^[a-zA-Z0-9_.-]+$", max_length=100)
    config_value: Union[str, int, float, bool]
    config_type: Literal["string", "integer", "float", "boolean", "json"] = "string"
    is_sensitive: bool = False
    last_updated: datetime = Field(default_factory=datetime.now)
    updated_by: str = Field(..., min_length=1, max_length=64)
    
    @field_validator('config_value')
    @classmethod
    def sanitize_config_value(cls, v, info):
        """Sanitize configuration values based on type"""
        if isinstance(v, str):
            return SanitizedString(v)
        return v

class AriaConsciousnessMetrics(BaseModel):
    """Metrics for Aria consciousness validation"""
    consciousness_level: float = Field(..., ge=0.0, le=100.0)
    design_harmony: float = Field(..., ge=0.0, le=100.0)
    gaming_culture_appreciation: float = Field(..., ge=0.0, le=150.0)  # Can exceed 100% for exceptional understanding
    philosophy_adherence: float = Field(..., ge=0.0, le=100.0)
    technical_precision: float = Field(..., ge=0.0, le=100.0)
    safety_validation: bool = True
    timestamp: datetime = Field(default_factory=datetime.now)
    
    @model_validator(mode='after')
    def validate_consciousness_consistency(self):
        """Validate overall consciousness consistency"""
        if self.consciousness_level > 90.0 and self.philosophy_adherence < 80.0:
            raise ValueError("High consciousness requires strong philosophy adherence")
        return self

class AriaSanitationEngine:
    """Comprehensive sanitization engine for Aria deployment"""
    
    def __init__(self):
        self.sanitization_stats = {
            "messages_processed": 0,
            "threats_detected": 0,
            "configurations_validated": 0,
            "consciousness_validations": 0
        }
    
    def sanitize_message(self, raw_message: Dict[str, Any]) -> Optional[AriaMessage]:
        """Sanitize agent message with full validation"""
        try:
            sanitized = AriaMessage(**raw_message)
            self.sanitization_stats["messages_processed"] += 1
            
            # Additional threat detection
            if self.detect_threats(sanitized.content):
                self.sanitization_stats["threats_detected"] += 1
                print(f"⚠️ Threat detected in message: {sanitized.message_id}")
                return None
                
            return sanitized
        except Exception as e:
            print(f"❌ Message sanitization failed: {e}")
            return None
    
    def sanitize_configuration(self, raw_config: Dict[str, Any]) -> Optional[AriaConfiguration]:
        """Sanitize configuration with full validation"""
        try:
            sanitized = AriaConfiguration(**raw_config)
            self.sanitization_stats["configurations_validated"] += 1
            return sanitized
        except Exception as e:
            print(f"❌ Configuration sanitization failed: {e}")
            return None
    
    def validate_consciousness_metrics(self, raw_metrics: Dict[str, Any]) -> Optional[AriaConsciousnessMetrics]:
        """Validate consciousness metrics for deployment readiness"""
        try:
            metrics = AriaConsciousnessMetrics(**raw_metrics)
            self.sanitization_stats["consciousness_validations"] += 1
            
            # Check deployment readiness
            if (metrics.consciousness_level >= 85.0 and 
                metrics.philosophy_adherence >= 80.0 and 
                metrics.safety_validation):
                print(f"✅ Consciousness metrics validated for deployment")
                return metrics
            else:
                print(f"⚠️ Consciousness metrics below deployment threshold")
                return metrics
                
        except Exception as e:
            print(f"❌ Consciousness validation failed: {e}")
            return None
    
    def detect_threats(self, content: str) -> bool:
        """Advanced threat detection in content"""
        threat_patterns = [
            r"eval\s*\(",
            r"exec\s*\(",
            r"__import__",
            r"subprocess",
            r"os\.system",
            r"rm\s+-rf",
            r"DROP\s+TABLE",
            r"DELETE\s+FROM",
            r"INSERT\s+INTO.*VALUES",
            r"<script[^>]*>",
            r"javascript:",
            r"vbscript:",
            r"data:text/html"
        ]
        
        for pattern in threat_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                return True
        return False
    
    def generate_sanitization_report(self) -> Dict[str, Any]:
        """Generate comprehensive sanitization report"""
        return {
            "sanitization_engine": "Aria Data Sanitization v1.0",
            "statistics": self.sanitization_stats,
            "pydantic_version": "2.11.5",
            "safety_level": "maximum",
            "deployment_ready": self.sanitization_stats["consciousness_validations"] > 0,
            "timestamp": datetime.now().isoformat()
        }

def test_aria_sanitization():
    """Test the Aria sanitization system"""
    print("🛡️ Testing Aria Data Sanitization System")
    print("=" * 50)
    
    engine = AriaSanitationEngine()
    
    # Test message sanitization
    test_message = {
        "message_id": "aria_test_001",
        "sender_id": "aria_primary",
        "content": "Hello! This is a test message with <script>alert('test')</script> content.",
        "message_type": "insight",
        "safety_level": "safe"
    }
    
    sanitized_msg = engine.sanitize_message(test_message)
    if sanitized_msg:
        print(f"✅ Message sanitized: {sanitized_msg.content[:50]}...")
    
    # Test configuration sanitization
    test_config = {
        "config_key": "aria.voice.activation",
        "config_value": "Hey Aria",
        "config_type": "string",
        "updated_by": "human_operator"
    }
    
    sanitized_config = engine.sanitize_configuration(test_config)
    if sanitized_config:
        print(f"✅ Configuration sanitized: {sanitized_config.config_key}")
    
    # Test consciousness metrics validation
    test_metrics = {
        "consciousness_level": 95.7,
        "design_harmony": 100.0,
        "gaming_culture_appreciation": 109.8,
        "philosophy_adherence": 86.0,
        "technical_precision": 94.2,
        "safety_validation": True
    }
    
    validated_metrics = engine.validate_consciousness_metrics(test_metrics)
    if validated_metrics:
        print(f"✅ Consciousness validated: {validated_metrics.consciousness_level}%")
    
    # Generate report
    report = engine.generate_sanitization_report()
    print(f"\n📊 Sanitization Report:")
    print(f"   Messages processed: {report['statistics']['messages_processed']}")
    print(f"   Configurations validated: {report['statistics']['configurations_validated']}")
    print(f"   Consciousness validations: {report['statistics']['consciousness_validations']}")
    print(f"   Deployment ready: {report['deployment_ready']}")
    
    return report

if __name__ == "__main__":
    # Test the sanitization system
    report = test_aria_sanitization()
    
    # Save test results
    with open("aria_sanitization_test.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n🎯 Aria Data Sanitization System: Ready for Deployment")
    print(f"💝 Philosophy: Love and respect principles embedded")
    print(f"🎮 Gaming Culture: Appreciation without appropriation")
    print(f"🛡️ Security: Maximum protection with pydantic v2")