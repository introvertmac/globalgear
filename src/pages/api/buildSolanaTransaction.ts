import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, token, amount } = req.body;

  if (!to || !token || !amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  try {
    const response = await fetch(
      `https://api.portalhq.io/api/v3/clients/me/chains/${process.env.NEXT_PUBLIC_SOLANA_CHAIN_ID}/assets/send/build-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PORTAL_API_KEY}`,
        },
        body: JSON.stringify({
          to,
          token,
          amount,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to build transaction');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error building transaction:', error);
    res.status(500).json({ 
      message: 'Error building transaction', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}