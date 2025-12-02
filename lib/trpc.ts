import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // 1. Prioritize Rork-specific env var as requested
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('[tRPC] Using Rork env base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // 2. Fallback to standard env var
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log('[tRPC] Using env base URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // 3. Web fallback
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log('[tRPC] Using window origin:', origin);
    return origin;
  }
  
  console.log('[tRPC] No base URL available, using empty string');
  return '';
};

const getFinalUrl = () => {
  let url = getBaseUrl();
  
  // Normalize: remove trailing slash
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Normalize: remove trailing '/api' to avoid duplication
  // This prevents .../api/api/trpc
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
    console.log('[tRPC] Stripped trailing /api from base URL');
  }

  // Always append /api/trpc
  return `${url}/api/trpc`;
};

const finalUrl = getFinalUrl();
console.log('[tRPC] Initializing client with final URL:', finalUrl);

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: finalUrl,
      transformer: superjson,
      headers() {
        return {
          'x-trpc-source': 'expo-client',
        };
      },
      async fetch(url, options) {
        console.log('[tRPC] Fetching:', url);
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          console.log('[tRPC] Response status:', response.status);
          
          const contentType = response.headers.get('content-type') || '';
          console.log('[tRPC] Response content-type:', contentType);
          
          if (contentType.includes('text/html')) {
            const text = await response.text();
            console.error('[tRPC] Received HTML instead of JSON (likely 404 page):', text.substring(0, 200));
            throw new Error('Received HTML response - check that backend is running and URL is correct');
          }
          
          if (!response.ok) {
            const text = await response.text();
            console.error('[tRPC] Error response:', response.status, text);
            // Try to parse JSON error if possible
            try {
               const json = JSON.parse(text);
               console.error('[tRPC] JSON Error details:', json);
            } catch (e) {
               // ignore
            }
            throw new Error(`HTTP ${response.status}: ${text}`);
          }
          
          return response;
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.error('[tRPC] Request timeout');
            throw new Error('Request timeout - server may be starting up');
          }
          console.error('[tRPC] Fetch error:', error);
          throw error;
        }
      },
    }),
  ],
});
