import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { processDocument } from '../utils/ocr';

export const ocrRouter = createTRPCRouter({
  processDocument: publicProcedure
    .input(z.object({
      file: z.any(),
    }))
    .mutation(async ({ input }) => {
      try {
        if (!input.file) {
          throw new Error('No file provided');
        }

        // Debug logging for environment variables
        console.log('OCR Router - Environment variables check:');
        console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
        console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
        console.log('GEMINI_API_KEY first 4 chars:', process.env.GEMINI_API_KEY?.substring(0, 4));
        console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('API')));

        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
          console.error('Gemini API key is not configured');
          throw new Error('OCR service is not properly configured');
        }

        // Validate API key format
        if (!process.env.GEMINI_API_KEY.startsWith('AI')) {
          console.error('Invalid Gemini API key format');
          throw new Error('OCR service is not properly configured');
        }

        const result = await processDocument(input.file);
        return result;
      } catch (error) {
        console.error('OCR Router Error:', error);
        throw new Error(error.message || 'Failed to process document');
      }
    }),
}); 