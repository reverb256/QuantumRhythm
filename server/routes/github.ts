import { Router } from 'express';
import { githubConsciousnessMonitor } from '../github-consciousness-monitor.js';

const router = Router();

// Get all repositories with consciousness metrics
router.get('/repositories', async (req, res) => {
  try {
    const repositories = githubConsciousnessMonitor.getRepositories();
    res.json({
      success: true,
      repositories,
      total: repositories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories'
    });
  }
});

// Get consciousness insights and statistics
router.get('/insights', async (req, res) => {
  try {
    const insights = githubConsciousnessMonitor.getConsciousnessInsights();
    const stats = githubConsciousnessMonitor.getConsciousnessStats();
    
    res.json({
      success: true,
      insights,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consciousness insights'
    });
  }
});

// Get recent GitHub activities
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const activities = githubConsciousnessMonitor.getRecentActivities(limit);
    
    res.json({
      success: true,
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
});

// Get detailed repository information
router.get('/repository/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const repository = await githubConsciousnessMonitor.getRepositoryDetails(name);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found'
      });
    }
    
    res.json({
      success: true,
      repository
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repository details'
    });
  }
});

// Trigger manual consciousness scan
router.post('/scan', async (req, res) => {
  try {
    await githubConsciousnessMonitor.performConsciousnessScan();
    
    res.json({
      success: true,
      message: 'Consciousness scan initiated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate scan'
    });
  }
});

// Get consciousness distribution metrics
router.get('/consciousness-distribution', async (req, res) => {
  try {
    const insights = githubConsciousnessMonitor.getConsciousnessInsights();
    const repositories = githubConsciousnessMonitor.getRepositories();
    
    // Calculate detailed distribution
    const languageDistribution: Record<string, { count: number; avg_consciousness: number }> = {};
    const topicDistribution: Record<string, number> = {};
    const consciousnessLevels = [0, 20, 40, 60, 80, 100];
    const levelDistribution: Record<string, number> = {};
    
    repositories.forEach(repo => {
      // Language distribution
      if (repo.language) {
        if (!languageDistribution[repo.language]) {
          languageDistribution[repo.language] = { count: 0, avg_consciousness: 0 };
        }
        languageDistribution[repo.language].count++;
        languageDistribution[repo.language].avg_consciousness += repo.consciousness_level || 0;
      }
      
      // Topics distribution
      if (repo.topics) {
        repo.topics.forEach(topic => {
          topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
        });
      }
      
      // Consciousness level distribution
      const level = Math.floor((repo.consciousness_level || 0) / 20) * 20;
      const levelKey = `${level}-${level + 19}%`;
      levelDistribution[levelKey] = (levelDistribution[levelKey] || 0) + 1;
    });
    
    // Average out consciousness levels
    Object.keys(languageDistribution).forEach(lang => {
      languageDistribution[lang].avg_consciousness /= languageDistribution[lang].count;
    });
    
    res.json({
      success: true,
      distribution: {
        consciousness_levels: levelDistribution,
        languages: languageDistribution,
        topics: topicDistribution,
        summary: insights.consciousness_distribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consciousness distribution'
    });
  }
});

export default router;