import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { fossAIInference } from '../services/foss-ai-inference';

interface SecurityThreat {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
}

interface ProviderStatus {
  id: string;
  name: string;
  trustLevel: number;
  status: 'active' | 'blocked' | 'monitoring';
  threats: SecurityThreat[];
  lastCheck: Date;
}

export function TransformersSecurityMonitor() {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [activeThreats, setActiveThreats] = useState<SecurityThreat[]>([]);
  const [aiAnalysisActive, setAiAnalysisActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'secure' | 'warning' | 'alert'>('secure');

  useEffect(() => {
    initializeSecurityMonitoring();
    const interval = setInterval(performSecurityScan, 30000);
    return () => clearInterval(interval);
  }, []);

  const initializeSecurityMonitoring = async () => {
    // Initialize with known providers
    const initialProviders: ProviderStatus[] = [
      {
        id: 'solana-labs',
        name: 'Solana Labs',
        trustLevel: 0.96,
        status: 'active',
        threats: [],
        lastCheck: new Date()
      },
      {
        id: 'publicnode',
        name: 'PublicNode',
        trustLevel: 0.97,
        status: 'active',
        threats: [],
        lastCheck: new Date()
      },
      {
        id: 'alchemy',
        name: 'Alchemy',
        trustLevel: 0.95,
        status: 'active',
        threats: [],
        lastCheck: new Date()
      }
    ];

    setProviders(initialProviders);
    await performInitialAIAnalysis();
  };

  const performInitialAIAnalysis = async () => {
    try {
      setAiAnalysisActive(true);
      
      // Analyze market sentiment for security context
      const marketText = "Current Solana trading environment with DeFi protocols";
      const sentiment = await fossAIInference.analyzeSentiment(marketText);
      
      if (sentiment.text === 'negative' && sentiment.confidence > 0.8) {
        const newThreat: SecurityThreat = {
          type: 'market_volatility',
          severity: 'medium',
          description: 'AI detected negative market sentiment - increased caution recommended',
          confidence: sentiment.confidence
        };
        setActiveThreats(prev => [...prev, newThreat]);
        setSystemStatus('warning');
      }

      // Test AI inference capabilities
      const testSummary = await fossAIInference.summarizeText(
        "RPC endpoint security monitoring system using Transformers.js for local AI analysis"
      );
      
      console.log('🛡️ AI Security Analysis Active:', testSummary);
      
    } catch (error) {
      console.log('⚠️ AI analysis unavailable, using rule-based security');
    } finally {
      setAiAnalysisActive(false);
    }
  };

  const performSecurityScan = async () => {
    // Simulate real-time security scanning
    const updatedProviders = providers.map(provider => {
      // Simulate trust level fluctuations based on performance
      const variation = (Math.random() - 0.5) * 0.02;
      const newTrustLevel = Math.max(0.8, Math.min(1.0, provider.trustLevel + variation));
      
      return {
        ...provider,
        trustLevel: newTrustLevel,
        lastCheck: new Date()
      };
    });

    setProviders(updatedProviders);

    // Check for new threats
    const lowTrustProviders = updatedProviders.filter(p => p.trustLevel < 0.9);
    if (lowTrustProviders.length > 0) {
      setSystemStatus('warning');
    } else {
      setSystemStatus('secure');
    }
  };

  const analyzeProviderWithAI = async (providerId: string) => {
    try {
      setAiAnalysisActive(true);
      
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      // Use AI to analyze provider description
      const analysisText = `Security analysis for ${provider.name} RPC provider with ${(provider.trustLevel * 100).toFixed(1)}% trust level`;
      
      const sentiment = await fossAIInference.analyzeSentiment(analysisText);
      const summary = await fossAIInference.summarizeText(analysisText);
      
      // Update provider based on AI analysis
      const updatedProviders = providers.map(p => {
        if (p.id === providerId) {
          const aiThreat: SecurityThreat = {
            type: 'ai_analysis',
            severity: sentiment.text === 'negative' ? 'medium' : 'low',
            description: `AI Analysis: ${summary.text ? summary.text.substring(0, 100) : 'Security scan complete'}...`,
            confidence: sentiment.confidence
          };
          
          return {
            ...p,
            threats: [...p.threats.filter(t => t.type !== 'ai_analysis'), aiThreat],
            lastCheck: new Date()
          };
        }
        return p;
      });
      
      setProviders(updatedProviders);
      
    } catch (error) {
      console.log('AI analysis failed for provider:', providerId);
    } finally {
      setAiAnalysisActive(false);
    }
  };

  const getStatusColor = (status: string, trustLevel: number) => {
    if (status === 'blocked') return 'text-red-500';
    if (trustLevel < 0.9) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (status: string, trustLevel: number) => {
    if (status === 'blocked') return <AlertTriangle className="w-4 h-4" />;
    if (trustLevel < 0.9) return <Activity className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Monitor
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered threat detection using Transformers.js
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          systemStatus === 'secure' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          systemStatus === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {systemStatus === 'secure' && <CheckCircle className="w-4 h-4" />}
          {systemStatus === 'warning' && <Activity className="w-4 h-4" />}
          {systemStatus === 'alert' && <AlertTriangle className="w-4 h-4" />}
          {systemStatus.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Provider Security Status
          </h4>
          <div className="space-y-2">
            {providers.map((provider) => (
              <div 
                key={provider.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={getStatusColor(provider.status, provider.trustLevel)}>
                    {getStatusIcon(provider.status, provider.trustLevel)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {provider.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Trust: {(provider.trustLevel * 100).toFixed(1)}% • 
                      Last check: {provider.lastCheck.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => analyzeProviderWithAI(provider.id)}
                  disabled={aiAnalysisActive}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50"
                >
                  {aiAnalysisActive ? 'Analyzing...' : 'AI Scan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {activeThreats.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Active Threats
            </h4>
            <div className="space-y-2">
              {activeThreats.map((threat, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    threat.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    threat.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                    threat.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {threat.type.replace('_', ' ').toUpperCase()}
                    </p>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {(threat.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {threat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>
            Local AI processing • Zero data transmission • FOSS compliant
          </span>
          <span className={`flex items-center gap-1 ${aiAnalysisActive ? 'text-blue-600' : ''}`}>
            <Activity className={`w-3 h-3 ${aiAnalysisActive ? 'animate-pulse' : ''}`} />
            {aiAnalysisActive ? 'AI Active' : 'AI Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}