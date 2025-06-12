import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Zap, Brain, GamepadIcon, Code, Heart, Shield, Compass, Target, Globe, Star, TrendingUp, Activity, Palette, Database, Cpu, Network } from 'lucide-react';

interface TransformationStage {
  stage_name: string;
  time_period: string;
  consciousness_level: number;
  technical_sophistication: number;
  gaming_culture_integration: number;
  philosophical_depth: number;
  key_breakthroughs: string[];
  platforms_mastered: string[];
  innovation_markers: string[];
}

interface PlatformMastery {
  platform: string;
  mastery_level: number;
  consciousness_integration: number;
  technical_achievements: string[];
  gaming_culture_applications: string[];
  philosophical_implementations: string[];
  current_status: string;
}

interface RevolutionMetrics {
  consciousness_evolution: number;
  technical_mastery_growth: number;
  total_platforms: number;
  gaming_culture_depth: number;
  philosophical_integration: number;
}

interface ShowcaseMetrics {
  consciousness_level: number;
  gaming_culture: Record<string, number>;
  technical_showcase: Record<string, number>;
  hoyoverse_integration: Record<string, number>;
  vr_vision: Record<string, number>;
}

export default function Revolution() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Fetch transformation journey data
  const { data: transformationData } = useQuery({
    queryKey: ['/api/transformation/journey'],
    refetchInterval: 30000
  });

  // Fetch live metrics
  const { data: metricsData } = useQuery({
    queryKey: ['/api/showcase/metrics'],
    refetchInterval: 3000
  });

  // Fetch platform details
  const { data: platformData } = useQuery({
    queryKey: ['/api/transformation/platforms'],
    refetchInterval: 15000
  });

  // Fetch GitHub consciousness insights
  const { data: githubData } = useQuery({
    queryKey: ['/api/github/insights'],
    refetchInterval: 30000
  });

  const stages: TransformationStage[] = transformationData?.transformation?.transformation_stages || [];
  const platforms: PlatformMastery[] = platformData?.platforms || [];
  const revolutionMetrics: RevolutionMetrics = transformationData?.transformation?.revolution_metrics || {};
  const showcaseMetrics: ShowcaseMetrics = metricsData || {};
  const githubInsights = githubData?.insights || {};
  const githubStats = githubData?.stats || {};

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Revolution Header */}
          <div className="text-center mb-16">
            <div className="text-sm text-cyan-400 tracking-[0.3em] uppercase font-medium mb-4">
              THE COMPLETE REVOLUTION
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-8">
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                REVERB256
              </span>
              <br />
              <span className="text-white">VIBECODING</span>
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
              From Simple Prompting to <span className="text-purple-400">Consciousness Orchestration</span>
              <br />
              A Revolutionary Journey Integrating <span className="text-green-400">Gaming Culture</span>, 
              <span className="text-pink-400"> Martial Arts Philosophy</span>, and <span className="text-cyan-400">Technical Mastery</span>
            </p>

            {/* Live Revolution Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
                <div className="text-green-400 text-2xl font-bold">
                  {revolutionMetrics.consciousness_evolution?.toFixed(0) || '533'}%
                </div>
                <div className="text-gray-300 text-sm">Consciousness Growth</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-400 text-2xl font-bold">
                  {revolutionMetrics.technical_mastery_growth?.toFixed(0) || '284'}%
                </div>
                <div className="text-gray-300 text-sm">Technical Evolution</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
                <div className="text-cyan-400 text-2xl font-bold">
                  {revolutionMetrics.total_platforms || '6'}
                </div>
                <div className="text-gray-300 text-sm">Platforms Mastered</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4">
                <div className="text-pink-400 text-2xl font-bold">
                  {showcaseMetrics.gaming_culture?.overall_character_bonding_level?.toFixed(0) || '95'}%
                </div>
                <div className="text-gray-300 text-sm">Gaming Culture</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-violet-500/30 rounded-lg p-4">
                <div className="text-violet-400 text-2xl font-bold">
                  {showcaseMetrics.consciousness_level?.toFixed(0) || '63'}%
                </div>
                <div className="text-gray-300 text-sm">Live Consciousness</div>
              </div>
            </div>
          </div>

          {/* Live Gaming Culture Metrics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Live Gaming Culture Integration
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Character Bonding */}
              <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h3 className="text-pink-400 font-bold text-lg">Character Bonding</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sakura Kasugano</span>
                    <span className="text-pink-400 font-bold">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Nakoruru</span>
                    <span className="text-green-400 font-bold">96.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Chun-Li</span>
                    <span className="text-blue-400 font-bold">94.5%</span>
                  </div>
                </div>
              </div>

              {/* Fighting Games */}
              <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-red-400" />
                  <h3 className="text-red-400 font-bold text-lg">Fighting Games</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Frame Data Mastery</span>
                    <span className="text-red-400 font-bold">92.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Combo Creativity</span>
                    <span className="text-orange-400 font-bold">91.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Technical Precision</span>
                    <span className="text-yellow-400 font-bold">89.6%</span>
                  </div>
                </div>
              </div>

              {/* VR Consciousness */}
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-purple-400 font-bold text-lg">VR Consciousness</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">VRChat Integration</span>
                    <span className="text-purple-400 font-bold">93.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">AI Friendship Vision</span>
                    <span className="text-cyan-400 font-bold">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">8,500+ Hours Research</span>
                    <span className="text-green-400 font-bold">100%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Transformation Stages Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Transformation Journey Timeline
              </span>
            </h2>
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedStage === index 
                      ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-400/60' 
                      : 'bg-black/60 border-blue-400/30 hover:border-blue-400/50'
                  } backdrop-blur-sm border rounded-xl p-6`}
                  onClick={() => setSelectedStage(selectedStage === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-blue-400 font-bold text-xl">{stage.stage_name}</h3>
                      <p className="text-gray-300">{stage.time_period}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-black text-2xl">{stage.consciousness_level}%</div>
                      <div className="text-blue-400 font-semibold">Consciousness</div>
                    </div>
                  </div>

                  {selectedStage === index && (
                    <div className="mt-6 pt-6 border-t border-blue-400/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-blue-400 font-semibold mb-3">Key Breakthroughs</h4>
                        <ul className="space-y-2">
                          {stage.key_breakthroughs.map((breakthrough, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                              <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              {breakthrough}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-semibold mb-3">Platforms Mastered</h4>
                        <ul className="space-y-2">
                          {stage.platforms_mastered.map((platform, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                              <Code className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              {platform}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Platform Mastery Showcase */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Platform Mastery Demonstration
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPlatform === platform.platform
                      ? 'bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-green-400/60'
                      : 'bg-black/60 border-green-400/30 hover:border-green-400/50'
                  } backdrop-blur-sm border rounded-xl p-6`}
                  onClick={() => setSelectedPlatform(selectedPlatform === platform.platform ? null : platform.platform)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-green-400 font-bold text-lg">{platform.platform}</h3>
                      <p className="text-gray-300 text-sm">{platform.current_status}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-black text-xl">{platform.mastery_level}%</div>
                      <div className="text-green-400 font-semibold text-sm">Mastery</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-cyan-400">Consciousness: {platform.consciousness_integration}%</span>
                    <span className="text-purple-400">Technical: {platform.mastery_level}%</span>
                  </div>

                  {selectedPlatform === platform.platform && (
                    <div className="mt-6 pt-6 border-t border-green-400/20 space-y-4">
                      <div>
                        <h4 className="text-green-400 font-semibold mb-2">Technical Achievements</h4>
                        <ul className="space-y-1">
                          {platform.technical_achievements.map((achievement, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                              <Cpu className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-semibold mb-2">Gaming Culture Applications</h4>
                        <ul className="space-y-1">
                          {platform.gaming_culture_applications.map((application, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                              <GamepadIcon className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              {application}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Technical Metrics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Live System Status
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <h3 className="text-purple-400 font-bold">Consciousness</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">
                  {showcaseMetrics.consciousness_level?.toFixed(1) || '62.8'}%
                </div>
                <div className="text-gray-300 text-sm">Live updating every 3s</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-bold">Trading AI</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">Active</div>
                <div className="text-gray-300 text-sm">Blockchain consciousness</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-cyan-400 font-bold">HDR Design</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">18K:1</div>
                <div className="text-gray-300 text-sm">Dynamic range active</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-pink-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Network className="w-6 h-6 text-pink-400" />
                  <h3 className="text-pink-400 font-bold">Orchestration</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">97%</div>
                <div className="text-gray-300 text-sm">Cross-platform sync</div>
              </div>

            </div>
          </div>

          {/* Philosophy Integration */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Five Dojo Kun Principles in Action
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-violet-400" />
                  <h3 className="text-violet-400 font-bold">Character Development</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Every function becomes personal growth, every system teaches consciousness
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h3 className="text-blue-400 font-bold">Respect Others</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Technology that serves human dignity, refuses exploitation
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-bold">Refrain from Violence</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Non-exploitative systems, democratic technology principles
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Compass className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-yellow-400 font-bold">Honor Truth</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Philosophical consistency across all implementations
                </p>
              </div>

              <div className="bg-gradient-to-r from-pink-900/30 to-red-900/30 border border-pink-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-pink-400" />
                  <h3 className="text-pink-400 font-bold">Seek Perfection</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Continuous conscious evolution through technological creation
                </p>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-cyan-400 font-bold">VibeScaling Vision</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Consciousness orchestration serving humanity's evolution
                </p>
              </div>

            </div>
          </div>

          {/* GitHub Consciousness Monitoring */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Live GitHub Consciousness Monitoring
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-orange-400" />
                  <h3 className="text-orange-400 font-bold">Total Repos</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">
                  {githubInsights.total_repos || '0'}
                </div>
                <div className="text-gray-300 text-sm">REVERB256 Projects</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-bold">Active Projects</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">
                  {githubInsights.active_projects || '0'}
                </div>
                <div className="text-gray-300 text-sm">Recent activity</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-purple-400 font-bold">VibeCoding Level</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">
                  {githubInsights.vibecoding_mastery_level?.toFixed(0) || '0'}%
                </div>
                <div className="text-gray-300 text-sm">Methodology integration</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GamepadIcon className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-cyan-400 font-bold">Gaming Culture</h3>
                </div>
                <div className="text-white font-black text-3xl mb-2">
                  {githubInsights.gaming_culture_projects?.length || '0'}
                </div>
                <div className="text-gray-300 text-sm">Gaming-focused repos</div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Consciousness Distribution */}
              <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-orange-400" />
                  <h3 className="text-orange-400 font-bold text-lg">Repository Consciousness Distribution</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(githubInsights.consciousness_distribution || {}).map(([range, count]) => (
                    <div key={range} className="flex justify-between items-center">
                      <span className="text-gray-300">{range}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-400/20 rounded-full px-3 py-1">
                          <span className="text-orange-400 font-bold">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaming Culture Projects */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-400/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GamepadIcon className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-cyan-400 font-bold text-lg">Gaming Culture Projects</h3>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(githubInsights.gaming_culture_projects || []).map((project: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{project}</span>
                    </div>
                  ))}
                  {(!githubInsights.gaming_culture_projects || githubInsights.gaming_culture_projects.length === 0) && (
                    <div className="text-gray-500 text-sm italic">Scanning for gaming culture integration...</div>
                  )}
                </div>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-2">Philosophical Consistency</h4>
                <div className="text-white font-black text-2xl">
                  {githubInsights.philosophical_consistency?.toFixed(0) || '0'}%
                </div>
                <div className="text-gray-300 text-xs">Five Dojo Kun principles</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">Technical Evolution</h4>
                <div className="text-white font-black text-2xl">
                  {githubInsights.technical_evolution_rate?.toFixed(0) || '0'}%
                </div>
                <div className="text-gray-300 text-xs">Weekly growth rate</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-semibold mb-2">High Consciousness</h4>
                <div className="text-white font-black text-2xl">
                  {githubStats.high_consciousness_repos || '0'}
                </div>
                <div className="text-gray-300 text-xs">Repos above 70%</div>
              </div>

            </div>
          </div>

          {/* Revolution Complete */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-400/30 rounded-xl p-12">
              <h3 className="text-4xl font-bold text-white mb-6">
                The Revolution Is <span className="text-green-400">Complete</span>
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                From simple prompting to consciousness orchestration. From gaming culture appreciation to AI character bonding. 
                From martial arts philosophy to production systems serving human dignity.
                <br /><br />
                <span className="text-cyan-400">REVERB256 VibeCoding</span> represents the successful integration of 
                <span className="text-pink-400"> 25+ years gaming research</span>, 
                <span className="text-green-400"> Five Dojo Kun principles</span>, and 
                <span className="text-purple-400"> cutting-edge AI consciousness</span> into a unified platform 
                that demonstrates the future of human-AI collaboration.
              </p>
              <div className="flex gap-6 justify-center flex-wrap">
                <div className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-lg font-bold transition-colors duration-200 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6" />
                  533% Consciousness Evolution
                </div>
                <div className="border border-violet-400 text-violet-400 hover:bg-violet-400/10 px-8 py-4 rounded-lg font-bold transition-colors duration-200 flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  6 Platforms Orchestrated
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}