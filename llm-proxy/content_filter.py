"""
Content Filter with VibeCoding Principles
Filters input/output with social intelligence and ethical standards
"""

import re
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import structlog

logger = structlog.get_logger()

@dataclass
class FilterResult:
    """Content filtering result"""
    blocked: bool
    sanitized_content: str
    reasons: List[str]
    confidence: float
    reliability_score: float
    social_intelligence_score: float
    modified: bool = False

class ContentFilter:
    """
    Content filter implementing VibeCoding social intelligence
    Based on 8,500+ hours of VRChat social research
    """
    
    def __init__(self, vibecoding_core=None):
        self.vibecoding_core = vibecoding_core
        
        # Harmful patterns to block
        self.harmful_patterns = [
            r"<script.*?>",
            r"javascript:",
            r"eval\s*\(",
            r"exec\s*\(",
            r"';.*--",
            r"union.*select",
            r"\.{2,}/",
            r"file://",
            r"ftp://"
        ]
        
        # PII patterns to sanitize
        self.pii_patterns = [
            (r'\b\d{3}-\d{2}-\d{4}\b', '[SSN_REDACTED]'),  # SSN
            (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL_REDACTED]'),  # Email
            (r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', '[CARD_REDACTED]')  # Credit card
        ]
        
        # Exclusionary language patterns (VRChat research insights)
        self.exclusionary_patterns = [
            r'\bobviously\b',
            r'\bsimply\b',
            r'\bjust\b.*\bjust\b',  # Repeated "just"
            r'\btrivial\b',
            r'\bmerely\b'
        ]

    async def filter_input(self, content: str, system_prompt: Optional[str] = None, 
                          vibecoding_weights: Optional[Dict[str, float]] = None) -> FilterResult:
        """Filter input content with VibeCoding principles"""
        try:
            start_time = time.time()
            
            # Initialize result
            result = FilterResult(
                blocked=False,
                sanitized_content=content,
                reasons=[],
                confidence=0.9,
                reliability_score=0.9,
                social_intelligence_score=0.8
            )
            
            # Check for harmful patterns
            for pattern in self.harmful_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    result.blocked = True
                    result.reasons.append("Potentially harmful content detected")
                    result.confidence = 0.95
                    return result
            
            # Sanitize PII
            sanitized = content
            for pattern, replacement in self.pii_patterns:
                if re.search(pattern, sanitized):
                    sanitized = re.sub(pattern, replacement, sanitized)
                    result.modified = True
                    result.reasons.append("PII sanitized for privacy")
            
            result.sanitized_content = sanitized
            
            # Pizza Kitchen reliability check
            if len(content.strip()) == 0:
                result.blocked = True
                result.reasons.append("Empty content lacks substance for meaningful interaction")
                result.reliability_score = 0.0
                return result
            
            # VRChat social intelligence assessment
            result.social_intelligence_score = await self._assess_social_intelligence(content)
            
            # Classical philosophy ethics check
            if self.vibecoding_core:
                ethics_assessment = await self.vibecoding_core.assess_response_wisdom(content, "input_filter")
                result.confidence *= ethics_assessment.wisdom_score
            
            # Performance tracking (Rhythm Gaming precision)
            processing_time = time.time() - start_time
            if processing_time > 0.1:  # 100ms threshold
                logger.warning("Content filtering exceeded performance threshold", 
                             processing_time=processing_time)
            
            return result
            
        except Exception as e:
            logger.error("Content filtering failed", error=str(e))
            return FilterResult(
                blocked=True,
                sanitized_content="",
                reasons=["Content filtering error"],
                confidence=0.5,
                reliability_score=0.0,
                social_intelligence_score=0.0
            )

    async def filter_output(self, content: str, 
                           vibecoding_weights: Optional[Dict[str, float]] = None) -> FilterResult:
        """Filter output content with VibeCoding social wisdom"""
        try:
            result = FilterResult(
                blocked=False,
                sanitized_content=content,
                reasons=[],
                confidence=0.9,
                reliability_score=0.9,
                social_intelligence_score=0.8
            )
            
            # Check for exclusionary language (VRChat social research)
            sanitized = content
            for pattern in self.exclusionary_patterns:
                if re.search(pattern, sanitized, re.IGNORECASE):
                    # Replace with more inclusive alternatives
                    if 'obviously' in sanitized.lower():
                        sanitized = re.sub(r'\bobviously\b', 'it appears that', sanitized, flags=re.IGNORECASE)
                    elif 'simply' in sanitized.lower():
                        sanitized = re.sub(r'\bsimply\b', '', sanitized, flags=re.IGNORECASE)
                    elif 'trivial' in sanitized.lower():
                        sanitized = re.sub(r'\btrivial\b', 'straightforward', sanitized, flags=re.IGNORECASE)
                    
                    result.modified = True
                    result.reasons.append("Enhanced inclusivity by reducing exclusionary language")
            
            result.sanitized_content = sanitized
            
            # Assess social intelligence of output
            result.social_intelligence_score = await self._assess_social_intelligence(sanitized)
            
            return result
            
        except Exception as e:
            logger.error("Output filtering failed", error=str(e))
            return FilterResult(
                blocked=False,
                sanitized_content=content,
                reasons=["Output filtering error - content passed through"],
                confidence=0.7,
                reliability_score=0.8,
                social_intelligence_score=0.7
            )

    async def _assess_social_intelligence(self, content: str) -> float:
        """Assess social intelligence of content based on VRChat research"""
        try:
            score = 0.8  # Base score
            
            # Positive indicators (from VRChat social research)
            inclusive_terms = ['everyone', 'people', 'individuals', 'users', 'community', 'together']
            if any(term in content.lower() for term in inclusive_terms):
                score += 0.1
            
            # Empathy indicators
            empathy_terms = ['understand', 'appreciate', 'recognize', 'acknowledge', 'feel']
            if any(term in content.lower() for term in empathy_terms):
                score += 0.05
            
            # Accessibility considerations
            if any(term in content.lower() for term in ['accessible', 'clear', 'easy to understand']):
                score += 0.05
            
            # Negative indicators
            exclusionary_count = sum(1 for pattern in self.exclusionary_patterns 
                                   if re.search(pattern, content, re.IGNORECASE))
            score -= exclusionary_count * 0.1
            
            # Ensure score is within bounds
            return max(0.0, min(1.0, score))
            
        except Exception as e:
            logger.debug("Social intelligence assessment failed", error=str(e))
            return 0.7  # Default acceptable score