#!/usr/bin/env python3
"""
Aria Core Trading System - Clean, focused AI trading without character overlays
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

class TradingStrategy:
    """Core trading strategy implementation"""
    
    def __init__(self, name: str, confidence_threshold: float = 0.7):
        self.name = name
        self.confidence_threshold = confidence_threshold
        self.active = True
        self.performance_history = []
    
    def analyze_market(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze market data and generate trading signals"""
        return {
            "signal": "hold",
            "confidence": 0.5,
            "reasoning": "Insufficient data for decision",
            "risk_level": "medium"
        }

class MomentumStrategy(TradingStrategy):
    """Momentum-based trading strategy"""
    
    def __init__(self):
        super().__init__("momentum", 0.75)
    
    def analyze_market(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        prices = market_data.get("price_history", [])
        
        if len(prices) < 5:
            return {
                "signal": "hold",
                "confidence": 0.0,
                "reasoning": "Insufficient price history",
                "risk_level": "high"
            }
        
        # Simple momentum calculation
        recent_trend = (prices[-1] - prices[-5]) / prices[-5]
        volume = market_data.get("volume", 0)
        
        if recent_trend > 0.05 and volume > 1000000:
            return {
                "signal": "buy",
                "confidence": min(0.8, abs(recent_trend) * 10),
                "reasoning": f"Strong upward momentum: {recent_trend:.2%}",
                "risk_level": "medium"
            }
        elif recent_trend < -0.05:
            return {
                "signal": "sell",
                "confidence": min(0.8, abs(recent_trend) * 10),
                "reasoning": f"Strong downward momentum: {recent_trend:.2%}",
                "risk_level": "medium"
            }
        
        return {
            "signal": "hold",
            "confidence": 0.6,
            "reasoning": "Sideways movement detected",
            "risk_level": "low"
        }

class MeanReversionStrategy(TradingStrategy):
    """Mean reversion trading strategy"""
    
    def __init__(self):
        super().__init__("mean_reversion", 0.7)
    
    def analyze_market(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        prices = market_data.get("price_history", [])
        
        if len(prices) < 20:
            return {
                "signal": "hold",
                "confidence": 0.0,
                "reasoning": "Insufficient data for mean reversion",
                "risk_level": "high"
            }
        
        # Calculate simple moving average
        sma_20 = sum(prices[-20:]) / 20
        current_price = prices[-1]
        deviation = (current_price - sma_20) / sma_20
        
        if deviation > 0.1:  # Price 10% above average
            return {
                "signal": "sell",
                "confidence": min(0.9, abs(deviation) * 5),
                "reasoning": f"Price {deviation:.2%} above 20-period average",
                "risk_level": "medium"
            }
        elif deviation < -0.1:  # Price 10% below average
            return {
                "signal": "buy",
                "confidence": min(0.9, abs(deviation) * 5),
                "reasoning": f"Price {deviation:.2%} below 20-period average",
                "risk_level": "medium"
            }
        
        return {
            "signal": "hold",
            "confidence": 0.5,
            "reasoning": "Price near historical average",
            "risk_level": "low"
        }

class RiskManager:
    """Portfolio risk management"""
    
    def __init__(self, max_position_size: float = 0.1, max_portfolio_risk: float = 0.15):
        self.max_position_size = max_position_size
        self.max_portfolio_risk = max_portfolio_risk
        self.current_positions = {}
    
    def calculate_position_size(self, signal: Dict[str, Any], portfolio_value: float) -> float:
        """Calculate appropriate position size based on risk parameters"""
        base_size = self.max_position_size
        confidence = signal.get("confidence", 0.5)
        risk_level = signal.get("risk_level", "medium")
        
        # Adjust for confidence
        size_multiplier = confidence
        
        # Adjust for risk level
        risk_adjustments = {
            "low": 1.2,
            "medium": 1.0,
            "high": 0.5
        }
        size_multiplier *= risk_adjustments.get(risk_level, 1.0)
        
        position_size = base_size * size_multiplier
        return min(position_size, self.max_position_size)
    
    def validate_trade(self, signal: Dict[str, Any], symbol: str) -> bool:
        """Validate if trade meets risk criteria"""
        confidence = signal.get("confidence", 0.0)
        
        # Minimum confidence threshold
        if confidence < 0.6:
            return False
        
        # Check portfolio concentration
        if len(self.current_positions) >= 10:  # Max 10 positions
            return False
        
        return True

class AriaTrader:
    """Main trading system coordinator"""
    
    def __init__(self):
        self.strategies = [
            MomentumStrategy(),
            MeanReversionStrategy()
        ]
        self.risk_manager = RiskManager()
        self.portfolio_value = 0.0
        self.active_positions = {}
        self.trading_history = []
    
    async def analyze_symbol(self, symbol: str, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a symbol using all strategies"""
        
        strategy_results = []
        for strategy in self.strategies:
            if strategy.active:
                result = strategy.analyze_market(market_data)
                result["strategy"] = strategy.name
                strategy_results.append(result)
        
        # Aggregate strategy results
        consensus = self._calculate_consensus(strategy_results)
        
        return {
            "symbol": symbol,
            "timestamp": datetime.now().isoformat(),
            "individual_strategies": strategy_results,
            "consensus": consensus,
            "position_size": self.risk_manager.calculate_position_size(consensus, self.portfolio_value)
        }
    
    def _calculate_consensus(self, strategy_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate consensus signal from multiple strategies"""
        
        if not strategy_results:
            return {
                "signal": "hold",
                "confidence": 0.0,
                "reasoning": "No active strategies",
                "risk_level": "high"
            }
        
        # Weight strategies by confidence
        weighted_signals = {"buy": 0, "sell": 0, "hold": 0}
        total_weight = 0
        
        for result in strategy_results:
            signal = result["signal"]
            confidence = result["confidence"]
            weighted_signals[signal] += confidence
            total_weight += confidence
        
        # Determine consensus signal
        if total_weight == 0:
            consensus_signal = "hold"
            consensus_confidence = 0.0
        else:
            consensus_signal = max(weighted_signals, key=weighted_signals.get)
            consensus_confidence = weighted_signals[consensus_signal] / total_weight
        
        # Aggregate reasoning
        reasoning_parts = [f"{r['strategy']}: {r['reasoning']}" for r in strategy_results]
        
        return {
            "signal": consensus_signal,
            "confidence": consensus_confidence,
            "reasoning": "; ".join(reasoning_parts),
            "risk_level": self._aggregate_risk_level(strategy_results)
        }
    
    def _aggregate_risk_level(self, strategy_results: List[Dict[str, Any]]) -> str:
        """Aggregate risk levels from strategies"""
        risk_levels = [r["risk_level"] for r in strategy_results]
        
        if "high" in risk_levels:
            return "high"
        elif "medium" in risk_levels:
            return "medium"
        else:
            return "low"
    
    async def execute_trade(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Execute trade based on analysis"""
        
        symbol = analysis["symbol"]
        consensus = analysis["consensus"]
        
        if not self.risk_manager.validate_trade(consensus, symbol):
            return {
                "executed": False,
                "reason": "Trade failed risk validation"
            }
        
        # In real implementation, this would connect to exchange APIs
        trade_result = {
            "executed": True,
            "symbol": symbol,
            "signal": consensus["signal"],
            "confidence": consensus["confidence"],
            "position_size": analysis["position_size"],
            "timestamp": datetime.now().isoformat()
        }
        
        self.trading_history.append(trade_result)
        return trade_result

async def main():
    """Main trading loop"""
    trader = AriaTrader()
    
    # Sample market data for testing
    sample_data = {
        "BTC/USD": {
            "price_history": [45000, 44500, 46000, 47000, 46500, 48000, 47800, 48200],
            "volume": 2500000,
            "timestamp": datetime.now().isoformat()
        }
    }
    
    print("Aria Trading System Initialized")
    
    for symbol, market_data in sample_data.items():
        analysis = await trader.analyze_symbol(symbol, market_data)
        
        print(f"\nAnalysis for {symbol}:")
        print(f"Consensus Signal: {analysis['consensus']['signal']}")
        print(f"Confidence: {analysis['consensus']['confidence']:.2f}")
        print(f"Reasoning: {analysis['consensus']['reasoning']}")
        print(f"Recommended Position Size: {analysis['position_size']:.2%}")
        
        # Execute trade if signal is not hold
        if analysis['consensus']['signal'] != 'hold':
            trade_result = await trader.execute_trade(analysis)
            print(f"Trade Executed: {trade_result['executed']}")

if __name__ == "__main__":
    asyncio.run(main())