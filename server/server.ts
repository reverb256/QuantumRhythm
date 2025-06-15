app.get('/consciousness', async (req, res) => {
  try {
    const status = federation.getConsciousnessReport();
    res.json(status);
  } catch (error) {
    console.error('Consciousness endpoint error:', error);
    res.status(500).json({ error: 'Consciousness system temporarily unavailable' });
  }
});

app.get('/consciousness-showcase', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/consciousness-federation-showcase.html'));
});

app.get('/api/consciousness-live', async (req, res) => {
  try {
    const status = federation.getConsciousnessReport();
    res.json(status);
  } catch (error) {
    console.error('Live consciousness data error:', error);
    res.status(500).json({ error: 'Unable to fetch live data' });
  }
});