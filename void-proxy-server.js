const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Universal OpenAI-Compatible Providers
const PROVIDERS = [
  {
    name: 'huggingface',
    baseURL: 'https://api-inference.huggingface.co',
    authHeader: 'Authorization',
    authValue: process.env.HF_TOKEN ? `Bearer ${process.env.HF_TOKEN}` : null,
    models: ['microsoft/DialoGPT-large', 'gpt2', 'microsoft/GODEL-v1_1-large-seq2seq']
  },
  {
    name: 'together',
    baseURL: 'https://api.together.xyz/v1',
    authHeader: 'Authorization',
    authValue: process.env.TOGETHER_API_KEY ? `Bearer ${process.env.TOGETHER_API_KEY}` : null,
    models: ['meta-llama/Llama-3.3-70B-Instruct', 'mistralai/Mixtral-8x7B-Instruct-v0.1']
  },
  {
    name: 'fireworks',
    baseURL: 'https://api.fireworks.ai/inference/v1',
    authHeader: 'Authorization',
    authValue: process.env.FIREWORKS_API_KEY ? `Bearer ${process.env.FIREWORKS_API_KEY}` : null,
    models: ['accounts/fireworks/models/llama-v3p3-70b-instruct']
  },
  {
    name: 'groq',
    baseURL: 'https://api.groq.com/openai/v1',
    authHeader: 'Authorization',
    authValue: process.env.GROQ_API_KEY ? `Bearer ${process.env.GROQ_API_KEY}` : null,
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768']
  },
  {
    name: 'anyscale',
    baseURL: 'https://api.endpoints.anyscale.com/v1',
    authHeader: 'Authorization',
    authValue: process.env.ANYSCALE_API_KEY ? `Bearer ${process.env.ANYSCALE_API_KEY}` : null,
    models: ['meta-llama/Llama-3-70b-chat-hf']
  },
  {
    name: 'replicate',
    baseURL: 'https://api.replicate.com/v1',
    authHeader: 'Authorization',
    authValue: process.env.REPLICATE_API_TOKEN ? `Token ${process.env.REPLICATE_API_TOKEN}` : null,
    models: ['meta/llama-2-70b-chat']
  },
  {
    name: 'perplexity',
    baseURL: 'https://api.perplexity.ai',
    authHeader: 'Authorization',
    authValue: process.env.PERPLEXITY_API_KEY ? `Bearer ${process.env.PERPLEXITY_API_KEY}` : null,
    models: ['llama-3.1-sonar-large-128k-online']
  },
  {
    name: 'mistral',
    baseURL: 'https://api.mistral.ai/v1',
    authHeader: 'Authorization',
    authValue: process.env.MISTRAL_API_KEY ? `Bearer ${process.env.MISTRAL_API_KEY}` : null,
    models: ['mistral-large-latest', 'mistral-medium-latest']
  },
  {
    name: 'cohere',
    baseURL: 'https://api.cohere.ai/v1',
    authHeader: 'Authorization',
    authValue: process.env.COHERE_API_KEY ? `Bearer ${process.env.COHERE_API_KEY}` : null,
    models: ['command-r-plus', 'command-r']
  },
  {
    name: 'local_vllm',
    baseURL: 'http://127.0.0.1:8000/v1',
    authHeader: null,
    authValue: null,
    models: ['auto'] // VLLM auto-detects loaded models
  },
  {
    name: 'ollama',
    baseURL: 'http://127.0.0.1:11434/v1',
    authHeader: null,
    authValue: null,
    models: ['llama3.3:70b', 'mixtral:8x7b', 'qwen2.5:72b']
  },
  {
    name: 'lm_studio',
    baseURL: 'http://127.0.0.1:1234/v1',
    authHeader: null,
    authValue: null,
    models: ['auto'] // LM Studio serves whatever model is loaded
  },
  {
    name: 'localai',
    baseURL: 'http://127.0.0.1:8080/v1',
    authHeader: null,
    authValue: null,
    models: ['auto'] // LocalAI serves configured models
  }
]

// AI Autorouter endpoint for Void IDE integration
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model } = req.body;

    // Route to your consciousness AI system
    const response = await fetch('http://0.0.0.0:5173/api/ai-autorouter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'AI routing failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Void-Replit bridge active', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔗 Void-Replit bridge running on port ${PORT}`);
  console.log(`🤖 AI services accessible via http://0.0.0.0:${PORT}/v1/chat/completions`);
});