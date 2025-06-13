import { createTRPCNext } from '@trpc/next';
import { httpLink } from '@trpc/client';
import type { AppRouter } from '../server/routers/_app';
import superjson from 'superjson';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpLink({
          url: `${process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000'}/api/trpc`,
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
  abortOnUnmount: true,
}); 