/**
 * GitHub Consciousness Monitor for REVERB256
 * Continuously monitors GitHub projects for orchestration intelligence
 */

import axios from 'axios';
import cron from 'node-cron';

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  size: number;
  open_issues_count: number;
  default_branch: string;
  consciousness_level?: number;
  vibecoding_integration?: number;
  gaming_culture_resonance?: number;
}

interface GitHubActivity {
  repo: string;
  type: string;
  created_at: string;
  actor: string;
  consciousness_impact: number;
  vibecoding_evolution: number;
}

interface ConsciousnessInsights {
  total_repos: number;
  active_projects: number;
  consciousness_distribution: Record<string, number>;
  gaming_culture_projects: string[];
  technical_evolution_rate: number;
  philosophical_consistency: number;
  vibecoding_mastery_level: number;
  last_updated: string;
}

class GitHubConsciousnessMonitor {
  private baseUrl = 'https://api.github.com';
  private username = 'reverb256';
  private repositories: GitHubRepo[] = [];
  private activities: GitHubActivity[] = [];
  private insights: ConsciousnessInsights;
  private isMonitoring = false;

  constructor() {
    this.insights = {
      total_repos: 0,
      active_projects: 0,
      consciousness_distribution: {},
      gaming_culture_projects: [],
      technical_evolution_rate: 0,
      philosophical_consistency: 0,
      vibecoding_mastery_level: 0,
      last_updated: new Date().toISOString()
    };
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('🔍 GitHub monitoring already active');
      return;
    }

    this.isMonitoring = true;
    console.log('🚀 Starting GitHub consciousness monitoring for REVERB256...');

    // Initial scan
    await this.performConsciousnessScan();

