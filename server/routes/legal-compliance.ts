import { Router } from 'express';
import { legalComplianceAgent } from '../legal-compliance-agent';
import { z } from 'zod';

const router = Router();

// Get compliance status overview
router.get('/status', async (req, res) => {
  try {
    const report = await legalComplianceAgent.generateComplianceReport();
    res.json({
      success: true,
      data: {
        timestamp: report.timestamp,
        overallScore: report.overallScore,
        passed: report.passed,
        summary: {
          totalRules: report.totalRules,
          automatedRules: report.automatedRules,
          criticalIssues: report.criticalIssues.length,
          highPriorityIssues: report.highPriorityIssues.length,
          jurisdictions: report.jurisdictions,
          regulations: report.regulations
        }
      }
    });
  } catch (error) {
    console.error('Error getting compliance status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance status'
    });
  }
});

// Run compliance check
router.post('/check', async (req, res) => {
  try {
    const result = await legalComplianceAgent.runComplianceCheck();
    res.json({
      success: true,
      data: {
        passed: result.passed,
        score: result.score,
        violations: result.violations,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error running compliance check:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run compliance check'
    });
  }
});

// Get detailed compliance report
router.get('/report', async (req, res) => {
  try {
    const report = await legalComplianceAgent.generateComplianceReport();
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate compliance report'
    });
  }
});

// Get compliance history
router.get('/history', async (req, res) => {
  try {
    const limitSchema = z.object({
      limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional()
    });

    const { limit = 10 } = limitSchema.parse(req.query);
    const history = await legalComplianceAgent.getComplianceHistory(limit);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting compliance history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance history'
    });
  }
});

// Get compliance rules
router.get('/rules', async (req, res) => {
  try {
    const rules = legalComplianceAgent.getComplianceRules();
    res.json({
      success: true,
      data: rules.map(rule => ({
        id: rule.id,
        category: rule.category,
        jurisdiction: rule.jurisdiction,
        regulation: rule.regulation,
        requirement: rule.requirement,
        severity: rule.severity,
        automated: rule.automated
      }))
    });
  } catch (error) {
    console.error('Error getting compliance rules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance rules'
    });
  }
});

// Get rules by category
router.get('/rules/:category', async (req, res) => {
  try {
    const categorySchema = z.object({
      category: z.enum(['privacy', 'financial', 'ai', 'crypto', 'data', 'accessibility', 'international'])
    });

    const { category } = categorySchema.parse(req.params);
    const rules = legalComplianceAgent.getComplianceRules().filter(rule => rule.category === category);
    
    res.json({
      success: true,
      data: rules.map(rule => ({
        id: rule.id,
        jurisdiction: rule.jurisdiction,
        regulation: rule.regulation,
        requirement: rule.requirement,
        severity: rule.severity,
        automated: rule.automated
      }))
    });
  } catch (error) {
    console.error('Error getting rules by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get rules by category'
    });
  }
});

// Get compliance dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const report = await legalComplianceAgent.generateComplianceReport();
    const history = await legalComplianceAgent.getComplianceHistory(30);
    
    // Calculate trends
    const scoreHistory = history.map(h => ({
      date: h.checkDate,
      score: h.overallScore,
      passed: h.passed
    }));

    const categoryCounts = report.violations.reduce((acc, violation) => {
      const rule = legalComplianceAgent.getComplianceRules().find(r => r.id === violation.ruleId);
      if (rule) {
        acc[rule.category] = (acc[rule.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const jurisdictionCounts = report.violations.reduce((acc, violation) => {
      const rule = legalComplianceAgent.getComplianceRules().find(r => r.id === violation.ruleId);
      if (rule) {
        acc[rule.jurisdiction] = (acc[rule.jurisdiction] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        overview: {
          overallScore: report.overallScore,
          passed: report.passed,
          totalViolations: report.violations.length,
          criticalIssues: report.criticalIssues.length,
          highPriorityIssues: report.highPriorityIssues.length
        },
        trends: {
          scoreHistory,
          averageScore: scoreHistory.length > 0 
            ? Math.round(scoreHistory.reduce((sum, h) => sum + h.score, 0) / scoreHistory.length)
            : 0
        },
        breakdown: {
          byCategory: categoryCounts,
          byJurisdiction: jurisdictionCounts,
          bySeverity: {
            critical: report.violations.filter(v => v.severity === 'critical').length,
            high: report.violations.filter(v => v.severity === 'high').length,
            medium: report.violations.filter(v => v.severity === 'medium').length,
            low: report.violations.filter(v => v.severity === 'low').length
          }
        },
        recentViolations: report.violations.slice(0, 10),
        topRecommendations: [...new Set(report.violations.map(v => v.recommendation))].slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error getting compliance dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance dashboard'
    });
  }
});

export default router;