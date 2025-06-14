const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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