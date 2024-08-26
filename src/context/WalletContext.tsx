import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Portal from '@portal-hq/web';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string;
  isLoading: boolean;
  isCreatingWallet: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portal, setPortal] = useState<Portal | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const refreshBalance = useCallback(async (portalInstance: Portal, addr: string, retries = 3) => {
    try {
      const response = await fetch('/api/getSolanaAssets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const pyusdBalance = data.tokenBalances.find((token: any) => token.symbol === 'PYUSD');
      if (pyusdBalance) {
        setBalance(pyusdBalance.balance);
      } else {
        console.warn('PYUSD balance not found in the response');
        setBalance('0');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => refreshBalance(portalInstance, addr, retries - 1), 2000);
      } else {
        console.error('Max retries reached. Unable to fetch balance.');
        setBalance('Error');
      }
    }
  }, []);

  const checkWalletStatus = useCallback(async (portalInstance: Portal) => {
    try {
      const walletExists = await portalInstance.doesWalletExist();
      if (walletExists) {
        const addr = await portalInstance.getSolanaAddress();
        setAddress(addr);
        setIsConnected(true);
        await refreshBalance(portalInstance, addr);
      }
    } catch (error) {
      console.error('Error checking wallet status:', error);
    }
  }, [refreshBalance]);

  useEffect(() => {
    const initPortal = async () => {
      setIsLoading(true);
      const newPortal = new Portal({
        apiKey: process.env.NEXT_PUBLIC_PORTAL_API_KEY as string,
        autoApprove: true,
        rpcConfig: {
          [process.env.NEXT_PUBLIC_SOLANA_CHAIN_ID as string]: process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string,
        },
        host: 'https://globalgear.manishlabs.xyz/'
      });

      newPortal.onReady(async () => {
        setPortal(newPortal);
        await checkWalletStatus(newPortal);
        setIsLoading(false);
      });
    };

    initPortal();
  }, [checkWalletStatus]);

  const connect = async () => {
    if (portal) {
      try {
        setIsLoading(true);
        const walletExists = await portal.doesWalletExist();
        if (walletExists) {
          const addr = await portal.getSolanaAddress();
          setAddress(addr);
          setIsConnected(true);
          await refreshBalance(portal, addr);
        } else {
          setIsCreatingWallet(true);
          await portal.createWallet();
          const addr = await portal.getSolanaAddress();
          setAddress(addr);
          setIsConnected(true);
          await refreshBalance(portal, addr);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsLoading(false);
        setIsCreatingWallet(false);
      }
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      isLoading,
      isCreatingWallet,
      connect,
      disconnect,
      refreshBalance: async () => {
        if (portal && address) {
          setIsLoading(true);
          await refreshBalance(portal, address);
          setIsLoading(false);
        }
      },
    }}>
      {children}
    </WalletContext.Provider>
  );
};