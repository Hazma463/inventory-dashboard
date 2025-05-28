import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from './prisma';

export async function createContext(opts: CreateNextContextOptions) {
  return {
    prisma,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>; 