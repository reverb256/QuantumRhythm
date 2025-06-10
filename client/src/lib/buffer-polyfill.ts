/**
 * Browser polyfills for Solana Web3.js compatibility
 * Prevents Vite externalization warnings
 */

// Only run in browser environment
if (typeof window !== 'undefined') {
  // Buffer polyfill for browser
  if (!globalThis.Buffer) {
    const createBuffer = (data: any, encoding?: string) => {
      if (typeof data === 'string') {
        if (encoding === 'hex') {
          const matches = data.match(/.{1,2}/g) || [];
          return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
        }
        if (encoding === 'base64') {
          const binary = atob(data);
          return new Uint8Array(Array.from(binary, c => c.charCodeAt(0)));
        }
        return new TextEncoder().encode(data);
      }
      if (data instanceof ArrayBuffer) return new Uint8Array(data);
      if (Array.isArray(data)) return new Uint8Array(data);
      return new Uint8Array(data);
    };

    globalThis.Buffer = {
      from: createBuffer,
      alloc: (size: number) => new Uint8Array(size),
      concat: (buffers: Uint8Array[]) => {
        const total = buffers.reduce((sum, buf) => sum + buf.length, 0);
        const result = new Uint8Array(total);
        let offset = 0;
        buffers.forEach(buf => {
          result.set(buf, offset);
          offset += buf.length;
        });
        return result;
      }
    } as any;
  }

  // Process polyfill
  if (!globalThis.process) {
    globalThis.process = {
      env: {},
      nextTick: (callback: Function) => setTimeout(callback, 0),
      version: '16.0.0',
      browser: true
    } as any;
  }
}

export {};