import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';

const app = new Hono();

console.log('[Backend] Starting Hono server...');

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-trpc-source'],
  credentials: true,
}));

app.use('*', async (c, next) => {
  console.log('[Hono] Request:', c.req.method, c.req.path);
  await next();
});

app.get('/', (c) => {
  console.log('[Hono] Root endpoint hit');
  return c.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (c) => {
  console.log('[Hono] Health check hit');
  return c.json({
    status: 'ok',
    message: 'Health check passed',
    timestamp: new Date().toISOString(),
  });
});

// Also support /api/health just in case
app.get('/api/health', (c) => {
  console.log('[Hono] API Health check hit');
  return c.json({
    status: 'ok',
    message: 'API Health check passed',
    timestamp: new Date().toISOString(),
  });
});

// Mount tRPC at /trpc (standard)
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
    endpoint: '/trpc',
    onError({ error, path: procPath }) {
      console.error('[tRPC Error] (/trpc)', procPath, error.message);
    },
  }),
);

// Mount tRPC at /api/trpc (fallback for unstripped proxy)
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
    endpoint: '/api/trpc',
    onError({ error, path: procPath }) {
      console.error('[tRPC Error] (/api/trpc)', procPath, error.message);
    },
  }),
);

app.notFound((c) => {
  console.log('[Hono] 404:', c.req.path);
  return c.json(
    {
      status: 'error',
      message: 'Route not found',
      path: c.req.path,
    },
    404,
  );
});

console.log('[Backend] Hono server configured with tRPC');

export default app;
