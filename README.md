# GlobalGear - E-commerce Project powered by Portal API, PYUSD and Solana 

GlobalGear is a modern e-commerce platform built with Next.js, showcasing a collection of branded merchandise. This project demonstrates the integration of blockchain technology for payments using the Portal API, PYUSD stablecoin, and Solana blockchain.

## Features

- **Product Catalog**: Display a grid of products with details and images.
- **Shopping Cart**: Add products to cart, adjust quantities, and remove items.
- **Wallet Integration**: Connect to Portal wallet for Solana-based transactions.
- **Checkout Process**: Secure checkout using PYUSD tokens on the Solana blockchain.
- **Order Confirmation**: View order details and transaction information.
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Portal API (for Solana wallet integration and PYUSD transactions)
- Solana Web3.js
- PYUSD (PayPal USD stablecoin on Solana)
- Airtable (for order management)

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd globalgear
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_PORTAL_API_KEY=[Your Portal API Key]
   NEXT_PUBLIC_SOLANA_CHAIN_ID=[Solana Chain ID]
   NEXT_PUBLIC_SOLANA_RPC_URL=[Solana RPC URL]
   NEXT_PUBLIC_SOL_MINT=[SOL Mint Address]
   NEXT_PUBLIC_PYUSD_MINT=[PYUSD Mint Address]
   AIRTABLE_API_KEY=[Your Airtable API Key]
   AIRTABLE_BASE_ID=[Your Airtable Base ID]
   AIRTABLE_TABLE_NAME=[Your Airtable Table Name]
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `pages/`: Contains Next.js pages and API routes.
- `components/`: Reusable React components.
- `context/`: React context providers for global state management.
- `config/`: Configuration files, including product data and Portal API settings.
- `styles/`: Global styles and Tailwind CSS configuration.
- `public/`: Static assets like images.

## Deployment

The project is ready to be deployed on platforms like Vercel or Netlify. Make sure to set up the environment variables in your deployment platform's settings, including the necessary Portal API, Solana, and PYUSD configurations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).