import formidable from 'formidable';
import { processDocument } from '../../server/utils/ocr';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Debug logging for environment variables
  console.log('API Route - Environment variables check:');
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
  console.log('GEMINI_API_KEY first 4 chars:', process.env.GEMINI_API_KEY?.substring(0, 4));
  console.log('GEMINI_API_KEY last 4 chars:', process.env.GEMINI_API_KEY?.substring(-4));
  console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('API')));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ error: 'Error parsing form data', details: err.message });
      }

      const file = files.file;
      if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        console.log('Processing file:', {
          name: file.originalFilename,
          type: file.mimetype,
          size: file.size,
          path: file.filepath
        });

        // Ensure the file exists
        if (!fs.existsSync(file.filepath)) {
          console.error('File does not exist at path:', file.filepath);
          return res.status(500).json({ error: 'File not found', path: file.filepath });
        }

        // Verify file type
        if (!file.mimetype?.startsWith('image/')) {
          console.error('Invalid file type:', file.mimetype);
          return res.status(400).json({ error: 'Invalid file type. Please upload an image file.' });
        }

        // Check if API key is available and valid
        if (!process.env.GEMINI_API_KEY) {
          console.error('Gemini API key is not configured');
          return res.status(500).json({ 
            error: 'OCR service is not properly configured',
            details: 'GEMINI_API_KEY environment variable is missing'
          });
        }

        if (!process.env.GEMINI_API_KEY.startsWith('AI')) {
          console.error('Invalid Gemini API key format');
          return res.status(500).json({ 
            error: 'OCR service is not properly configured',
            details: 'Invalid GEMINI_API_KEY format'
          });
        }

        console.log('Starting document processing...');
        const result = await processDocument(file);
        console.log('OCR Result:', result);
        
        // Clean up the temporary file
        try {
          fs.unlinkSync(file.filepath);
          console.log('Temporary file cleaned up successfully');
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }

        return res.status(200).json(result);
      } catch (error) {
        console.error('Error processing document:', error);
        // Clean up the temporary file in case of error
        try {
          if (file?.filepath && fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up file after error:', cleanupError);
        }
        return res.status(500).json({ 
          error: 'Error processing document',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 