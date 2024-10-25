import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const assetRes = await fetch(
    `https://api.portalhq.io/api/v3/clients/me/chains/${process.env.NEXT_PUBLIC_SOLANA_CHAIN_ID}/assets`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PORTAL_API_KEY}`,
      },
    },
  );

  res.json(await assetRes.json());
  
}