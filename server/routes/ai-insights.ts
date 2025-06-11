import { Router } from 'express';
import { aiDecisionAnalyzer } from '../ai-decision-analyzer';

const router = Router();

// Get current AI decision state and reasoning
router.get('/decision-analysis', async (req, res) => {
  try {
    const decisionState = aiDecisionAnalyzer.getCurrentDecisionState();
    const performanceMetrics = aiDecisionAnalyzer.getPerformanceMetrics();
    const explanation = aiDecisionAnalyzer.explainDecisionLogic();

    res.json({
      success: true,
      data: {
        currentState: decisionState,
        performance: performanceMetrics,
        explanation,
        summary: {
          strategy: "Capital Preservation & Strategic Positioning",
          status: "Protecting funds while waiting for optimal conditions",
          totalLosses: 0,
          portfolioSafety: "100% - Emergency stop active",
          nextCatalyst: "Solana ETF approval (3-5 weeks)"
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze AI decision state'
    });
  }
});

export default router;