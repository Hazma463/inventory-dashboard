import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { prisma } from './prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export const createTRPCContext = async (opts: { req: NextApiRequest; res: NextApiResponse }) => {
  console.log('Creating tRPC context with request:', {
    method: opts.req.method,
    url: opts.req.url,
    headers: opts.req.headers,
  });
  
  return {
    prisma,
    req: opts.req,
    res: opts.res,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    console.error('tRPC Error:', {
      code: shape.code,
      message: shape.message,
      data: shape.data,
      error: error,
    });
    
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure; 