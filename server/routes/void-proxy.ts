/**
 * Void Proxy - OpenAI-compatible endpoint for code editors
 * Multi-modal support with vision and audio capabilities
 */

import express from 'express';

const router = express.Router();

// OpenAI-compatible models endpoint
router.get('/v1/models', async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/ai-autorouter/models`);
    const data = await response.json();
    
    const models = data.success ? data.data.models.map((m: any) => ({
      id: m.name,
      object: 'model',
      created: Date.now(),
      owned_by: 'quantum-autorouter'
    })) : [
      // Real IO Intelligence models
      { id: 'deepseek-r1', object: 'model', created: Date.now(), owned_by: 'io-intelligence' },
      { id: 'qwq-32b-preview', object: 'model', created: Date.now(), owned_by: 'io-intelligence' },
      { id: 'qwen2.5-coder-32b-instruct', object: 'model', created: Date.now(), owned_by: 'io-intelligence' },
      { id: 'llama-3.2-90b-vision-instruct', object: 'model', created: Date.now(), owned_by: 'io-intelligence' },
      { id: 'qwen2-vl-72b-instruct', object: 'model', created: Date.now(), owned_by: 'io-intelligence' },
      { id: 'acemath-7b', object: 'model', created: Date.now(), owned_by: 'io-intelligence' }
    ];

    res.json({ object: 'list', data: models });
  } catch (error) {
    res.json({ 
      object: 'list', 
      data: [
        { id: 'deepseek-r1', object: 'model', created: Date.now(), owned_by: 'io-intelligence' },
        { id: 'qwen2.5-coder-32b-instruct', object: 'model', created: Date.now(), owned_by: 'io-intelligence' }
      ] 
    });
  }
});

// OpenAI-compatible chat completions with multi-modal support
router.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model, max_tokens, temperature, stream } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: { message: 'Messages array is required' }
      });
    }

    const lastMessage = messages[messages.length - 1];
    const systemMessage = messages.find((m: any) => m.role === 'system');
    
    // Handle multi-modal content
    let content = '';
    let hasImage = false;
    let hasAudio = false;
    
    if (Array.isArray(lastMessage.content)) {
      // Multi-modal message
      for (const item of lastMessage.content) {
        if (item.type === 'text') {
          content += item.text + '\n';
        } else if (item.type === 'image_url') {
          hasImage = true;
          content += '[IMAGE_PROVIDED] ';
        } else if (item.type === 'audio') {
          hasAudio = true;
          content += '[AUDIO_PROVIDED] ';
        }
      }
    } else {
      content = lastMessage.content;
    }

    // Analyze content for optimal routing
    const contentType = analyzeContentType(content, hasImage, hasAudio);
    const intent = analyzeIntent(content);
    
    // Route to quantum autorouter with multi-modal support
    const autorouterPayload = {
      content,
      contentType,
      intent,
      priority: 'medium',
      context: systemMessage?.content,
      maxTokens: max_tokens || 1000,
      temperature: temperature || 0.7,
      agentId: 'void-proxy',
      multiModal: {
        hasImage,
        hasAudio,
        originalContent: lastMessage.content
      }
    };

    console.log(`[VOID-PROXY] Multi-modal ${intent} request: ${contentType} (img:${hasImage}, audio:${hasAudio})`);

    const response = await fetch(`${req.protocol}://${req.get('host')}/api/ai-autorouter/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Void-Proxy/2.0-MultiModal'
      },
      body: JSON.stringify(autorouterPayload)
    });

    if (!response.ok) {
      throw new Error(`Autorouter failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Routing failed: ${data.error}`);
    }

    // Handle streaming response
    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      // Stream the response
      const chunks = data.data.content.split(' ');
      for (let i = 0; i < chunks.length; i++) {
        const chunk = {
          id: `chatcmpl-${Date.now()}-${i}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: data.data.model || 'quantum-autorouter',
          choices: [{
            index: 0,
            delta: i === 0 ? 
              { role: 'assistant', content: chunks[i] + ' ' } : 
              { content: chunks[i] + ' ' },
            finish_reason: i === chunks.length - 1 ? 'stop' : null
          }]
        };
        
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      // Regular response
      const openaiResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: data.data.model || 'quantum-autorouter',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.data.content
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: data.metadata?.tokensUsed?.prompt || estimateTokens(content),
          completion_tokens: data.metadata?.tokensUsed?.completion || estimateTokens(data.data.content),
          total_tokens: data.metadata?.tokensUsed?.total || estimateTokens(content + data.data.content)
        }
      };

      console.log(`[VOID-PROXY] ✅ Multi-modal routed to ${data.data.model} (${data.metadata?.processingTime}ms)`);
      res.json(openaiResponse);
    }

  } catch (error) {
    console.error('[VOID-PROXY] Error:', error.message);
    
    // Fallback response
    res.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'fallback',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: generateFallbackResponse(req.body.messages[req.body.messages.length - 1].content)
        },
        finish_reason: 'stop'
      }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    });
  }
});

// Multi-modal vision endpoint
router.post('/v1/vision/analyze', async (req, res) => {
  try {
    const { image, prompt, model } = req.body;
    
    const autorouterPayload = {
      content: prompt || 'Analyze this image in detail',
      contentType: 'vision',
      intent: 'analyze',
      priority: 'medium',
      maxTokens: 1000,
      agentId: 'void-vision',
      multiModal: {
        hasImage: true,
        imageData: image
      }
    };

    const response = await fetch(`${req.protocol}://${req.get('host')}/api/ai-autorouter/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autorouterPayload)
    });

    const data = await response.json();
    res.json({ analysis: data.data?.content || 'Unable to analyze image' });
  } catch (error) {
    res.status(500).json({ error: 'Vision analysis failed' });
  }
});

