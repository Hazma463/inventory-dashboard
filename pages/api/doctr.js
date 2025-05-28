import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import formidable from 'formidable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.filepath));

    const response = await fetch(`${API_URL}/process-document`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error processing document:', error);
    return res.status(500).json({ error: 'Error processing document' });
  }
}

// Helper function to parse OCR text blocks
function parseOcrText(blocks) {
  // Convert blocks to text for regex matching
  const text = blocks.map(block => block.text).join('\n');

  // Extract fields using regex patterns
  const extractedData = {
    orderNo: extractField(text, /Order No[.:=\s]+([A-Za-z0-9\-\/]+)/i),
    orderDate: extractField(text, /Order Date[.:=\s]+([0-9\/\-]+)/i),
    customerName: extractField(text, /Customer Name[.:=\s]+([A-Za-z .]+)/i),
    city: extractField(text, /City[.:=\s]+([A-Za-z ]+)/i),
    state: extractField(text, /State[.:=\s]+([A-Za-z ]+)/i),
    shippingAddress: extractField(text, /Shipping Address[.:=\s]+([A-Za-z0-9, .]+)/i),
    itemName: extractField(text, /Item Name[.:=\s]+([A-Za-z0-9, .]+)/i),
    hsnCode: extractField(text, /HSN Code[.:=\s]+([A-Za-z0-9]+)/i),
    packing: extractField(text, /Packing[.:=\s]+([A-Za-z0-9, .]+)/i),
    quantity: extractField(text, /Quantity[.:=\s]+([0-9]+)/i),
    totalQuantity: extractField(text, /Total Quantity[.:=\s]+([0-9]+)/i),
    taxPercent: extractField(text, /Tax Percent[.:=\s]+([0-9.]+)/i),
    taxAmt: extractField(text, /Tax Amount[.:=\s]+([0-9.]+)/i),
    rate: extractField(text, /Rate[.:=\s]+([0-9.]+)/i),
    amount: extractField(text, /Amount[.:=\s]+([0-9.]+)/i),
    netPayable: extractField(text, /Net Payable[.:=\s]+([0-9.]+)/i)
  };

  return extractedData;
}

// Helper function to extract field using regex
function extractField(text, pattern) {
  const match = pattern.exec(text);
  return match ? match[1].trim() : '';
} 