import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function processDocument(file) {
  try {
    if (!file || !file.filepath) {
      throw new Error('Invalid file object');
    }

    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64Image = fileBuffer.toString('base64');

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.mimetype || 'image/jpeg'
      }
    };

    // Generate content
    const result = await model.generateContent([
      "Extract all text and data from this image. Format the response as JSON with the following structure: { text: string, data: { key: value } }",
      imagePart
    ]);

    const response = await result.response;
    const text = response.text();

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(text);
      return parsedResponse;
    } catch (parseError) {
      // If parsing fails, return the raw text
      console.warn('Failed to parse response as JSON:', parseError);
      return {
        text: text,
        data: {}
      };
    }
  } catch (error) {
    console.error('Error in processDocument:', error);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
} 