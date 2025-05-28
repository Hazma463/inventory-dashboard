import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';
import { createTRPCContext } from '../../../server/trpc';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  batching: {
    enabled: true,
  },
  onError({ error, req, path, input, type, ctx }) {
    console.error('🔴 tRPC Server Error:', {
      error,
      message: error.message,
      code: error.code,
      stack: error.stack,
      path,
      type,
      input,
      headers: req.headers,
      method: req.method,
      url: req.url,
    });
  },
  responseMeta({ ctx, paths, type, errors, data }) {
    console.log('🟢 tRPC Response Meta:', {
      paths,
      type,
      errors,
      data,
      headers: ctx?.req?.headers,
    });
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': 'true',
      },
    };
  },
}); 