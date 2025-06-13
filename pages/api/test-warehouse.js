// Simple test endpoint to verify data transmission
export default function handler(req, res) {
  console.log('=== TEST ENDPOINT ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Body type:', typeof req.body);
  console.log('Body JSON:', JSON.stringify(req.body));
  console.log('===================');

  if (req.method === 'POST') {
    res.status(200).json({ 
      received: req.body,
      success: true,
      message: 'Data received successfully' 
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 