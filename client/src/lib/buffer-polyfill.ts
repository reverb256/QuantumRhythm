/**
 * Buffer Polyfill for Browser Compatibility
 * Resolves Vite externalization warnings for Solana Web3.js
 */

// Create a global Buffer polyfill using built-in browser APIs
if (typeof window !== 'undefined' && typeof (window as any).Buffer === 'undefined') {
  // Simple Buffer polyfill that maintains compatibility
  const BufferPolyfill = {
    from(data: any, encoding?: string): Uint8Array {
      if (typeof data === 'string') {
        if (encoding === 'hex') {
          const matches = data.match(/.{1,2}/g) || [];
          const bytes = matches.map(byte => parseInt(byte, 16));
          return new Uint8Array(bytes);
        } else if (encoding === 'base64') {
          const binary = atob(data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return bytes;
        } else {
          // Default to UTF-8
          const encoder = new TextEncoder();
          return encoder.encode(data);
        }
      } else if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
      } else if (Array.isArray(data)) {
        return new Uint8Array(data);
      }
      return new Uint8Array(data);
    },

    alloc(size: number): Uint8Array {
      return new Uint8Array(size);
    },

    concat(buffers: Uint8Array[]): Uint8Array {
      const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of buffers) {
        result.set(buf, offset);
        offset += buf.length;
      }
      return result;
    }
  };

  // Assign to global
  (window as any).Buffer = BufferPolyfill;
  (globalThis as any).Buffer = BufferPolyfill;
}

export {};