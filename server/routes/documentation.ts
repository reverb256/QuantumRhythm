
import { Router } from 'express';
import { documentationOrchestrator } from '../documentation-orchestrator';

const router = Router();

// Get organized documentation index
router.get('/index', async (req, res) => {
  try {
    const masterIndex = documentationOrchestrator.generateMasterIndex();
    res.json({
      success: true,
      data: {
        index: masterIndex,
        consciousness_report: documentationOrchestrator.getConsciousnessReport()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate documentation index'
    });
  }
});

// Get consciousness metrics
router.get('/consciousness', async (req, res) => {
  try {
    const report = documentationOrchestrator.getConsciousnessReport();
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get consciousness metrics'
    });
  }
});

// Reorganize documentation files
router.post('/reorganize', async (req, res) => {
  try {
    const results = documentationOrchestrator.reorganizeFiles();
    res.json({
      success: true,
      data: results,
      message: 'Documentation reorganization planned'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reorganize documentation'
    });
  }
});

// Search documentation
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    // This would implement actual search functionality
    const results = {
      query,
      results: [],
      consciousness_context: documentationOrchestrator.getConsciousnessReport()
    };

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

export default router;
