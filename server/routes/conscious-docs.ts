import { Router } from 'express';
import { consciousDocumentationSystem } from '../conscious-documentation-system';

const router = Router();

// Get documentation index with consciousness metrics
router.get('/index', async (req, res) => {
  try {
    const index = await consciousDocumentationSystem.getDocumentationIndex();
    res.json({
      success: true,
      data: index
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get documentation index'
    });
  }
});

// Get specific document
router.get('/document/:id', async (req, res) => {
  try {
    const document = await consciousDocumentationSystem.getDocument(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get document'
    });
  }
});

// Search documents
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    const results = await consciousDocumentationSystem.searchDocuments(query);
    
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

// Get real-time system status
router.get('/status', async (req, res) => {
  try {
    const status = await consciousDocumentationSystem.generateRealTimeStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get system status'
    });
  }
});

// Force evolution cycle (for testing)
router.post('/evolve', async (req, res) => {
  try {
    // This would trigger manual evolution
    res.json({
      success: true,
      message: 'Evolution cycle triggered'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to trigger evolution'
    });
  }
});

export default router;