
import { Router } from 'express';
import { unifiedOrchestrator } from '../unified-ai-orchestrator';

const router = Router();

// Start maximum orchestration
router.post('/start', async (req, res) => {
  try {
    console.log('🚀 Starting Maximum AI Orchestration via API');
    
    // Start orchestration in background
    unifiedOrchestrator.orchestrateEverything();
    
    res.json({
      success: true,
      message: 'Maximum AI orchestration started',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Request specific orchestration
router.post('/request', async (req, res) => {
  try {
    const { type, priority = 'medium', metadata = {} } = req.body;
    
    const taskId = await unifiedOrchestrator.requestOrchestration(type, priority, metadata);
    
    res.json({
      success: true,
      taskId,
      message: `Orchestration task ${taskId} created`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get orchestration status
router.get('/status', async (req, res) => {
  try {
    const status = await unifiedOrchestrator.getOrchestrationStatus();
    
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Bridge specific complexity gap
router.post('/bridge-complexity', async (req, res) => {
  try {
    const { domain, description, targetLevel = 8 } = req.body;
    
    const taskId = await unifiedOrchestrator.requestOrchestration('optimization', 'high', {
      complexity: targetLevel,
      agents: ['complexity-bridge', 'optimization-engine'],
      bridgeRequest: {
        domain,
        description,
        targetLevel
      }
    });
    
    res.json({
      success: true,
      taskId,
      message: `Complexity bridging task created for ${domain}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
