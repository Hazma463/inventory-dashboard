import { createTRPCRouter } from '../trpc';
import { inventoryRouter } from './inventory';
import { ocrRouter } from './ocr';

export const appRouter = createTRPCRouter({
  inventory: inventoryRouter,
  ocr: ocrRouter,
});

export type AppRouter = typeof appRouter; 