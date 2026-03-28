import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // 1. Prioritize Rork-specific env var (includes the /p/<projectId> prefix)
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('[tRPC] Using Rork env base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // 2. Optional local/dev override
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log('[tRPC] Using env base URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // 3. Web fallback: use a RELATIVE url.
  // Using window.location.origin drops the /p/<projectId> path and can lead to "Access Denied" HTML.
  if (typeof window !== 'undefined') {
    console.log('[tRPC] Using relative base URL on web');
    return '';
  }

  console.log('[tRPC] No base URL available, using empty string');
  return '';
};

const getFinalUrl = () => {
  let url = getBaseUrl();

  if (!url) {
    // Relative fetch (works for web + when backend is proxied under the app path)
    return '/api/trpc';
  }

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
        const urlString =
          typeof url === 'string'
            ? url
            : url instanceof URL
              ? url.toString()
              : (url as Request | undefined)?.url ?? String(url);

        console.log('[tRPC] Fetching:', urlString);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const attemptFetch = async (targetUrl: string) => {
          const resp = await fetch(targetUrl, {
            ...options,
            signal: controller.signal,
          });
          console.log('[tRPC] Response status for', targetUrl, ':', resp.status);
          return resp;
        };

        try {
          let response = await attemptFetch(urlString);

          const contentType = response.headers.get('content-type') || '';
          console.log('[tRPC] Response content-type:', contentType);

          const isHtml = contentType.includes('text/html');

          // If we got an HTML "Access Denied" / 404 page, try the alternate mount path.
          if (isHtml || !response.ok) {
            const text = await response.clone().text();
            console.error('[tRPC] Unexpected response (HTML or non-2xx):', response.status, text.substring(0, 200));

            const apiSegment = '/api/trpc';
            if (urlString.includes(apiSegment)) {
              const fallbackUrl = urlString.replace(apiSegment, '/trpc');
              console.log('[tRPC] Attempting fallback URL:', fallbackUrl);
              response = await attemptFetch(fallbackUrl);

              const fallbackType = response.headers.get('content-type') || '';
              const fallbackIsHtml = fallbackType.includes('text/html');
              if (fallbackIsHtml || !response.ok) {
                const fallbackText = await response.clone().text();
                console.error('[tRPC] Fallback also returned unexpected response:', response.status, fallbackText.substring(0, 200));
                throw new Error('Received HTML response - check that backend is running and URL is correct');
              }
            } else {
              throw new Error('Received HTML response - check that backend is running and URL is correct');
            }
          }

          clearTimeout(timeoutId);
          return response;
        } catch (error: any) {
          clearTimeout(timeoutId);
          if (error?.name === 'AbortError') {
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
