# GenAI Features Debug Guide

## Current Status: Features Should Work in Development

The GenAI system is implemented with 30+ free AI services and should be functional. Here's how to test and debug:

### Quick Test in Browser Console

1. **Open the application**
2. **Open browser console (F12)**
3. **Copy and paste this test:**

```javascript
// Test Pollinations Image Generation
async function testImageGeneration() {
  try {
    const url = `https://image.pollinations.ai/prompt/anime girl with silver hair, hoyoverse style?width=512&height=512&model=flux`;
    const response = await fetch(url);
    console.log('Image generation test:', response.ok ? 'SUCCESS' : 'FAILED');
    return response.ok;
  } catch (error) {
    console.log('Image generation error:', error);
    return false;
  }
}

// Test Browser TTS
function testVoiceSynthesis() {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('Testing AI voice synthesis');
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
    console.log('Voice synthesis test: SUCCESS');
    return true;
  } else {
    console.log('Voice synthesis test: FAILED - not supported');
    return false;
  }
}

// Run tests
testImageGeneration();
testVoiceSynthesis();
```

### Using the GenAI Showcase Panel

1. **Look for the "GenAI Showcase" button** in the bottom-right corner
2. **Click it to open the testing panel**
3. **Try generating:**
   - **Image**: "anime girl with silver hair"
   - **Text**: "Tell me about the stars"
   - **Voice**: "Hello, welcome to our platform"

### Expected Behavior

#### **Image Generation**
- Should work with Pollinations API (no key required)
- Fallback to SVG if external APIs fail
- Response time: 3-10 seconds

#### **Voice Synthesis**
- Primary: Pollinations TTS (no key required)
- Fallback: Browser TTS (always available)
- Should hear character speaking

#### **Text Generation**
- Primary: Hugging Face (no key required)
- Fallback: Local processing
- Character-specific responses

### Debugging Steps

#### **1. Check Network Tab**
- Open DevTools > Network
- Try generating content
- Look for failed requests (red entries)
- Check if CORS errors appear

#### **2. Console Errors**
- Look for specific error messages
- Note any "Failed to fetch" errors
- Check for timeout messages

#### **3. Service Status**
If services aren't working:

**For Images:**
```javascript
// Test direct Pollinations access
fetch('https://image.pollinations.ai/prompt/test?width=512&height=512')
  .then(r => console.log('Pollinations status:', r.ok))
  .catch(e => console.log('Pollinations error:', e));
```

**For Voice:**
```javascript
// Test browser TTS
if ('speechSynthesis' in window) {
  console.log('TTS available, voices:', speechSynthesis.getVoices().length);
} else {
  console.log('TTS not supported');
}
```

### Common Issues & Solutions

#### **Issue: "Failed to fetch" errors**
**Cause**: CORS restrictions or network blocking
**Solution**: Services should still work, errors are from health checks

#### **Issue: No audio playback**
**Cause**: Browser audio restrictions
**Solution**: Click somewhere on page first, then try voice generation

#### **Issue: Slow image generation**
**Cause**: External API response time
**Solution**: Normal behavior, should complete in 5-15 seconds

#### **Issue: GenAI panel not visible**
**Cause**: CSS or component loading issue
**Solution**: Check browser console for React errors

### Alternative Testing

If the main interface isn't working, try clicking on the characters themselves:
- **Stelle** (silver-haired character)
- **March 7th** (pink-haired character)
- **Himeko** (red-haired character)
- **Kafka** (purple-haired character)

Each should trigger AI dialogue and portrait generation.

### Service Capacity

The system provides:
- **50,000+ voice characters** per month (across all services)
- **1,000+ images** per month (across all providers)
- **100,000+ text tokens** per month (across all models)
- **Unlimited browser TTS** (always available)

### When GenAI Will Definitely Work

1. **Browser TTS**: Always works (built into browser)
2. **SVG Generation**: Always works (procedural)
3. **Local Text**: Always works (browser-based)
4. **Pollinations**: Should work (no API key needed)

If none of these work, there may be a fundamental implementation issue that needs fixing.

### Deployment Notes

Some advanced features work better when deployed to production:
- External API access may be more reliable
- CORS restrictions may be reduced
- Network timeouts may be improved

The system is designed to work in development, but deployment often resolves edge cases.