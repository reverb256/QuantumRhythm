import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Brain, Zap, Shield, Cpu } from 'lucide-react';
import { useIOIntelligence } from '../lib/io-intelligence';

interface AITaskResult {
  id: string;
  type: string;
  description: string;
  input: string;
  result?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  tokensUsed?: number;
  executionTime?: number;
}

export default function AIIntegrationDemo() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<AITaskResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const ioIntelligence = useIOIntelligence();

  const demoTasks = [
    {
      type: 'reasoning',
      title: 'AI Reasoning',
      description: 'Complex problem solving with step-by-step logic',
      icon: Brain,
      color: 'bg-purple-500',
      example: 'Analyze the trade-offs between different software architectures for a high-traffic web application.'
    },
    {
      type: 'summarization',
      title: 'Content Summarization',
      description: 'Extract key insights from long content',
      icon: Zap,
      color: 'bg-blue-500',
      example: 'Summarize the key principles of the VibeCoding methodology and how it applies to software development.'
    },
    {
      type: 'sentiment_analysis',
      title: 'Sentiment Analysis',
      description: 'Understand emotional tone and user satisfaction',
      icon: Shield,
      color: 'bg-green-500',
      example: 'Analyze the sentiment of user feedback: "This portfolio showcases incredible attention to detail and innovative thinking."'
    },
    {
      type: 'code_generation',
      title: 'Code Generation',
      description: 'Generate optimized code with best practices',
      icon: Cpu,
      color: 'bg-orange-500',
      example: 'Generate a TypeScript function that implements rate limiting with exponential backoff.'
    }
  ];

  const executeTask = async (taskType: string, description: string, inputText: string) => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: AITaskResult = {
      id: taskId,
      type: taskType,
      description,
      input: inputText,
      status: 'running'
    };

    setResults(prev => [newTask, ...prev]);

    try {
      const startTime = Date.now();
      const response = await ioIntelligence.executeTask(
        taskType as any,
        description,
        inputText,
        'medium'
      );
      
      const executionTime = Date.now() - startTime;

      setResults(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              status: 'completed' as const,
              result: response.task.result,
              tokensUsed: response.task.tokensUsed,
              executionTime: executionTime
            }
          : task
      ));
    } catch (error) {
      console.error('AI task failed:', error);
      setResults(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              status: 'failed' as const,
              result: error instanceof Error ? error.message : 'Unknown error occurred'
            }
          : task
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (example: string) => {
    setInput(example);
  };

  return (
    <section id="ai-demo" className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          AI Integration Demo
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience the power of IO Intelligence multi-agent system with VibeCoding methodology. 
          Each AI task is optimized for reliability, precision, and user satisfaction.
        </p>
      </motion.div>

      {/* Task Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoTasks.map((task, index) => {
          const Icon = task.icon;
          return (
            <motion.div
              key={task.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
                    onClick={() => loadExample(task.example)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${task.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-white">{task.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs text-gray-400">
                    {task.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Input Section */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI Task Input</CardTitle>
          <CardDescription>
            Enter your task description or click on a demo card above to load an example.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you'd like the AI to help with..."
            className="min-h-[100px] bg-gray-800 border-gray-600 text-white"
          />
          
          <div className="flex flex-wrap gap-2">
            {demoTasks.map((task) => (
              <Button
                key={task.type}
                onClick={() => executeTask(task.type, task.title, input)}
                disabled={!input.trim() || isLoading}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400"
              >
                {isLoading && results[0]?.type === task.type ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <task.icon className="w-4 h-4 mr-2" />
                )}
                {task.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">AI Task Results</h3>
          
          <div className="space-y-4">
            {results.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          result.status === 'completed' ? 'default' :
                          result.status === 'failed' ? 'destructive' :
                          'secondary'
                        }>
                          {result.status}
                        </Badge>
                        <CardTitle className="text-white text-lg">{result.description}</CardTitle>
                      </div>
                      
                      {result.status === 'completed' && (
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          {result.tokensUsed && (
                            <span>Tokens: {result.tokensUsed}</span>
                          )}
                          {result.executionTime && (
                            <span>Time: {result.executionTime}ms</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Input:</h4>
                      <p className="text-gray-400 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                        {result.input}
                      </p>
                    </div>
                    
                    {result.status === 'running' && (
                      <div className="flex items-center space-x-2 text-cyan-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Processing with AI agents...</span>
                      </div>
                    )}
                    
                    {result.result && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">AI Response:</h4>
                        <div className="text-gray-300 text-sm bg-gray-800/50 p-4 rounded border border-gray-600 whitespace-pre-wrap">
                          {result.result}
                        </div>
                      </div>
                    )}
                    
                    {result.status === 'failed' && (
                      <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-700">
                        Error: {result.result}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* VibeCoding Methodology Info */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">VibeCoding AI Methodology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-purple-400">Pizza Kitchen Reliability:</strong>
              <p>AI responses with same consistency as Friday night order delivery</p>
            </div>
            <div>
              <strong className="text-blue-400">Rhythm Gaming Precision:</strong>
              <p>Microsecond-accurate response timing from gaming mastery</p>
            </div>
            <div>
              <strong className="text-green-400">VRChat Research Insights:</strong>
              <p>8,500+ hours of social VR research informing AI interaction design</p>
            </div>
            <div>
              <strong className="text-orange-400">Classical Philosophy:</strong>
              <p>Virtue ethics and Stoic principles guiding AI decision-making</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}