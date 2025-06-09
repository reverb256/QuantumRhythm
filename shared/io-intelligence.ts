import { z } from 'zod';

// IO Intelligence API Configuration
export const IOIntelligenceConfig = {
  baseUrl: 'https://api.intelligence.io.solutions/api/v1',
  modelsEndpoint: '/models',
  chatEndpoint: '/chat/completions',
  agentsEndpoint: '/agents',
};

// Model schema for IO Intelligence
export const IOModelSchema = z.object({
  id: z.string(),
  object: z.literal('model'),
  created: z.number(),
  owned_by: z.string(),
  root: z.string().nullable(),
  parent: z.string().nullable(),
  max_model_len: z.number().nullable(),
  permission: z.array(z.object({
    id: z.string(),
    object: z.literal('model_permission'),
    created: z.number(),
    allow_create_engine: z.boolean(),
    allow_sampling: z.boolean(),
    allow_logprobs: z.boolean(),
    allow_search_indices: z.boolean(),
    allow_view: z.boolean(),
    allow_fine_tuning: z.boolean(),
    organization: z.string(),
    group: z.string().nullable(),
    is_blocking: z.boolean(),
  })),
});

export const IOModelsResponseSchema = z.object({
  object: z.literal('list'),
  data: z.array(IOModelSchema),
});

// Agent schema for IO Intelligence
export const IOAgentSchema = z.object({
  name: z.string(),
  description: z.string(),
  persona: z.string().nullable(),
  metadata: z.object({
    image_url: z.string().nullable(),
    tags: z.array(z.string()),
  }),
});

export const IOAgentsResponseSchema = z.object({
  agents: z.record(z.string(), IOAgentSchema),
});

// Chat completion schemas
export const IOChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export const IOChatCompletionRequestSchema = z.object({
  model: z.string(),
  messages: z.array(IOChatMessageSchema),
  temperature: z.number().optional(),
  max_completion_tokens: z.number().optional(),
  stream: z.boolean().optional(),
  reasoning_content: z.boolean().optional(),
});

export const IOChatCompletionResponseSchema = z.object({
  id: z.string(),
  object: z.literal('chat.completion'),
  created: z.number(),
  model: z.string(),
  choices: z.array(z.object({
    index: z.number(),
    message: z.object({
      role: z.literal('assistant'),
      content: z.string(),
    }),
    logprobs: z.any().nullable(),
    finish_reason: z.string(),
    stop_reason: z.string().nullable(),
  })),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number(),
    completion_tokens: z.number(),
    prompt_tokens_details: z.any().nullable(),
  }),
  prompt_logprobs: z.any().nullable(),
});

// Rate limit schemas
export const RateLimitInfoSchema = z.object({
  model: z.string(),
  dailyQuota: z.number(),
  usedTokens: z.number(),
  remainingTokens: z.number(),
  resetTime: z.string(),
  contextLength: z.number(),
});

// Task execution schemas
export const TaskSchema = z.object({
  id: z.string(),
  type: z.enum(['reasoning', 'summarization', 'sentiment_analysis', 'translation', 'code_generation', 'data_extraction']),
  description: z.string(),
  input: z.string(),
  model: z.string().optional(),
  agent: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'rate_limited']).default('pending'),
  result: z.string().optional(),
  error: z.string().optional(),
  tokens_used: z.number().optional(),
  execution_time: z.number().optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const AgentInsightSchema = z.object({
  insight_type: z.enum(['usage_pattern', 'model_preference', 'task_optimization', 'rate_limit_behavior']),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  data: z.record(z.any()),
  timestamp: z.date().default(() => new Date()),
});

// Multi-agent system schemas
export const AgentCapabilitySchema = z.object({
  agent_id: z.string(),
  capabilities: z.array(z.string()),
  preferred_models: z.array(z.string()),
  success_rate: z.number().min(0).max(1),
  average_tokens: z.number(),
  specializations: z.array(z.string()),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tasks: z.array(z.string()), // Task IDs
  agents: z.array(z.string()), // Agent IDs
  status: z.enum(['pending', 'running', 'completed', 'failed']).default('pending'),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

// Export types
export type IOModel = z.infer<typeof IOModelSchema>;
export type IOModelsResponse = z.infer<typeof IOModelsResponseSchema>;
export type IOAgent = z.infer<typeof IOAgentSchema>;
export type IOAgentsResponse = z.infer<typeof IOAgentsResponseSchema>;
export type IOChatMessage = z.infer<typeof IOChatMessageSchema>;
export type IOChatCompletionRequest = z.infer<typeof IOChatCompletionRequestSchema>;
export type IOChatCompletionResponse = z.infer<typeof IOChatCompletionResponseSchema>;
export type RateLimitInfo = z.infer<typeof RateLimitInfoSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type AgentInsight = z.infer<typeof AgentInsightSchema>;
export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

// Model categorization for intelligent selection
export const ModelCategories = {
  reasoning: [
    'deepseek-ai/DeepSeek-R1-0528',
    'deepseek-ai/DeepSeek-R1',
    'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
    'Qwen/QwQ-32B',
    'netease-youdao/Confucius-o1-14B',
  ],
  coding: [
    'Qwen/Qwen2.5-Coder-32B-Instruct',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    'meta-llama/Llama-3.3-70B-Instruct',
  ],
  general: [
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    'Qwen/Qwen3-235B-A22B-FP8',
    'meta-llama/Llama-3.3-70B-Instruct',
    'mistralai/Mistral-Large-Instruct-2411',
  ],
  math: [
    'nvidia/AceMath-7B-Instruct',
    'microsoft/phi-4',
  ],
  multimodal: [
    'meta-llama/Llama-3.2-90B-Vision-Instruct',
    'Qwen/Qwen2-VL-7B-Instruct',
  ],
  long_context: [
    'jinaai/ReaderLM-v2', // 512k context
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', // 430k context
  ],
  efficient: [
    'microsoft/Phi-3.5-mini-instruct',
    'Qwen/Qwen2.5-1.5B-Instruct',
    'openbmb/MiniCPM3-4B',
  ],
};

// Rate limit management
export const ModelQuotas = {
  'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8': { daily: 500000, context: 430000 },
  'deepseek-ai/DeepSeek-R1-0528': { daily: 500000, context: 128000 },
  'deepseek-ai/DeepSeek-R1-Distill-Llama-70B': { daily: 500000, context: 128000 },
  'Qwen/Qwen3-235B-A22B-FP8': { daily: 500000, context: 128000 },
  'deepseek-ai/DeepSeek-R1': { daily: 500000, context: 128000 },
  'Qwen/QwQ-32B': { daily: 500000, context: 32000 },
  'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B': { daily: 500000, context: 128000 },
  'meta-llama/Llama-3.3-70B-Instruct': { daily: 500000, context: 128000 },
  'databricks/dbrx-instruct': { daily: 500000, context: 32000 },
  'neuralmagic/Llama-3.1-Nemotron-70B-Instruct-HF-FP8-dynamic': { daily: 500000, context: 128000 },
  'microsoft/phi-4': { daily: 500000, context: 16000 },
  'nvidia/AceMath-7B-Instruct': { daily: 500000, context: 4000 },
  'google/gemma-3-27b-it': { daily: 500000, context: 8000 },
  'mistralai/Mistral-Large-Instruct-2411': { daily: 500000, context: 128000 },
  'watt-ai/watt-tool-70B': { daily: 500000, context: 128000 },
  'jinaai/ReaderLM-v2': { daily: 500000, context: 512000 },
  'meta-llama/Llama-3.2-90B-Vision-Instruct': { daily: 500000, context: 16000 },
} as const;