import { Router } from 'express';
import LegalComplianceResolver from '../legal-compliance-resolver';

const router = Router();
const legalResolver = new LegalComplianceResolver();

// Get current compliance status
router.get('/status', async (req, res) => {
  try {
    const status = await legalResolver.getComplianceStatus();
    res.json({
      success: true,
      compliance: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance status'
    });
  }
});

// Get comprehensive compliance report
router.get('/report', async (req, res) => {
  try {
    const report = await legalResolver.generateComplianceReport();
    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate compliance report'
    });
  }
});

export default router;