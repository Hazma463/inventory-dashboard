// Field definitions for OCR extraction
export const OCR_FIELDS = {
  orderNo: {
    type: 'string',
    description: 'Order/Invoice/Challan number',
    format: 'Usually starts with INV/CHL/ORD',
    example: 'INV-2024-001'
  },
  orderDate: {
    type: 'string',
    description: 'Date of order/invoice',
    format: 'DD/MM/YYYY',
    example: '15/03/2024'
  },
  customerName: {
    type: 'string',
    description: 'Full name of the customer',
    format: 'Complete name as shown on invoice',
    example: 'John Doe'
  },
  correspondenceAddress: {
    type: 'string',
    description: 'Complete correspondence address',
    format: 'Full address including street, area, etc.',
    example: '123 Main Street, Area 51'
  },
  city: {
    type: 'string',
    description: 'City name',
    format: 'City name only',
    example: 'Mumbai'
  },
  state: {
    type: 'string',
    description: 'State name',
    format: 'State name only',
    example: 'Maharashtra'
  },
  shippingAddress: {
    type: 'string',
    description: 'Complete shipping address',
    format: 'Full shipping address if different from correspondence',
    example: '456 Delivery Street, Area 52'
  },
  itemName: {
    type: 'string',
    description: 'Name of the product/item',
    format: 'Complete product name',
    example: 'Premium Quality Widget'
  },
  hsnCode: {
    type: 'string',
    description: 'HSN code of the item',
    format: '6-8 digit number',
    example: '847130'
  },
  packing: {
    type: 'string',
    description: 'Packing details',
    format: 'Packing information',
    example: 'Box of 10 units'
  },
  quantity: {
    type: 'number',
    description: 'Quantity of items',
    format: 'Numeric value',
    example: 5
  },
  totalQuantity: {
    type: 'number',
    description: 'Total quantity including packing',
    format: 'Numeric value',
    example: 50
  },
  taxPercent: {
    type: 'number',
    description: 'Tax percentage',
    format: 'Numeric value without % symbol',
    example: 18
  },
  taxAmt: {
    type: 'number',
    description: 'Tax amount',
    format: 'Numeric value without currency symbol',
    example: 900
  },
  rate: {
    type: 'number',
    description: 'Rate per unit',
    format: 'Numeric value without currency symbol',
    example: 1000
  },
  amount: {
    type: 'number',
    description: 'Total amount before tax',
    format: 'Numeric value without currency symbol',
    example: 5000
  },
  netPayable: {
    type: 'number',
    description: 'Final amount including tax',
    format: 'Numeric value without currency symbol',
    example: 5900
  }
};

// Extraction rules for the Gemini API
export const EXTRACTION_RULES = [
  'If a field is not found, use an empty string for text fields and 0 for numeric fields',
  'Convert all numeric values to numbers (remove currency symbols, commas)',
  'Clean up addresses by removing extra spaces and newlines',
  'For dates, convert to DD/MM/YYYY format',
  'For amounts, remove currency symbols and convert to numbers',
  'For HSN codes, ensure they are 6-8 digits',
  'For order numbers, preserve the original format',
  'For names and addresses, preserve proper capitalization',
  'For quantities, ensure they are positive numbers'
];

// Generate the prompt for Gemini API
export function generatePrompt(text) {
  const fieldsDescription = Object.entries(OCR_FIELDS)
    .map(([key, field]) => `- ${key}: ${field.type} (${field.description}, format: ${field.format}, example: ${field.example})`)
    .join('\n');

  return `
You are an expert at extracting structured data from invoices and challans. Extract the following information from the provided text and return it as a JSON object.

Required fields and their formats:
${fieldsDescription}

Rules for extraction:
${EXTRACTION_RULES.map(rule => `- ${rule}`).join('\n')}

Text to analyze:
${text}

Return ONLY a valid JSON object with these fields. Do not include any explanations or additional text.
`;
} 