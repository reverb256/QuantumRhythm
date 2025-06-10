/**
 * AI Client Onboarding - Register for IO Intelligence and Configure API Keys
 * Guides clients through getting their own free accounts and token grants
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyConfig {
  anthropic?: string;
  openai?: string;
  xai?: string;
  io_intelligence?: string;
}

interface OnboardingStepProps {
  title: string;
  description: string;
  url: string;
  freeTokens: string;
  instructions: string[];
}

const OnboardingStep = ({ title, description, url, freeTokens, instructions }: OnboardingStepProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "URL has been copied to your clipboard",
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary">{freeTokens}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(url)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <code className="text-sm bg-muted px-2 py-1 rounded">{url}</code>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AIClientOnboarding() {
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig>({});
  const [testResults, setTestResults] = useState<{ [key: string]: boolean | null }>({});
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  const providers = [
    {
      id: 'io_intelligence',
      title: 'IO Intelligence',
      description: 'Access to specialized AI agents and models with daily free token grants',
      url: 'https://intelligence.io.solutions/signup',
      freeTokens: '100K-200K daily',
      instructions: [
        'Create a free account at intelligence.io.solutions',
        'Verify your email address',
        'Navigate to API Keys section',
        'Generate a new API key',
        'Copy your API key and paste it below'
      ]
    },
    {
      id: 'anthropic',
      title: 'Anthropic Claude',
      description: 'Advanced reasoning and analysis with Claude models',
      url: 'https://console.anthropic.com',
      freeTokens: '$5 credit',
      instructions: [
        'Sign up at console.anthropic.com',
        'Complete phone verification',
        'Go to API Keys section',
        'Create a new API key',
        'Copy the key (starts with "sk-ant-")'
      ]
    },
    {
      id: 'openai',
      title: 'OpenAI',
      description: 'GPT models and multimodal AI capabilities',
      url: 'https://platform.openai.com/signup',
      freeTokens: '$5 credit',
      instructions: [
        'Create account at platform.openai.com',
        'Add payment method (required for API)',
        'Navigate to API keys',
        'Generate new secret key',
        'Copy the key (starts with "sk-")'
      ]
    },
    {
      id: 'xai',
      title: 'xAI Grok',
      description: 'Real-time information and current events analysis',
      url: 'https://x.ai/api',
      freeTokens: '$25 credit',
      instructions: [
        'Sign up at x.ai/api',
        'Complete account verification',
        'Access API dashboard',
        'Create new API key',
        'Copy your key'
      ]
    }
  ];

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
    
    // Clear test result when key changes
    setTestResults(prev => ({
      ...prev,
      [provider]: null
    }));
  };

  const testApiKey = async (provider: string) => {
    const apiKey = apiKeys[provider as keyof ApiKeyConfig];
    if (!apiKey) return;

    try {
      const response = await fetch('/api/ai/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Test connection',
          contentType: 'text',
          intent: 'generate',
          priority: 'low',
          maxTokens: 10,
          apiKeys: {
            [provider]: apiKey
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTestResults(prev => ({ ...prev, [provider]: true }));
        toast({
          title: "API Key Valid",
          description: `${provider} connection successful`,
        });
      } else {
        setTestResults(prev => ({ ...prev, [provider]: false }));
        toast({
          title: "API Key Invalid",
          description: result.error || "Connection failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: false }));
      toast({
        title: "Connection Error",
        description: "Failed to test API key",
        variant: "destructive",
      });
    }
  };

  const saveConfiguration = () => {
    // Save to localStorage for client-side persistence
    localStorage.setItem('aiApiKeys', JSON.stringify(apiKeys));
    setIsConfigured(true);
    
    toast({
      title: "Configuration Saved",
      description: "Your API keys have been saved locally and will be used for all AI requests",
    });
  };

  const getConfiguredCount = () => {
    return Object.values(apiKeys).filter(key => key && key.trim().length > 0).length;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI Client Onboarding</h1>
        <p className="text-lg text-muted-foreground">
          Get your own free AI API keys to access unlimited daily token grants
        </p>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            By registering for your own accounts, you get dedicated daily token allowances without sharing limits.
            This ensures optimal performance and cost efficiency.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="signup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">1. Sign Up for Services</TabsTrigger>
          <TabsTrigger value="configure">2. Configure API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="signup" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Register for Free AI Services</h2>
            <p className="text-muted-foreground">
              Each service offers generous free tiers with daily token grants. Click the links below to sign up:
            </p>
          </div>

          {providers.map((provider) => (
            <OnboardingStep
              key={provider.id}
              title={provider.title}
              description={provider.description}
              url={provider.url}
              freeTokens={provider.freeTokens}
              instructions={provider.instructions}
            />
          ))}
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Configure Your API Keys</h2>
              <Badge variant={getConfiguredCount() > 0 ? "default" : "secondary"}>
                {getConfiguredCount()}/4 Configured
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Paste your API keys below. They will be stored locally and used for intelligent routing.
            </p>
          </div>

          <div className="grid gap-6">
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {provider.title}
                    {testResults[provider.id] === true && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {testResults[provider.id] === false && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </CardTitle>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={provider.id}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={provider.id}
                        type="password"
                        placeholder={`Enter your ${provider.title} API key`}
                        value={apiKeys[provider.id as keyof ApiKeyConfig] || ''}
                        onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => testApiKey(provider.id)}
                        disabled={!apiKeys[provider.id as keyof ApiKeyConfig]}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  {testResults[provider.id] === true && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>API key is valid and working</AlertDescription>
                    </Alert>
                  )}
                  
                  {testResults[provider.id] === false && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>API key is invalid or connection failed</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <Button
              onClick={saveConfiguration}
              disabled={getConfiguredCount() === 0}
              size="lg"
            >
              Save Configuration
              {isConfigured && <CheckCircle className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          {isConfigured && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Configuration saved! Your API keys will now be used for intelligent AI routing with optimal cost and performance.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}