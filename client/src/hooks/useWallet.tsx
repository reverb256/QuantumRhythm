import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

interface WalletAdapter {
  name: string;
  icon: string;
  url: string;
  readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported';
}

interface ConnectedWallet {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  adapter: WalletAdapter;
}

interface WalletContextType {
  wallet: ConnectedWallet | null;
  wallets: WalletAdapter[];
  connecting: boolean;
  connected: boolean;
  publicKey: PublicKey | null;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  hasWallets: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Detect available Solana wallets
const detectWallets = (): WalletAdapter[] => {
  const wallets: WalletAdapter[] = [];
  
  // Check for Phantom
  if (typeof window !== 'undefined' && (window as any).phantom?.solana) {
    wallets.push({
      name: 'Phantom',
      icon: 'https://phantom.app/img/phantom-icon.png',
      url: 'https://phantom.app',
      readyState: 'Installed'
    });
  }
  
  // Check for Solflare
  if (typeof window !== 'undefined' && (window as any).solflare?.isSolflare) {
    wallets.push({
      name: 'Solflare',
      icon: 'https://solflare.com/img/solflare-icon.png',
      url: 'https://solflare.com',
      readyState: 'Installed'
    });
  }
  
  // Check for Backpack
  if (typeof window !== 'undefined' && (window as any).backpack?.isBackpack) {
    wallets.push({
      name: 'Backpack',
      icon: 'https://backpack.exchange/favicon.ico',
      url: 'https://backpack.exchange',
      readyState: 'Installed'
    });
  }
  
  // Check for Glow
  if (typeof window !== 'undefined' && (window as any).glow) {
    wallets.push({
      name: 'Glow',
      icon: 'https://glow.app/favicon.ico',
      url: 'https://glow.app',
      readyState: 'Installed'
    });
  }
  
  // Check for Slope
  if (typeof window !== 'undefined' && (window as any).Slope) {
    wallets.push({
      name: 'Slope',
      icon: 'https://slope.finance/favicon.ico',
      url: 'https://slope.finance',
      readyState: 'Installed'
    });
  }
  
  return wallets;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [wallets, setWallets] = useState<WalletAdapter[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Detect wallets on component mount
    const detectedWallets = detectWallets();
    setWallets(detectedWallets);
    
    // Listen for wallet installations
    const handleWalletChange = () => {
      setWallets(detectWallets());
    };
    
    window.addEventListener('wallet-standard:app-ready', handleWalletChange);
    
    return () => {
      window.removeEventListener('wallet-standard:app-ready', handleWalletChange);
    };
  }, []);

  const connect = async (walletName: string) => {
    if (connecting) return;
    
    setConnecting(true);
    
    try {
      let walletAdapter: any = null;
      let provider: any = null;
      
      switch (walletName) {
        case 'Phantom':
          provider = (window as any).phantom?.solana;
          break;
        case 'Solflare':
          provider = (window as any).solflare;
          break;
        case 'Backpack':
          provider = (window as any).backpack;
          break;
        case 'Glow':
          provider = (window as any).glow;
          break;
        case 'Slope':
          provider = (window as any).Slope;
          break;
      }
      
      if (!provider) {
        throw new Error(`${walletName} wallet not found`);
      }
      
      // Connect to the wallet
      const response = await provider.connect();
      
      if (!response.publicKey) {
        throw new Error('Failed to connect to wallet');
      }
      
      const publicKey = new PublicKey(response.publicKey.toString());
      
      walletAdapter = wallets.find(w => w.name === walletName);
      
      const connectedWallet: ConnectedWallet = {
        publicKey,
        signTransaction: provider.signTransaction.bind(provider),
        signAllTransactions: provider.signAllTransactions?.bind(provider) || 
          (async (txs: Transaction[]) => {
            const signed = [];
            for (const tx of txs) {
              signed.push(await provider.signTransaction(tx));
            }
            return signed;
          }),
        signMessage: provider.signMessage.bind(provider),
        connect: () => provider.connect(),
        disconnect: () => provider.disconnect(),
        adapter: walletAdapter!
      };
      
      setWallet(connectedWallet);
      setConnected(true);
      
      // Store connection preference
      localStorage.setItem('walletName', walletName);
      localStorage.setItem('walletConnected', 'true');
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
      } catch (error) {
        console.error('Wallet disconnect failed:', error);
      }
    }
    
    setWallet(null);
    setConnected(false);
    
    // Clear stored connection
    localStorage.removeItem('walletName');
    localStorage.removeItem('walletConnected');
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await wallet.signMessage(encodedMessage);
    
    // Convert Uint8Array to base64 without using Buffer
    const base64 = btoa(String.fromCharCode(...signature));
    return base64;
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const storedWalletName = localStorage.getItem('walletName');
    const wasConnected = localStorage.getItem('walletConnected') === 'true';
    
    if (storedWalletName && wasConnected && wallets.length > 0) {
      connect(storedWalletName).catch(() => {
        // Clear invalid stored connection
        localStorage.removeItem('walletName');
        localStorage.removeItem('walletConnected');
      });
    }
  }, [wallets]);

  const value: WalletContextType = {
    wallet,
    wallets,
    connecting,
    connected,
    publicKey: wallet?.publicKey || null,
    connect,
    disconnect,
    signMessage,
    hasWallets: wallets.length > 0
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}