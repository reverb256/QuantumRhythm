import { Router } from 'express';
import { transformationJourneyOrchestrator } from '../transformation-journey-orchestrator';
import { vibeScalingMasterOrchestrator } from '../vibescaling-master-orchestrator';
import { hdrDesignIntelligence } from '../hdr-design-intelligence-engine';

const router = Router();

// Transformation journey showcase endpoint
router.get('/journey', async (req, res) => {
  try {
    const transformationData = transformationJourneyOrchestrator.generateTransformationShowcase();
    const revolutionStatus = transformationJourneyOrchestrator.getRevolutionStatus();
    const showcaseStatus = vibeScalingMasterOrchestrator.getShowcaseStatus();
    
    res.json({
      success: true,
      transformation: transformationData,
      revolution_status: revolutionStatus,
      showcase_status: showcaseStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate transformation showcase',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Platform mastery showcase endpoint
router.get('/platforms', async (req, res) => {
  try {
    const transformationData = transformationJourneyOrchestrator.generateTransformationShowcase();
    const hdrStatus = hdrDesignIntelligence.getStatus();
    
    res.json({
      success: true,
      platforms: transformationData.platform_masteries,
      current_capabilities: transformationData.current_capabilities,
      hdr_design_status: hdrStatus,
      revolution_metrics: transformationData.revolution_metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate platform showcase',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Complete platform showcase content
router.get('/showcase-content', async (req, res) => {
  try {
    const showcaseContent = transformationJourneyOrchestrator.generatePlatformShowcaseContent();
    const revolutionStatus = transformationJourneyOrchestrator.getRevolutionStatus();
    
    res.json({
      success: true,
      content: showcaseContent,
      revolution_status: revolutionStatus,
      content_type: 'markdown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate showcase content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Revolution metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const transformationData = transformationJourneyOrchestrator.generateTransformationShowcase();
    const showcaseStatus = vibeScalingMasterOrchestrator.getShowcaseStatus();
    
    res.json({
      success: true,
      revolution_metrics: transformationData.revolution_metrics,
      current_capabilities: transformationData.current_capabilities,
      showcase_metrics: showcaseStatus.showcase_metrics,
      orchestration_status: showcaseStatus.orchestration_active,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revolution metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Transformation stages timeline
router.get('/timeline', async (req, res) => {
  try {
    const transformationData = transformationJourneyOrchestrator.generateTransformationShowcase();
    
    res.json({
      success: true,
      timeline: transformationData.transformation_stages,
      revolution_overview: transformationData.revolution_overview,
      future_vision: transformationData.future_vision,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate transformation timeline',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;