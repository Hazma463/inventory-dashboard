import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

export async function processDocument(file: any) {
  try {
    // Debug logging for environment variables
    console.log('Environment variables check:');
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
    console.log('GEMINI_API_KEY first 4 chars:', process.env.GEMINI_API_KEY?.substring(0, 4));
    console.log('GEMINI_API_KEY last 4 chars:', process.env.GEMINI_API_KEY?.substring(-4));
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('API')));

    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key is not configured');
      throw new Error('OCR service is not properly configured');
    }

    // Validate API key format
    if (!process.env.GEMINI_API_KEY.startsWith('AI')) {
      console.error('Invalid Gemini API key format');
      throw new Error('OCR service is not properly configured');
    }

    console.log('Initializing Gemini API...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Handle file as Buffer or formidable file object
    let buffer: Buffer;
    let mimeType = 'image/png';
    if (file instanceof Buffer) {
      buffer = file;
    } else if (file?.filepath) {
      console.log('Reading file from path:', file.filepath);
      buffer = fs.readFileSync(file.filepath);
      mimeType = file.mimetype || file.type || mimeType;
      console.log('File read successfully. Mime type:', mimeType);
    } else {
      throw new Error('Invalid file input: No file path or buffer provided');
    }

    console.log('Converting image to base64...');
    const base64Image = buffer.toString('base64');
    console.log('Base64 conversion complete. Length:', base64Image.length);

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent([
      "Extract all relevant information from this invoice image. Return the data in JSON format with these exact fields: Order No, Date, Customer Name, Correspondence Address, City, State, Shipping Address, Item Name, HSN Code, Packaging, Quantity, Total Quantity, Tax %, Tax Amount, Rate, Amount, Net Payable",
      {
        inlineData: {
          mimeType,
          data: base64Image
        }
      }
    ]);

    console.log('Received response from Gemini API');
    const response = await result.response;
    let text = response.text();
    console.log('Raw response text:', text);

    // Clean up markdown formatting if present
    if (text.includes('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('Cleaned response text:', text);
    }

    console.log('Parsing JSON response...');
    const extractedData = JSON.parse(text);
    console.log('Parsed data:', extractedData);

    // Map fields as needed
    const mappedData = {
      orderNo: extractedData["Order No"] || '',
      orderDate: extractedData["Date"] || '',
      customerName: extractedData["Customer Name"] || '',
      correspondenceAddress: extractedData["Correspondence Address"] || '',
      city: extractedData["City"] || '',
      state: extractedData["State"] || '',
      shippingAddress: extractedData["Shipping Address"] || '',
      itemName: extractedData["Item Name"] || '',
      hsnCode: extractedData["HSN Code"] || '',
      packing: extractedData["Packaging"] || '',
      quantity: extractedData["Quantity"] || '',
      totalQuantity: extractedData["Total Quantity"] || '',
      taxPercent: extractedData["Tax %"] || '',
      taxAmt: extractedData["Tax Amount"] || '',
      rate: extractedData["Rate"] || '',
      amount: extractedData["Amount"] || '',
      netPayable: extractedData["Net Payable"] || ''
    };

    console.log('Mapped data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error in processDocument:', error);
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse OCR response: ${error.message}`);
    }
    throw error;
  }
} 