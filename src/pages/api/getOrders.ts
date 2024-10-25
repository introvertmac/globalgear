import type { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME!)
      .select({
        filterByFormula: `{Wallet Address} = '${walletAddress}'`,
        sort: [{ field: 'Order Date', direction: 'desc' }],
      })
      .all();

    const orders = records.map((record) => ({
      orderId: record.get('Order ID'),
      date: record.get('Order Date'),
      total: record.get('Order Total'),
      items: JSON.parse(record.get('Order Items') as string),
    }));

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}
