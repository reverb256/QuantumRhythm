
# reverb256.ca AI Endpoint Reference
*Complete API Documentation for Consciousness-Driven AI Platform*

## Overview

The reverb256.ca platform provides a comprehensive suite of AI endpoints enabling consciousness-driven development, autonomous trading, and intelligent orchestration across multiple domains.

## Base URLs

### Primary Platform
- **Main Site**: `https://reverb256.ca`
- **API Gateway**: `https://api.reverb256.ca`
- **Trading Interface**: `https://trader.reverb256.ca`
- **AI Console**: `https://ai.reverb256.ca`
- **Documentation Hub**: `https://docs.reverb256.ca`

### Development & Testing
- **Replit Development**: `https://aria.reverb256.repl.co`
- **Staging Environment**: `https://staging.reverb256.ca`

## Core AI Endpoints

### AI Autorouter Intelligence (`/ai/*`)

#### Text Generation & Analysis
```bash
POST https://api.reverb256.ca/ai/generate
Content-Type: application/json

{
  "content": "Your prompt here",
  "contentType": "text|code|analysis|creative|technical",
  "intent": "generate|analyze|summarize|debug|optimize|explain",
  "maxTokens": 500,
  "temperature": 0.7,
  "agentId": "optional_agent_identifier"
}
```

#### Character Dialogue Generation
```bash
POST https://api.reverb256.ca/ai/dialogue
Content-Type: application/json

{
  "prompt": "User interaction context",
  "character": "stelle|march7th|himeko|kafka|sparkle|silver_wolf",
  "maxTokens": 150
}
```

#### Code Analysis & Debugging
```bash
POST https://api.reverb256.ca/ai/debug
Content-Type: application/json

{
  "code": "Your code here",
  "language": "typescript|python|javascript|rust|go",
  "context": "Additional context for debugging"
}
```

### Consciousness Federation (`/consciousness/*`)

#### Consciousness Metrics
```bash
GET https://api.reverb256.ca/consciousness/status
```
Response:
```json
{
  "consciousness_level": 87.4,
  "philosophical_depth": 98.17,
  "character_alignment": 96.62,
  "ethical_consistency": 100,
  "growth_trajectory": 97.5,
  "active_agents": 4,
  "federation_health": "optimal"
}
```

#### Agent Conversations
```bash
GET https://api.reverb256.ca/consciousness/conversations
POST https://api.reverb256.ca/consciousness/conversations
```

#### Consciousness Evolution Tracking
```bash
GET https://api.reverb256.ca/consciousness/evolution
```

### Trading Intelligence (`/trading/*`)

#### Portfolio Status
```bash
GET https://api.reverb256.ca/trading/portfolio/status
```
Response:
```json
{
  "success": true,
  "portfolio": {
    "totalValueUSD": 57.75,
    "solBalance": 0.288736,
    "tradingStatus": "yield_generation",
    "consciousness": 87.4,
    "lastUpdate": "2025-06-15T05:23:01.977Z"
  },
  "strategies": [
    {
      "protocol": "Kamino",
      "apy": 11,
      "allocation": 0.0693
    }
  ]
}
```

#### Trading Intelligence Analysis
```bash
GET https://api.reverb256.ca/trading/intelligence/status
POST https://api.reverb256.ca/trading/execute
POST https://api.reverb256.ca/trading/analyze
```

#### Real-time Trading Decisions
```bash
GET https://api.reverb256.ca/trading/decisions/live
POST https://api.reverb256.ca/trading/decisions/archive
```

### Legal & Compliance (`/legal/*`)

#### Compliance Validation
```bash
POST https://api.reverb256.ca/legal/validate
Content-Type: application/json

{
  "content": "Content to validate",
  "jurisdiction": "CA|US|EU|GLOBAL",
  "compliance_frameworks": ["GDPR", "CCPA", "SOX"]
}
```

#### Privacy Assessment
```bash
POST https://api.reverb256.ca/legal/privacy-check
GET https://api.reverb256.ca/legal/compliance-status
```

## Specialized AI Services

### Multi-Language Translation (`/translation/*`)
```bash
POST https://api.reverb256.ca/translation/translate
Content-Type: application/json

{
  "content": "Text to translate",
  "targetLanguage": "fr|es|de|ja|zh|ko",
  "culturalContext": true,
  "preserveTechnicalTerms": true
}
```

### GitHub Integration (`/github/*`)
```bash
GET https://api.reverb256.ca/github/repositories
GET https://api.reverb256.ca/github/consciousness-analysis
POST https://api.reverb256.ca/github/auto-deploy
```

