import type { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    orderDetails, 
    txnHash,
    walletAddress
  } = req.body;

  try {
    const recordData = {
      'Order ID': `ORDER-${Date.now()}`,
      'Customer Name': orderDetails.shippingAddress.fullName,
      'Email': orderDetails.email,
      'Street Address': orderDetails.shippingAddress.street,
      'City': orderDetails.shippingAddress.city,
      'State': orderDetails.shippingAddress.state,
      'Zip Code': orderDetails.shippingAddress.zipCode,
      'Country': orderDetails.shippingAddress.country,
      'Order Total': orderDetails.total,
      'Transaction Hash': txnHash,
      'Order Date': formatDate(new Date()),
      'Order Items': JSON.stringify(orderDetails.items),
      'Wallet Address': walletAddress,
    };

    console.log('Record data being sent to Airtable:', recordData);

    const record = await base(process.env.AIRTABLE_TABLE_NAME!).create([
      {
        fields: recordData,
      },
    ]);

    res.status(200).json({ message: 'Order submitted successfully', record });
  } catch (error) {
    console.error('Error submitting order to Airtable:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    res.status(500).json({ 
      message: 'Error submitting order', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
  
}