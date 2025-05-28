export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Parsed Data from client:', req.body);
    res.status(200).json({ message: 'Logged to terminal!' });
  } else {
    res.status(405).end();
  }
} 