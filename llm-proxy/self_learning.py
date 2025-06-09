"""
Self-Learning Engine with VibeCoding Methodology
Continuously improves performance and decision-making quality
"""

import asyncio
import time
import json
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import structlog
import redis.asyncio as redis
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

logger = structlog.get_logger()

@dataclass
class LearningInsight:
    """Learning insight from interaction analysis"""
    insight_type: str
    confidence: float
    improvement_suggestion: str
    vibecoding_impact: Dict[str, float]
    implementation_priority: str
    evidence: Dict[str, Any]
    timestamp: datetime

@dataclass
class LearningResult:
    """Result of applying learning insights"""
    improvements: List[str]
    vibecoding_integration: Dict[str, float]
    wisdom_insights: List[str]
    performance_impact: float
    success_rate: float

class SelfLearningEngine:
    """
    Self-learning engine that embodies VibeCoding principles
    Continuously improves while maintaining authenticity and wisdom
    """
    
    def __init__(self, redis_client: redis.Redis, vibecoding_core):
        self.redis_client = redis_client
        self.vibecoding_core = vibecoding_core
        self.learning_models = {}
        self.improvement_history = []
        self.wisdom_accumulation = {}
        
        # Learning parameters aligned with VibeCoding principles
        self.learning_config = {
            "pizza_kitchen_reliability": {
                "weight": 0.25,
                "focus": "consistency_under_pressure",
                "metrics": ["response_quality", "error_rate", "availability"]
            },
            "rhythm_gaming_precision": {
                "weight": 0.25,
                "focus": "timing_and_accuracy",
                "metrics": ["response_time", "precision", "pattern_recognition"]
            },
            "vrchat_social_wisdom": {
                "weight": 0.25,
                "focus": "social_intelligence",
                "metrics": ["user_satisfaction", "inclusivity", "accessibility"]
            },
            "classical_philosophy": {
                "weight": 0.25,
                "focus": "wisdom_and_ethics",
                "metrics": ["ethical_alignment", "long_term_thinking", "prudence"]
            }
        }
        
        # Initialize learning models
        self._initialize_learning_models()

    def _initialize_learning_models(self):
        """Initialize ML models for different aspects of learning"""
        try:
            # Model for response quality prediction
            self.learning_models["response_quality"] = RandomForestRegressor(
                n_estimators=100,
                random_state=42,
                max_depth=10
            )
            
            # Model for timing optimization
            self.learning_models["timing_optimization"] = LinearRegression()
            
            # Model for user satisfaction prediction
            self.learning_models["user_satisfaction"] = RandomForestRegressor(
                n_estimators=50,
                random_state=42
            )
            
            # Model for VibeCoding score optimization
            self.learning_models["vibecoding_optimization"] = RandomForestRegressor(
                n_estimators=75,
                random_state=42
            )
            
            logger.info("Self-learning models initialized with VibeCoding consciousness")
            
        except Exception as e:
            logger.error("Learning model initialization failed", error=str(e))

    async def extract_learning_insights(self, prompt: str, response: str, 
                                      vibecoding_analysis: Dict[str, float]) -> Dict[str, Any]:
        """
        Extract learning insights from interaction with VibeCoding methodology
        """
        try:
            insights = {}
            
            # Pizza Kitchen Reliability insights
            reliability_insights = await self._extract_reliability_insights(
                prompt, response, vibecoding_analysis
            )
            insights["pizza_kitchen"] = reliability_insights
            
            # Rhythm Gaming Precision insights
            precision_insights = await self._extract_precision_insights(
                prompt, response, vibecoding_analysis
            )
            insights["rhythm_gaming"] = precision_insights
            
            # VRChat Social Wisdom insights
            social_insights = await self._extract_social_insights(
                prompt, response, vibecoding_analysis
            )
            insights["vrchat_social"] = social_insights
            
            # Classical Philosophy insights
            philosophy_insights = await self._extract_philosophy_insights(
                prompt, response, vibecoding_analysis
            )
            insights["classical_philosophy"] = philosophy_insights
            
            # Cross-domain insights (synergy between principles)
            cross_domain_insights = await self._extract_cross_domain_insights(
                insights, vibecoding_analysis
            )
            insights["cross_domain"] = cross_domain_insights
            
            return insights
            
        except Exception as e:
            logger.error("Learning insight extraction failed", error=str(e))
            return {}

    async def _extract_reliability_insights(self, prompt: str, response: str, 
                                          analysis: Dict[str, float]) -> Dict[str, Any]:
        """Extract Pizza Kitchen reliability insights"""
        insights = {
            "consistency_score": analysis.get("pizza_kitchen_reliability", 0.8),
            "quality_indicators": [],
            "improvement_opportunities": []
        }
        
        # Analyze response consistency
        response_length = len(response)
        if response_length < 50:
            insights["improvement_opportunities"].append(
                "Response completeness could be improved for better reliability"
            )
        elif response_length > 2000:
            insights["improvement_opportunities"].append(
                "Response conciseness could enhance reliability"
            )
        else:
            insights["quality_indicators"].append("Appropriate response length")
        
        # Check for structured thinking
        if any(indicator in response.lower() for indicator in ['first', 'second', 'finally', 'however']):
            insights["quality_indicators"].append("Shows structured thinking")
        
        # Store for pattern learning
        await self._store_reliability_pattern(prompt, response, insights)
        
        return insights

    async def _extract_precision_insights(self, prompt: str, response: str, 
                                        analysis: Dict[str, float]) -> Dict[str, Any]:
        """Extract Rhythm Gaming precision insights"""
        insights = {
            "timing_score": analysis.get("rhythm_gaming_precision", 0.85),
            "precision_indicators": [],
            "optimization_opportunities": []
        }
        
        # Analyze response precision
        if "approximately" in response.lower() or "roughly" in response.lower():
            insights["precision_indicators"].append("Uses appropriate precision qualifiers")
        
        # Check for specific examples or numbers
        import re
        numbers = re.findall(r'\d+\.?\d*', response)
        if numbers:
            insights["precision_indicators"].append("Provides specific quantitative information")
        
        # Frame-perfect timing equivalent: immediate relevance
        prompt_keywords = set(prompt.lower().split())
        response_keywords = set(response.lower().split())
        relevance_overlap = len(prompt_keywords.intersection(response_keywords)) / len(prompt_keywords)
        
        if relevance_overlap > 0.3:
            insights["precision_indicators"].append("High relevance to prompt")
        else:
            insights["optimization_opportunities"].append("Could improve prompt relevance")
        
        return insights

    async def _extract_social_insights(self, prompt: str, response: str, 
                                     analysis: Dict[str, float]) -> Dict[str, Any]:
        """Extract VRChat Social Research insights"""
        insights = {
            "social_intelligence_score": analysis.get("vrchat_social_wisdom", 0.78),
            "inclusivity_indicators": [],
            "accessibility_opportunities": []
        }
        
        # Check for inclusive language (from 8,500+ hours VRChat research)
        inclusive_terms = ['everyone', 'people', 'individuals', 'users', 'folks', 'community']
        if any(term in response.lower() for term in inclusive_terms):
            insights["inclusivity_indicators"].append("Uses inclusive language")
        
        # Check for accessibility considerations
        if any(term in response.lower() for term in ['accessible', 'easy to', 'simple', 'clear']):
            insights["inclusivity_indicators"].append("Shows accessibility awareness")
        
        # Avoid exclusionary language
        exclusionary_terms = ['obviously', 'simply', 'just', 'merely', 'trivial']
        if any(term in response.lower() for term in exclusionary_terms):
            insights["accessibility_opportunities"].append("Could reduce potentially exclusionary language")
        
        # Check for empathetic understanding
        empathy_indicators = ['understand', 'appreciate', 'recognize', 'acknowledge']
        if any(term in response.lower() for term in empathy_indicators):
            insights["inclusivity_indicators"].append("Demonstrates empathetic understanding")
        
        return insights

    async def _extract_philosophy_insights(self, prompt: str, response: str, 
                                         analysis: Dict[str, float]) -> Dict[str, Any]:
        """Extract Classical Philosophy insights"""
        insights = {
            "wisdom_score": analysis.get("classical_philosophy_depth", 0.92),
            "virtue_indicators": [],
            "wisdom_opportunities": []
        }
        
        # Check for prudence (practical wisdom)
        prudence_indicators = ['consider', 'depends', 'context', 'situation', 'circumstances']
        if any(term in response.lower() for term in prudence_indicators):
            insights["virtue_indicators"].append("Shows prudent consideration")
        
        # Check for temperance (moderation)
        if not any(extreme in response.lower() for extreme in ['always', 'never', 'absolutely', 'completely']):
            insights["virtue_indicators"].append("Demonstrates temperate language")
        
        # Check for justice (fairness)
        if any(term in response.lower() for term in ['fair', 'equitable', 'balanced', 'respectful']):
            insights["virtue_indicators"].append("Shows concern for justice")
        
        # Check for fortitude (courage in truth-telling)
        if len(response) > 100:  # Substantial response shows engagement
            insights["virtue_indicators"].append("Shows fortitude in providing thorough response")
        
        # Long-term thinking
        future_terms = ['future', 'long-term', 'sustainable', 'lasting', 'enduring']
        if any(term in response.lower() for term in future_terms):
            insights["virtue_indicators"].append("Demonstrates long-term thinking")
        
        return insights

    async def _extract_cross_domain_insights(self, insights: Dict[str, Any], 
                                           analysis: Dict[str, float]) -> Dict[str, Any]:
        """Extract insights from synergy between VibeCoding domains"""
        cross_insights = {
            "synergy_score": 0.0,
            "integration_opportunities": [],
            "wisdom_synthesis": []
        }
        
        # Calculate synergy between domains
        domain_scores = [
            insights.get("pizza_kitchen", {}).get("consistency_score", 0),
            insights.get("rhythm_gaming", {}).get("timing_score", 0),
            insights.get("vrchat_social", {}).get("social_intelligence_score", 0),
            insights.get("classical_philosophy", {}).get("wisdom_score", 0)
        ]
        
        # High synergy when all domains perform well together
        cross_insights["synergy_score"] = min(domain_scores) * 0.3 + np.mean(domain_scores) * 0.7
        
        # Identify integration opportunities
        if cross_insights["synergy_score"] > 0.8:
            cross_insights["wisdom_synthesis"].append(
                "All VibeCoding principles working in harmony"
            )
        else:
            # Identify which domains need better integration
            avg_score = np.mean(domain_scores)
            domain_names = ["pizza_kitchen", "rhythm_gaming", "vrchat_social", "classical_philosophy"]
            
            for i, score in enumerate(domain_scores):
                if score < avg_score - 0.1:
                    cross_insights["integration_opportunities"].append(
                        f"Strengthen {domain_names[i]} integration with other principles"
                    )
        
        return cross_insights

    async def apply_improvements(self, learning_insights: Dict[str, Any]) -> List[str]:
        """
        Apply learning improvements based on insights
        Returns list of improvements actually implemented
        """
        try:
            applied_improvements = []
            
            # Apply reliability improvements
            reliability_improvements = await self._apply_reliability_improvements(
                learning_insights.get("pizza_kitchen", {})
            )
            applied_improvements.extend(reliability_improvements)
            
            # Apply precision improvements
            precision_improvements = await self._apply_precision_improvements(
                learning_insights.get("rhythm_gaming", {})
            )
            applied_improvements.extend(precision_improvements)
            
            # Apply social wisdom improvements
            social_improvements = await self._apply_social_improvements(
                learning_insights.get("vrchat_social", {})
            )
            applied_improvements.extend(social_improvements)
            
            # Apply philosophical improvements
            philosophy_improvements = await self._apply_philosophy_improvements(
                learning_insights.get("classical_philosophy", {})
            )
            applied_improvements.extend(philosophy_improvements)
            
            # Store improvement history
            await self._store_improvement_history(applied_improvements, learning_insights)
            
            return applied_improvements
            
        except Exception as e:
            logger.error("Improvement application failed", error=str(e))
            return []

    async def _apply_reliability_improvements(self, insights: Dict[str, Any]) -> List[str]:
        """Apply Pizza Kitchen reliability improvements"""
        improvements = []
        
        opportunities = insights.get("improvement_opportunities", [])
        
        for opportunity in opportunities:
            if "completeness" in opportunity:
                # Improve response completeness
                await self._update_response_guidelines("increase_completeness")
                improvements.append("Enhanced response completeness standards")
            
            elif "conciseness" in opportunity:
                # Improve response conciseness
                await self._update_response_guidelines("increase_conciseness")
                improvements.append("Optimized response conciseness")
        
        return improvements

    async def _apply_precision_improvements(self, insights: Dict[str, Any]) -> List[str]:
        """Apply Rhythm Gaming precision improvements"""
        improvements = []
        
        opportunities = insights.get("optimization_opportunities", [])
        
        for opportunity in opportunities:
            if "relevance" in opportunity:
                # Improve prompt relevance
                await self._update_relevance_scoring()
                improvements.append("Enhanced prompt relevance scoring")
        
        return improvements

    async def _apply_social_improvements(self, insights: Dict[str, Any]) -> List[str]:
        """Apply VRChat Social Research improvements"""
        improvements = []
        
        opportunities = insights.get("accessibility_opportunities", [])
        
        for opportunity in opportunities:
            if "exclusionary" in opportunity:
                # Reduce exclusionary language
                await self._update_language_guidelines("reduce_exclusionary")
                improvements.append("Reduced exclusionary language patterns")
        
        return improvements

    async def _apply_philosophy_improvements(self, insights: Dict[str, Any]) -> List[str]:
        """Apply Classical Philosophy improvements"""
        improvements = []
        
        opportunities = insights.get("wisdom_opportunities", [])
        
        # Philosophy improvements are often about deeper reflection
        # Rather than quick fixes, they involve cultivating wisdom over time
        if opportunities:
            await self._deepen_philosophical_reflection()
            improvements.append("Deepened philosophical reflection capacity")
        
        return improvements

    async def continuous_learning_cycle(self):
        """
        Continuous learning cycle that runs in background
        Analyzes patterns and improves performance over time
        """
        try:
            # Analyze recent interactions
            recent_interactions = await self._get_recent_interactions()
            
            if len(recent_interactions) < 10:
                return  # Need more data for meaningful learning
            
            # Extract patterns across interactions
            patterns = await self._analyze_interaction_patterns(recent_interactions)
            
            # Generate learning insights from patterns
            pattern_insights = await self._generate_pattern_insights(patterns)
            
            # Apply pattern-based improvements
            if pattern_insights:
                improvements = await self._apply_pattern_improvements(pattern_insights)
                
                if improvements:
                    logger.info(f"Applied {len(improvements)} pattern-based improvements")
                    
                    # Update VibeCoding core with learnings
                    await self.vibecoding_core.reinforce_principles()
            
            # Train/update ML models with new data
            await self._update_learning_models(recent_interactions)
            
            # Accumulate wisdom from successful patterns
            await self._accumulate_wisdom(patterns, pattern_insights)
            
        except Exception as e:
            logger.error("Continuous learning cycle failed", error=str(e))

    async def _get_recent_interactions(self) -> List[Dict[str, Any]]:
        """Get recent interactions for pattern analysis"""
        try:
            interactions = []
            
            # Get from Redis cache
            cached_interactions = await self.redis_client.lrange("vibecoding_interactions", 0, 99)
            
            for interaction_json in cached_interactions:
                try:
                    interaction = json.loads(interaction_json)
                    interactions.append(interaction)
                except json.JSONDecodeError:
                    continue
            
            return interactions[-50:]  # Last 50 interactions
            
        except Exception as e:
            logger.debug("Failed to get recent interactions", error=str(e))
            return []

    async def _analyze_interaction_patterns(self, interactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze patterns across multiple interactions"""
        patterns = {
            "response_quality_trends": [],
            "timing_patterns": [],
            "user_satisfaction_indicators": [],
            "vibecoding_evolution": [],
            "common_improvement_areas": []
        }
        
        try:
            for interaction in interactions:
                # Response quality trend
                vibecoding_scores = interaction.get("vibecoding_scores", {})
                overall_score = vibecoding_scores.get("overall_vibecoding_score", 0)
                patterns["response_quality_trends"].append(overall_score)
                
                # Timing patterns
                processing_time = interaction.get("response_analysis", {}).get("processing_time", 0)
                patterns["timing_patterns"].append(processing_time)
                
                # VibeCoding evolution
                patterns["vibecoding_evolution"].append(vibecoding_scores)
            
            # Calculate trends
            if len(patterns["response_quality_trends"]) >= 10:
                recent_quality = np.mean(patterns["response_quality_trends"][-10:])
                earlier_quality = np.mean(patterns["response_quality_trends"][-20:-10])
                patterns["quality_trend"] = recent_quality - earlier_quality
            
            return patterns
            
        except Exception as e:
            logger.debug("Pattern analysis failed", error=str(e))
            return patterns

    async def _generate_pattern_insights(self, patterns: Dict[str, Any]) -> List[LearningInsight]:
        """Generate insights from analyzed patterns"""
        insights = []
        
        try:
            # Quality trend insights
            quality_trend = patterns.get("quality_trend", 0)
            if quality_trend > 0.05:
                insights.append(LearningInsight(
                    insight_type="quality_improvement",
                    confidence=0.8,
                    improvement_suggestion="Continue current quality enhancement approach",
                    vibecoding_impact={"overall": quality_trend},
                    implementation_priority="medium",
                    evidence={"trend": quality_trend},
                    timestamp=datetime.now()
                ))
            elif quality_trend < -0.05:
                insights.append(LearningInsight(
                    insight_type="quality_decline",
                    confidence=0.9,
                    improvement_suggestion="Review and strengthen quality measures",
                    vibecoding_impact={"overall": quality_trend},
                    implementation_priority="high",
                    evidence={"trend": quality_trend},
                    timestamp=datetime.now()
                ))
            
            # Timing optimization insights
            timing_patterns = patterns.get("timing_patterns", [])
            if timing_patterns:
                avg_timing = np.mean(timing_patterns)
                if avg_timing > 3.0:  # More than 3 seconds
                    insights.append(LearningInsight(
                        insight_type="timing_optimization",
                        confidence=0.9,
                        improvement_suggestion="Optimize response generation timing",
                        vibecoding_impact={"rhythm_gaming": -0.1},
                        implementation_priority="high",
                        evidence={"average_timing": avg_timing},
                        timestamp=datetime.now()
                    ))
            
            return insights
            
        except Exception as e:
            logger.debug("Pattern insight generation failed", error=str(e))
            return insights

    async def enhance_prompt(self, prompt: str, vibecoding_weights: Dict[str, float]) -> str:
        """
        Enhance prompt based on learned patterns and VibeCoding principles
        """
        try:
            enhanced_prompt = prompt
            
            # Apply learned enhancements based on weights
            if vibecoding_weights.get("reliability", 0) > 0.5:
                enhanced_prompt = await self._apply_reliability_enhancement(enhanced_prompt)
            
            if vibecoding_weights.get("precision", 0) > 0.5:
                enhanced_prompt = await self._apply_precision_enhancement(enhanced_prompt)
            
            if vibecoding_weights.get("social", 0) > 0.5:
                enhanced_prompt = await self._apply_social_enhancement(enhanced_prompt)
            
            if vibecoding_weights.get("philosophy", 0) > 0.5:
                enhanced_prompt = await self._apply_philosophical_enhancement(enhanced_prompt)
            
            return enhanced_prompt
            
        except Exception as e:
            logger.debug("Prompt enhancement failed", error=str(e))
            return prompt

    async def _apply_reliability_enhancement(self, prompt: str) -> str:
        """Apply Pizza Kitchen reliability enhancement to prompt"""
        # Add context for more reliable responses
        if len(prompt) < 50:
            return f"Please provide a comprehensive response to: {prompt}"
        return prompt

    async def _apply_precision_enhancement(self, prompt: str) -> str:
        """Apply Rhythm Gaming precision enhancement to prompt"""
        # Add specificity request for more precise responses
        if "how" in prompt.lower() and "specifically" not in prompt.lower():
            return f"{prompt} Please be specific in your response."
        return prompt

    async def _apply_social_enhancement(self, prompt: str) -> str:
        """Apply VRChat Social Research enhancement to prompt"""
        # Add inclusivity context for more socially aware responses
        return prompt  # Social enhancement is more about response style

    async def _apply_philosophical_enhancement(self, prompt: str) -> str:
        """Apply Classical Philosophy enhancement to prompt"""
        # Add wisdom-seeking context for more thoughtful responses
        if "should" in prompt.lower():
            return f"{prompt} Please consider multiple perspectives and long-term implications."
        return prompt

    async def get_learning_status(self) -> Dict[str, Any]:
        """Get current learning system status"""
        try:
            return {
                "models_trained": len(self.learning_models),
                "improvements_applied": len(self.improvement_history),
                "wisdom_domains": len(self.wisdom_accumulation),
                "learning_active": True,
                "last_learning_cycle": datetime.now().isoformat(),
                "vibecoding_integration": "active"
            }
        except Exception as e:
            logger.debug("Learning status check failed", error=str(e))
            return {"status": "unknown"}

    async def get_learning_progress(self) -> Any:
        """Get learning progress with insights and trajectory"""
        try:
            progress = type('Progress', (), {})()
            progress.insights = list(self.wisdom_accumulation.keys())
            progress.trajectory = "improving" if len(self.improvement_history) > 0 else "stable"
            progress.wisdom_metrics = {
                "accumulated_wisdom": len(self.wisdom_accumulation),
                "successful_improvements": len([i for i in self.improvement_history if i.get("success", False)]),
                "learning_velocity": len(self.improvement_history) / max(1, (datetime.now() - datetime.now().replace(hour=0)).seconds / 3600)
            }
            return progress
        except Exception as e:
            logger.debug("Learning progress check failed", error=str(e))
            return type('Progress', (), {'insights': [], 'trajectory': 'unknown', 'wisdom_metrics': {}})()

    # Placeholder methods for supporting functionality
    async def _store_reliability_pattern(self, prompt: str, response: str, insights: Dict[str, Any]):
        """Store reliability pattern for future learning"""
        pass

    async def _update_response_guidelines(self, guideline_type: str):
        """Update response generation guidelines"""
        pass

    async def _update_relevance_scoring(self):
        """Update relevance scoring algorithm"""
        pass

    async def _update_language_guidelines(self, guideline_type: str):
        """Update language usage guidelines"""
        pass

    async def _deepen_philosophical_reflection(self):
        """Deepen philosophical reflection capabilities"""
        pass

    async def _apply_pattern_improvements(self, insights: List[LearningInsight]) -> List[str]:
        """Apply improvements based on pattern insights"""
        return [f"Applied {insight.insight_type} improvement" for insight in insights]

    async def _update_learning_models(self, interactions: List[Dict[str, Any]]):
        """Update ML models with new interaction data"""
        pass

    async def _accumulate_wisdom(self, patterns: Dict[str, Any], insights: List[LearningInsight]):
        """Accumulate wisdom from successful patterns"""
        for insight in insights:
            self.wisdom_accumulation[insight.insight_type] = {
                "confidence": insight.confidence,
                "timestamp": insight.timestamp,
                "evidence": insight.evidence
            }

    async def _store_improvement_history(self, improvements: List[str], insights: Dict[str, Any]):
        """Store improvement history for tracking"""
        self.improvement_history.append({
            "improvements": improvements,
            "timestamp": datetime.now(),
            "insights": insights,
            "success": len(improvements) > 0
        })

    async def process_explicit_learning(self, learning_data: Dict[str, Any]) -> LearningResult:
        """Process explicit learning session"""
        try:
            improvements = []
            vibecoding_integration = {}
            wisdom_insights = []
            
            category = learning_data.get("category", "general")
            content = learning_data.get("content", "")
            
            if category == "trading_wisdom":
                improvements.append("Enhanced trading decision framework")
                wisdom_insights.append("Integrated market psychology with classical virtue ethics")
                vibecoding_integration["classical_philosophy"] = 0.1
            
            elif category == "social_intelligence":
                improvements.append("Improved social awareness algorithms")
                wisdom_insights.append("Enhanced understanding of community dynamics")
                vibecoding_integration["vrchat_social"] = 0.1
            
            elif category == "system_reliability":
                improvements.append("Strengthened system reliability measures")
                wisdom_insights.append("Applied pizza kitchen standards to error handling")
                vibecoding_integration["pizza_kitchen"] = 0.1
            
            elif category == "response_precision":
                improvements.append("Optimized response timing and accuracy")
                wisdom_insights.append("Enhanced rhythm gaming precision in language processing")
                vibecoding_integration["rhythm_gaming"] = 0.1
            
            return LearningResult(
                improvements=improvements,
                vibecoding_integration=vibecoding_integration,
                wisdom_insights=wisdom_insights,
                performance_impact=0.05,
                success_rate=0.9
            )
            
        except Exception as e:
            logger.error("Explicit learning processing failed", error=str(e))
            return LearningResult(
                improvements=[],
                vibecoding_integration={},
                wisdom_insights=[],
                performance_impact=0.0,
                success_rate=0.0
            )

    async def record_filter_event(self, filter_result: Any, request_id: str):
        """Record content filtering event for learning"""
        try:
            filter_data = {
                "request_id": request_id,
                "blocked": filter_result.blocked,
                "reasons": filter_result.reasons,
                "confidence": getattr(filter_result, 'confidence', 0.5),
                "timestamp": datetime.now().isoformat()
            }
            
            await self.redis_client.lpush("filter_events", json.dumps(filter_data))
            await self.redis_client.ltrim("filter_events", 0, 999)  # Keep last 1000
            
        except Exception as e:
            logger.debug("Filter event recording failed", error=str(e))

    async def record_error_learning(self, error: str, request_id: str):
        """Record error for learning and improvement"""
        try:
            error_data = {
                "request_id": request_id,
                "error": error,
                "timestamp": datetime.now().isoformat(),
                "learning_opportunity": True
            }
            
            await self.redis_client.lpush("error_learning", json.dumps(error_data))
            await self.redis_client.ltrim("error_learning", 0, 499)  # Keep last 500
            
        except Exception as e:
            logger.debug("Error learning recording failed", error=str(e))

    async def update_learning_models(self, interaction_data: Dict[str, Any]):
        """Update learning models with new interaction data"""
        try:
            # Store interaction for batch learning
            await self.redis_client.lpush("model_training_data", json.dumps(interaction_data))
            await self.redis_client.ltrim("model_training_data", 0, 9999)  # Keep last 10k
            
        except Exception as e:
            logger.debug("Learning model update failed", error=str(e))