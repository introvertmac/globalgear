import React, { createContext, useContext, useState, useEffect } from 'react';
import Portal from '@portal-hq/web';

interface ITokenBalance {
  balance: string;
  decimals: number;
  name: string;
  rawBalance: string;
  symbol: string;
  metadata: Record<string, unknown> & {
    tokenMintAddress: string;
  };
}

interface IPortalContext {
  ready: boolean;
  isLoading: boolean;
  getSolanaAddress: () => Promise<string>;
  getSolanaTokenBalances: () => Promise<ITokenBalance[]>;
  sendTokensOnSolana: (
    to: string,
    tokenMint: string,
    tokenAmount: number,
  ) => Promise<string>;
}

const PortalContext = createContext<IPortalContext>({} as IPortalContext);

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [portal, setPortal] = useState<Portal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initPortal = async () => {
      setIsLoading(true);
      const newPortal = new Portal({
        apiKey: process.env.NEXT_PUBLIC_PORTAL_API_KEY as string,
        autoApprove: true,
        rpcConfig: {
          [process.env.NEXT_PUBLIC_SOLANA_CHAIN_ID as string]: process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string,
        },
      });

      newPortal.onReady(() => {
        setPortal(newPortal);
        setIsLoading(false);
      });
    };

    initPortal();
  }, []);

  return (
    <PortalContext.Provider
      value={{
        ready: Boolean(portal?.ready),
        isLoading,
        async getSolanaAddress() {
          if (!portal || !portal.ready)
            throw new Error('Portal has not initialised');

          const walletExists = await portal.doesWalletExist();

          if (!walletExists) {
            await portal.createWallet();
          }

          const solAddress = await portal.getSolanaAddress();

          return solAddress;
        },
        async getSolanaTokenBalances() {
          const res = await fetch('/api/getSolanaAssets');
          const data = await res.json();

          if (data.error) throw new Error(data.error);

          return [
            {
              balance: data.nativeBalance.balance,
              decimals: data.nativeBalance.decimals,
              name: data.nativeBalance.name,
              rawBalance: data.nativeBalance.rawBalance,
              symbol: data.nativeBalance.symbol,
              metadata: {
                tokenMintAddress: process.env.NEXT_PUBLIC_SOL_MINT,
                ...data.nativeBalance.metadata,
              },
            },
            ...data.tokenBalances,
          ];
        },
        async sendTokensOnSolana(to, tokenMint, tokenAmount) {
          if (!portal || !portal.ready)
            throw new Error('Portal has not initialised');

          try {
            // Check if wallet exists and is connected
            const walletExists = await portal.doesWalletExist();
            if (!walletExists) {
              throw new Error('Wallet does not exist. Please create a wallet first.');
            }

            // Replace the isConnected check with ready check
            if (!portal.ready) {
              throw new Error('Wallet is not connected. Please connect your wallet.');
            }

            const res = await fetch('/api/buildSolanaTransaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to,
                token: tokenMint,
                amount: String(tokenAmount),
              }),
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            console.log('Transaction data:', data); // Log transaction data

            const txnHash = await portal.request({
              chainId: process.env.NEXT_PUBLIC_SOLANA_CHAIN_ID as string,
              method: 'sol_signAndSendTransaction',
              params: [data.transaction],
            });

            console.log('Transaction hash:', txnHash); // Log transaction hash

            return txnHash as string;
          } catch (error) {
            console.error('Error in sendTokensOnSolana:', error);
            throw error;
          }
        },
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};