// Audio transcription endpoint
router.post('/v1/audio/transcriptions', async (req, res) => {
  try {
    const { file, model } = req.body;
    
    const autorouterPayload = {
      content: 'Transcribe this audio',
      contentType: 'audio',
      intent: 'transcribe',
      priority: 'medium',
      maxTokens: 1000,
      agentId: 'void-audio',
      multiModal: {
        hasAudio: true,
        audioData: file
      }
    };

    const response = await fetch(`${req.protocol}://${req.get('host')}/api/ai-autorouter/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autorouterPayload)
    });

    const data = await response.json();
    res.json({ text: data.data?.content || 'Unable to transcribe audio' });
  } catch (error) {
    res.status(500).json({ error: 'Audio transcription failed' });
  }
});

function analyzeContentType(content: string, hasImage: boolean, hasAudio: boolean): string {
  if (hasImage) return 'vision';
  if (hasAudio) return 'audio';
  
  const lower = content.toLowerCase();
  if (lower.includes('code') || lower.includes('function') || lower.includes('debug')) return 'code';
  if (lower.includes('math') || lower.includes('calculate') || lower.includes('equation')) return 'math';
  if (lower.includes('analyze') || lower.includes('analysis')) return 'analysis';
  if (lower.includes('reason') || lower.includes('logic') || lower.includes('think')) return 'reasoning';
  if (lower.includes('creative') || lower.includes('write') || lower.includes('story')) return 'creative';
  if (lower.includes('technical') || lower.includes('architecture')) return 'technical';
  return 'text';
}

function analyzeIntent(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('analyze') || lower.includes('examine')) return 'analyze';
  if (lower.includes('summarize') || lower.includes('summary')) return 'summarize';
  if (lower.includes('debug') || lower.includes('fix') || lower.includes('error')) return 'debug';
  if (lower.includes('optimize') || lower.includes('improve')) return 'optimize';
  if (lower.includes('explain') || lower.includes('how')) return 'explain';
  if (lower.includes('translate') || lower.includes('convert')) return 'translate';
  if (lower.includes('transcribe') || lower.includes('audio')) return 'transcribe';
  if (lower.includes('describe') || lower.includes('image')) return 'describe';
  return 'generate';
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

function generateFallbackResponse(content: any): string {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const lower = text.toLowerCase();
  
  if (lower.includes('code')) {
    return 'I can help with code analysis and development. Please provide more specific details about what you need assistance with.';
  }
  if (lower.includes('debug')) {
    return 'To debug effectively: 1) Check error messages, 2) Verify recent changes, 3) Use logging tools, 4) Test with minimal examples.';
  }
  if (lower.includes('image')) {
    return 'I can analyze images when they are provided. Please upload an image and describe what you need to know about it.';
  }
  return 'I understand your request. Could you provide more context or specific details to help me assist you better?';
}

export default router;