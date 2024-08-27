import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post(
      'https://api.portalhq.io/api/v1/custodians/clients',
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.PORTAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { clientSessionToken, id: clientId } = response.data;

    // You might want to store the clientId in your database associated with the user
    // For now, we'll just return both the token and the ID
    res.status(200).json({ clientSessionToken, clientId });
  } catch (error) {
    console.error('Error creating client session:', error);
    res.status(500).json({ message: 'Error creating client session' });
  }
}