/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 

function parseOcrTextToFields(text) {
  // Normalize text
  const cleanText = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');

  // Header fields
  const orderNo = /Order No[.:=\s]+([A-Za-z0-9\-\/]+)/i.exec(cleanText)?.[1] || '';
  const orderDate = /Order Date[.:=\s]+([0-9\/\-]+)/i.exec(cleanText)?.[1] || '';
  const customerName = /Customer Name[.:=\s]+([A-Za-z .]+)/i.exec(cleanText)?.[1] || '';
  const city = /City[.:=\s]+([A-Za-z ]+)/i.exec(cleanText)?.[1] || '';
  const state = /State[.:=\s]+([A-Za-z ]+)/i.exec(cleanText)?.[1] || '';
  const shippingAddress = /Shipping Address[.:=\s]+([A-Za-z0-9, .]+)/i.exec(cleanText)?.[1] || '';
  const netPayable = /Net Payable[.:=\s]+([0-9,.]+)/i.exec(cleanText)?.[1] || '';

  // Try to extract the first product row (very basic, adjust as needed)
  const productRow = cleanText.split('\n').find(line => /eco|material|cool/i.test(line));
  let itemName = '', hsnCode = '', packing = '', quantity = '', totalQuantity = '', taxPercent = '', taxAmt = '', rate = '', amount = '';
  if (productRow) {
    // Try to split by | or spaces
    const cols = productRow.split('|').map(s => s.trim()).filter(Boolean);
    if (cols.length >= 8) {
      itemName = cols[1] || '';
      hsnCode = cols[2] || '';
      packing = cols[3] || '';
      quantity = cols[4] || '';
      totalQuantity = cols[5] || '';
      taxPercent = cols[6] || '';
      taxAmt = cols[7] || '';
      rate = cols[8] || '';
      amount = cols[9] || '';
    }
  }

  return {
    orderNo: orderNo || '',
    orderDate: orderDate || '',
    customerName: customerName || '',
    city: city || '',
    state: state || '',
    shippingAddress: shippingAddress || '',
    itemName: itemName || '',
    hsnCode: hsnCode || '',
    packing: packing || '',
    quantity: quantity || '',
    totalQuantity: totalQuantity || '',
    taxPercent: taxPercent || '',
    taxAmt: taxAmt || '',
    rate: rate || '',
    amount: amount || '',
    netPayable: netPayable || '',
  };
} 