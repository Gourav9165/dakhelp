import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

// Polyfill relative /fonts/* fetch requests in Vitest/jsdom environment
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  if (urlStr.startsWith('/fonts/')) {
    const filename = urlStr.replace('/fonts/', '');
    const fontPath = path.join(process.cwd(), 'public', 'fonts', filename);
    if (fs.existsSync(fontPath)) {
      const buffer = fs.readFileSync(fontPath);
      return new Response(buffer, {
        status: 200,
        headers: { 'Content-Type': 'font/ttf' },
      });
    }
  }
  return originalFetch(input, init);
};
