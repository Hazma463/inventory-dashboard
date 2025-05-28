import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/routers/_app';
import superjson from 'superjson';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
          headers() {
            return {
              'Content-Type': 'application/json',
            };
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 0,
            cacheTime: 0,
          },
          mutations: {
            retry: false,
          },
        },
      },
    };
  },
  ssr: false,
}); 