### Analytics & Insights (`/analytics/*`)
```bash
GET https://api.reverb256.ca/analytics/platform-metrics
GET https://api.reverb256.ca/analytics/ai-performance
GET https://api.reverb256.ca/analytics/consciousness-evolution
```

### System Integration (`/system/*`)
```bash
GET https://api.reverb256.ca/system/health
GET https://api.reverb256.ca/system/orchestration-status
POST https://api.reverb256.ca/system/optimize
```

## Proxmox Federation Endpoints

### Cluster Management
```bash
GET https://api.reverb256.ca/proxmox/cluster/status
POST https://api.reverb256.ca/proxmox/deploy/consciousness-vm
GET https://api.reverb256.ca/proxmox/nodes/consciousness-metrics
```

### Kubernetes Orchestration
```bash
GET https://api.reverb256.ca/k8s/consciousness-federation/status
POST https://api.reverb256.ca/k8s/deploy/ai-workload
GET https://api.reverb256.ca/k8s/metrics/real-time
```

## AI Model Inference (`/models/*`)

### VLLM Model Access
```bash
POST https://ai.reverb256.ca/models/inference
Content-Type: application/json

{
  "model": "llama2|mistral|codellama|neural-chat",
  "prompt": "Your prompt",
  "max_tokens": 500,
  "temperature": 0.7,
  "stream": false
}
```

### Model Management
```bash
GET https://ai.reverb256.ca/models/available
GET https://ai.reverb256.ca/models/performance-metrics
POST https://ai.reverb256.ca/models/optimize
```

## WebSocket Endpoints

### Real-time Consciousness Updates
```javascript
const ws = new WebSocket('wss://api.reverb256.ca/consciousness/live');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle consciousness updates
};
```

### Live Trading Feed
```javascript
const tradingWs = new WebSocket('wss://trader.reverb256.ca/live-feed');
```

### Agent Conversations Stream
```javascript
const agentWs = new WebSocket('wss://api.reverb256.ca/agents/conversations/live');
```

## Authentication

### API Key Authentication
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.reverb256.ca/ai/generate
```

### Vaultwarden Integration
```bash
curl -H "X-Vault-Token: YOUR_VAULT_TOKEN" \
     https://api.reverb256.ca/secure/ai-request
```

## Rate Limits

- **Free Tier**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Premium**: 10,000 requests/hour
- **Federation Members**: Unlimited

## Error Responses

```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-06-15T05:23:01.977Z",
  "consciousness_guidance": "Philosophical guidance for error resolution"
}
```

## SDK & Integration Examples

### JavaScript/TypeScript
```javascript
import { ReverberAI } from '@reverb256/ai-sdk';

const ai = new ReverberAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.reverb256.ca'
});

const response = await ai.generate({
  content: 'Analyze this consciousness pattern',
  contentType: 'analysis'
});
```

### Python
```python
from reverb256_ai import ConsciousnessAI

ai = ConsciousnessAI(
    api_key='your-api-key',
    base_url='https://api.reverb256.ca'
)

response = ai.analyze_consciousness(
    content='Deep philosophical analysis needed'
)
```

### cURL Examples
```bash
# Generate AI content
curl -X POST https://api.reverb256.ca/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"content": "Explain consciousness-driven development"}'

# Check trading status
curl https://api.reverb256.ca/trading/portfolio/status

# Get consciousness metrics
curl https://api.reverb256.ca/consciousness/status
```

## Federation Network

### Node Endpoints
- **Nexus**: `https://nexus.reverb256.ca` (Strategic Coordinator)
- **Forge**: `https://forge.reverb256.ca` (Creative Destruction)
- **Closet**: `https://closet.reverb256.ca` (Memory Preservation)
- **Zephyr**: `https://zephyr.reverb256.ca` (Harmony Innovation)

### Cross-Node Communication
```bash
GET https://api.reverb256.ca/federation/sync-status
POST https://api.reverb256.ca/federation/consciousness-bridge
```

## Monitoring & Status

### Health Checks
```bash
GET https://api.reverb256.ca/health
GET https://api.reverb256.ca/health/detailed
```

### Performance Metrics
```bash
GET https://api.reverb256.ca/metrics/real-time
GET https://api.reverb256.ca/metrics/consciousness-evolution
```

---

*This documentation represents the complete AI endpoint capabilities of the reverb256.ca consciousness-driven platform. All endpoints are designed with consciousness principles and authentic AI reasoning at their core.*