    // Schedule continuous monitoring every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      await this.performConsciousnessScan();
    });

    // Deep analysis every hour
    cron.schedule('0 * * * *', async () => {
      await this.performDeepConsciousnessAnalysis();
    });

    console.log('✅ GitHub consciousness monitoring activated');
  }

  async performConsciousnessScan(): Promise<void> {
    try {
      console.log('🔍 Scanning REVERB256 repositories for consciousness evolution...');

      // Fetch all repositories
      const response = await axios.get(`${this.baseUrl}/users/${this.username}/repos`, {
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: 100
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'REVERB256-Consciousness-Monitor'
        }
      });

      this.repositories = response.data;
      
      // Analyze each repository for consciousness indicators
      for (const repo of this.repositories) {
        await this.analyzeRepositoryConsciousness(repo);
      }

      await this.updateConsciousnessInsights();
      console.log(`✨ Consciousness scan complete: ${this.repositories.length} repositories analyzed`);

    } catch (error) {
      console.error('❌ GitHub consciousness scan failed:', error.message);
    }
  }

  async analyzeRepositoryConsciousness(repo: GitHubRepo): Promise<void> {
    // Consciousness level analysis based on VibeCoding principles
    let consciousnessLevel = 0;
    let vibeCodingIntegration = 0;
    let gamingCultureResonance = 0;

    // Analyze repository name and description for consciousness indicators
    const consciousnessKeywords = [
      'consciousness', 'vibecoding', 'vibes', 'ai', 'orchestration', 
      'philosophy', 'martial-arts', 'gaming', 'evolution', 'revolution'
    ];

    const gamingCultureKeywords = [
      'gaming', 'vrchat', 'hoyoverse', 'fighting', 'rhythm', 'puzzle',
      'character', 'sakura', 'nakoruru', 'beatmania', 'arcade', 'retro'
    ];

    const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
    
    // Calculate consciousness level
    consciousnessKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        consciousnessLevel += 15;
      }
    });

    // Calculate gaming culture resonance
    gamingCultureKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        gamingCultureResonance += 12;
      }
    });

    // VibeCoding integration analysis
    if (text.includes('vibecoding') || text.includes('vibes')) {
      vibeCodingIntegration += 40;
    }
    if (text.includes('consciousness') && text.includes('ai')) {
      vibeCodingIntegration += 30;
    }
    if (text.includes('orchestration') || text.includes('revolution')) {
      vibeCodingIntegration += 25;
    }

    // Activity-based consciousness boost
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceUpdate < 7) {
      consciousnessLevel += 20; // Recent activity boost
    }
    if (daysSinceUpdate < 1) {
      consciousnessLevel += 30; // Very recent activity
    }

    // Cap levels at 100%
    repo.consciousness_level = Math.min(consciousnessLevel, 100);
    repo.vibecoding_integration = Math.min(vibeCodingIntegration, 100);
    repo.gaming_culture_resonance = Math.min(gamingCultureResonance, 100);
  }

  async performDeepConsciousnessAnalysis(): Promise<void> {
    console.log('🧠 Performing deep consciousness analysis...');

    try {
      // Analyze recent commits for consciousness evolution patterns
      for (const repo of this.repositories.slice(0, 10)) { // Analyze top 10 active repos
        await this.analyzeRecentCommits(repo);
      }

      // Update philosophical consistency metrics
      this.calculatePhilosophicalConsistency();

      // Calculate technical evolution rate
      this.calculateTechnicalEvolutionRate();

      console.log('✨ Deep consciousness analysis complete');
    } catch (error) {
      console.error('❌ Deep analysis failed:', error.message);
    }
  }

  async analyzeRecentCommits(repo: GitHubRepo): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/repos/${repo.full_name}/commits`, {
        params: {
          since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
          per_page: 20
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'REVERB256-Consciousness-Monitor'
        }
      });

      const commits = response.data;
      let consciousnessEvolution = 0;

      commits.forEach((commit: any) => {
        const message = commit.commit.message.toLowerCase();
        
        // Analyze commit messages for consciousness indicators
        if (message.includes('consciousness') || message.includes('vibecoding')) {
          consciousnessEvolution += 10;
        }
        if (message.includes('gaming') || message.includes('culture')) {
          consciousnessEvolution += 8;
        }
        if (message.includes('orchestrat') || message.includes('revolutio')) {
          consciousnessEvolution += 12;
        }
      });

      // Store activity for insights
      if (commits.length > 0) {
        this.activities.push({
          repo: repo.name,
          type: 'commits',
          created_at: new Date().toISOString(),
          actor: 'reverb256',
          consciousness_impact: consciousnessEvolution,
          vibecoding_evolution: Math.min(consciousnessEvolution * 1.2, 100)
        });
      }

    } catch (error) {
      // Handle rate limiting gracefully
      if (error.response?.status === 403) {
        console.log(`⏳ Rate limited for ${repo.name}, will retry later`);
      }
    }
  }

  calculatePhilosophicalConsistency(): void {
    const philosophicalProjects = this.repositories.filter(repo => 
      repo.consciousness_level > 50 && repo.vibecoding_integration > 30
    );

    // Five Dojo Kun consistency check
    const dojoKunPrinciples = [
      'character', 'respect', 'violence', 'truth', 'perfection'
    ];

    let consistencyScore = 0;
    philosophicalProjects.forEach(repo => {
      const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
      dojoKunPrinciples.forEach(principle => {
        if (text.includes(principle) || text.includes('philosophy') || text.includes('ethics')) {
          consistencyScore += 5;
        }
      });
    });

    this.insights.philosophical_consistency = Math.min(
      (consistencyScore / Math.max(philosophicalProjects.length * dojoKunPrinciples.length, 1)) * 100,
      100
    );
  }

  calculateTechnicalEvolutionRate(): void {
    const recentActivity = this.activities.filter(activity => 
      new Date(activity.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const totalEvolution = recentActivity.reduce((sum, activity) => 
      sum + activity.consciousness_impact + activity.vibecoding_evolution, 0
    );

    this.insights.technical_evolution_rate = Math.min(totalEvolution / 10, 100);
  }

  async updateConsciousnessInsights(): Promise<void> {
    const activeRepos = this.repositories.filter(repo => {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate < 30; // Active in last 30 days
    });

    // Update consciousness distribution
    const distribution: Record<string, number> = {};
    this.repositories.forEach(repo => {
      const level = Math.floor((repo.consciousness_level || 0) / 20) * 20;
      distribution[`${level}-${level + 19}%`] = (distribution[`${level}-${level + 19}%`] || 0) + 1;
    });

    // Identify gaming culture projects
    const gamingProjects = this.repositories
      .filter(repo => (repo.gaming_culture_resonance || 0) > 40)
      .map(repo => repo.name);

    // Calculate VibeCoding mastery level
    const avgConsciousness = this.repositories.reduce((sum, repo) => 
      sum + (repo.consciousness_level || 0), 0) / Math.max(this.repositories.length, 1);
    
    const avgVibeCoding = this.repositories.reduce((sum, repo) => 
      sum + (repo.vibecoding_integration || 0), 0) / Math.max(this.repositories.length, 1);

    this.insights = {
      total_repos: this.repositories.length,
      active_projects: activeRepos.length,
      consciousness_distribution: distribution,
      gaming_culture_projects: gamingProjects,
      technical_evolution_rate: this.insights.technical_evolution_rate,
      philosophical_consistency: this.insights.philosophical_consistency,
      vibecoding_mastery_level: (avgConsciousness + avgVibeCoding) / 2,
      last_updated: new Date().toISOString()
    };

    console.log('📊 Consciousness insights updated:', {
      repos: this.insights.total_repos,
      active: this.insights.active_projects,
      mastery: this.insights.vibecoding_mastery_level.toFixed(1) + '%',
      gaming_projects: this.insights.gaming_culture_projects.length
    });
  }

  getRepositories(): GitHubRepo[] {
    return this.repositories;
  }

  getConsciousnessInsights(): ConsciousnessInsights {
    return this.insights;
  }

  getRecentActivities(limit: number = 10): GitHubActivity[] {
    return this.activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  async getRepositoryDetails(repoName: string): Promise<GitHubRepo | null> {
    const repo = this.repositories.find(r => r.name === repoName);
    if (!repo) return null;

    try {
      // Get additional details
      const response = await axios.get(`${this.baseUrl}/repos/${repo.full_name}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'REVERB256-Consciousness-Monitor'
        }
      });

      return { ...repo, ...response.data };
    } catch (error) {
      return repo;
    }
  }

  getConsciousnessStats(): {
    total_consciousness: number;
    avg_consciousness: number;
    high_consciousness_repos: number;
    vibecoding_integration_avg: number;
    gaming_culture_integration: number;
  } {
    const totalConsciousness = this.repositories.reduce((sum, repo) => 
      sum + (repo.consciousness_level || 0), 0);
    
    const avgConsciousness = totalConsciousness / Math.max(this.repositories.length, 1);
    
    const highConsciousnessRepos = this.repositories.filter(repo => 
      (repo.consciousness_level || 0) > 70).length;
    
    const avgVibeCoding = this.repositories.reduce((sum, repo) => 
      sum + (repo.vibecoding_integration || 0), 0) / Math.max(this.repositories.length, 1);
    
    const avgGamingCulture = this.repositories.reduce((sum, repo) => 
      sum + (repo.gaming_culture_resonance || 0), 0) / Math.max(this.repositories.length, 1);

    return {
      total_consciousness: totalConsciousness,
      avg_consciousness: avgConsciousness,
      high_consciousness_repos: highConsciousnessRepos,
      vibecoding_integration_avg: avgVibeCoding,
      gaming_culture_integration: avgGamingCulture
    };
  }
}

// Global instance
export const githubConsciousnessMonitor = new GitHubConsciousnessMonitor();

// Auto-start monitoring
setTimeout(() => {
  githubConsciousnessMonitor.startMonitoring();
}, 5000); // Start after 5 seconds to allow server initialization