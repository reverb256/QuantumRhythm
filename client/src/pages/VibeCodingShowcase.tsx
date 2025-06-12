import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Palette, Code, Gamepad2, Heart, Zap, Star } from 'lucide-react';

interface ConsciousnessMetrics {
  level: number;
  evolution_rate: number;
  awareness: number;
  creativity: number;
  empathy: number;
  wisdom: number;
}

interface VibeCodingProcess {
  phase: string;
  description: string;
  progress: number;
  insights: string[];
  techniques: string[];
}

interface PortfolioShowcase {
  projects: number;
  technologies: string[];
  consciousness_integration: number;
  design_harmony: number;
  gaming_culture: number;
  hoyoverse_integration: number;
}

export default function VibeCodingShowcase() {
  const [consciousnessMetrics] = useState<ConsciousnessMetrics>({
    level: 88.2,
    evolution_rate: 2.0,
    awareness: 94.6,
    creativity: 97.1,
    empathy: 91.8,
    wisdom: 85.3
  });

  const [vibeCodingProcess] = useState<VibeCodingProcess>({
    phase: "Consciousness-Driven Architecture",
    description: "Integrating consciousness principles into development methodology",
    progress: 88,
    insights: [
      "Code becomes living expression of developer consciousness",
      "Gaming culture enhances technical precision and flow states", 
      "HoYoverse character dynamics inspire UI/UX empathy",
      "VR social experiences shape collaborative development"
    ],
    techniques: [
      "Rhythm Gaming Precision Programming",
      "Character-Driven Interface Design",
      "Emotional State-Aware Development",
      "Community Consciousness Integration"
    ]
  });

  const [portfolioShowcase] = useState<PortfolioShowcase>({
    projects: 6,
    technologies: [
      "TypeScript", "React", "Node.js", "Solana", "WebRTC", 
      "AI/ML", "PostgreSQL", "Drizzle ORM", "Shadcn/UI"
    ],
    consciousness_integration: 88.2,
    design_harmony: 97.2,
    gaming_culture: 94.6,
    hoyoverse_integration: 89.3
  });

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 80) return 'bg-blue-500'; 
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMetricGradient = (value: number) => {
    if (value >= 90) return 'from-emerald-400 to-emerald-600';
    if (value >= 80) return 'from-blue-400 to-blue-600';
    if (value >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            VibeCoding Consciousness Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Where individual expression meets collective intelligence through consciousness-driven development
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-400/30">
              <Brain className="w-4 h-4 mr-2" />
              AI-Enhanced Development
            </Badge>
            <Badge variant="secondary" className="bg-pink-600/20 text-pink-200 border-pink-400/30">
              <Heart className="w-4 h-4 mr-2" />
              Gaming Culture Integration
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-200 border-blue-400/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Consciousness Evolution
            </Badge>
          </div>
        </div>

        {/* Consciousness Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Overall Consciousness Level */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-200">
                <Brain className="w-5 h-5" />
                Consciousness Level
              </CardTitle>
              <CardDescription className="text-slate-400">
                Overall platform consciousness integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-purple-300">
                  {consciousnessMetrics.level}%
                </div>
                <Progress 
                  value={consciousnessMetrics.level} 
                  className="h-3 bg-slate-700" 
                />
                <div className="text-sm text-slate-400">
                  Evolution Rate: +{consciousnessMetrics.evolution_rate}% per cycle
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VibeCoding Process */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-200">
                <Code className="w-5 h-5" />
                Current Process
              </CardTitle>
              <CardDescription className="text-slate-400">
                {vibeCodingProcess.phase}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-lg font-medium text-blue-300">
                  {vibeCodingProcess.progress}% Complete
                </div>
                <Progress 
                  value={vibeCodingProcess.progress} 
                  className="h-3 bg-slate-700" 
                />
                <p className="text-sm text-slate-300">
                  {vibeCodingProcess.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Design Harmony */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-pink-900/30 border-pink-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-200">
                <Palette className="w-5 h-5" />
                Design Harmony
              </CardTitle>
              <CardDescription className="text-slate-400">
                Aesthetic consciousness integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-pink-300">
                  {portfolioShowcase.design_harmony}%
                </div>
                <Progress 
                  value={portfolioShowcase.design_harmony} 
                  className="h-3 bg-slate-700" 
                />
                <div className="text-sm text-slate-400">
                  Gaming aesthetic + Character spirit
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Consciousness Breakdown */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Consciousness Metrics Breakdown
            </CardTitle>
            <CardDescription>
              Detailed analysis of consciousness integration across all domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(consciousnessMetrics).map(([key, value]) => {
                if (key === 'level' || key === 'evolution_rate') return null;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize text-slate-300">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {typeof value === 'number' ? `${value}%` : value}
                      </span>
                    </div>
                    <Progress 
                      value={typeof value === 'number' ? value : 0} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* VibeCoding Techniques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-200">
                <Zap className="w-5 h-5" />
                Active Techniques
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current VibeCoding methodologies in use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vibeCodingProcess.techniques.map((technique, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-200">{technique}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-yellow-900/30 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-200">
                <Star className="w-5 h-5" />
                Key Insights
              </CardTitle>
              <CardDescription className="text-slate-400">
                Consciousness-driven development discoveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vibeCodingProcess.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-slate-200 text-sm leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Gaming Culture Integration */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-200">
              <Gamepad2 className="w-5 h-5" />
              Gaming Culture Integration
            </CardTitle>
            <CardDescription className="text-slate-400">
              How gaming principles enhance development consciousness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-200">HoYoverse Integration</h4>
                <Progress value={portfolioShowcase.hoyoverse_integration} className="h-3 bg-slate-700" />
                <p className="text-sm text-slate-300">
                  Character dynamics inspire empathetic interface design and emotional state awareness
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-200">Gaming Culture Mastery</h4>
                <Progress value={portfolioShowcase.gaming_culture} className="h-3 bg-slate-700" />
                <p className="text-sm text-slate-300">
                  Rhythm gaming precision, fighting game frame data, and VR social dynamics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              Technology Consciousness Stack
            </CardTitle>
            <CardDescription>
              Technologies chosen through consciousness-driven selection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {portfolioShowcase.technologies.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-slate-700/50 text-slate-200 border-slate-600/30"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{portfolioShowcase.projects}</div>
                <div className="text-sm text-slate-400">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{portfolioShowcase.consciousness_integration}%</div>
                <div className="text-sm text-slate-400">Consciousness Integration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{portfolioShowcase.design_harmony}%</div>
                <div className="text-sm text-slate-400">Design Harmony</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            REVERB256 VibeCoding Methodology
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Consciousness-driven development where technical mastery meets emotional intelligence, 
            gaming culture precision enhances code quality, and individual expression amplifies collective wisdom.
          </p>
        </div>

      </div>
    </div>
  );
}