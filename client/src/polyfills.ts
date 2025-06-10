// Browser polyfills for Node.js modules used by Solana Web3.js
(globalThis as any).global = globalThis;
(globalThis as any).process = { env: {}, nextTick: (fn: Function) => setTimeout(fn, 0) };

// Buffer polyfill
if (!(globalThis as any).Buffer) {
  (globalThis as any).Buffer = {
    from(data: any, encoding?: string) {
      if (typeof data === 'string') {
        if (encoding === 'hex') {
          const matches = data.match(/.{1,2}/g) || [];
          return new Uint8Array(matches.map((byte: string) => parseInt(byte, 16)));
        }
        if (encoding === 'base64') {
          const binary = atob(data);
          return new Uint8Array(Array.from(binary, c => c.charCodeAt(0)));
        }
        return new TextEncoder().encode(data);
      }
      return new Uint8Array(data);
    },
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
  };
}