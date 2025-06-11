/**
 * Web3 Authentication Provider
 * Handles multi-chain wallet connections for Solana, Cronos, and BNB Chain
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

interface ChainConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const CHAIN_CONFIGS: { [key: string]: ChainConfig } = {
  cronos: {
    chainId: '0x19', // 25 in decimal
    chainName: 'Cronos Mainnet',
    nativeCurrency: {
      name: 'Cronos',
      symbol: 'CRO',
      decimals: 18,
    },
    rpcUrls: ['https://evm.cronos.org'],
    blockExplorerUrls: ['https://cronoscan.com/'],
  },
  bnb: {
    chainId: '0x38', // 56 in decimal
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
};

interface Web3AuthContextType {
  // Solana
  solanaWallet: string | null;
  solanaConnected: boolean;
  connectSolana: () => Promise<void>;
  disconnectSolana: () => void;
  
  // EVM (Cronos/BNB)
  evmWallet: string | null;
  evmConnected: boolean;
  currentChain: string | null;
  connectEVM: (chain: 'cronos' | 'bnb') => Promise<void>;
  switchChain: (chain: 'cronos' | 'bnb') => Promise<void>;
  disconnectEVM: () => void;
  
  // Trading permissions
  tradingEnabled: boolean;
  enableTrading: () => void;
  disableTrading: () => void;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  // Solana state
  const [solanaWallet, setSolanaWallet] = useState<string | null>(null);
  const [solanaConnected, setSolanaConnected] = useState(false);
  
  // EVM state
  const [evmWallet, setEvmWallet] = useState<string | null>(null);
  const [evmConnected, setEvmConnected] = useState(false);
  const [currentChain, setCurrentChain] = useState<string | null>(null);
  
  // Trading state
  const [tradingEnabled, setTradingEnabled] = useState(false);

  // Check for existing connections on mount
  useEffect(() => {
    checkExistingConnections();
  }, []);

  async function checkExistingConnections() {
    // Check Solana connection
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          setSolanaWallet(response.publicKey.toString());
          setSolanaConnected(true);
          console.log('🟣 Solana wallet auto-connected');
        }
      } catch (error) {
        console.log('No existing Solana connection');
      }
    }

    // Check EVM connection
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setEvmWallet(accounts[0]);
          setEvmConnected(true);
          
          // Get current chain
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const chain = Object.keys(CHAIN_CONFIGS).find(
            key => CHAIN_CONFIGS[key].chainId === chainId
          );
          setCurrentChain(chain || null);
          console.log('🔶 EVM wallet auto-connected');
        }
      } catch (error) {
        console.log('No existing EVM connection');
      }
    }
  }

  async function connectSolana() {
    if (!window.solana) {
      alert('Please install Phantom wallet to connect to Solana');
      return;
    }

    try {
      const response = await window.solana.connect();
      setSolanaWallet(response.publicKey.toString());
      setSolanaConnected(true);
      console.log('✅ Solana wallet connected:', response.publicKey.toString());
      
      // Notify trading system
      await notifyTradingSystem('solana_connected', {
        wallet: response.publicKey.toString(),
        chain: 'solana'
      });
      
    } catch (error) {
      console.error('Failed to connect Solana wallet:', error);
      alert('Failed to connect Solana wallet');
    }
  }

  function disconnectSolana() {
    if (window.solana) {
      window.solana.disconnect();
    }
    setSolanaWallet(null);
    setSolanaConnected(false);
    console.log('🔌 Solana wallet disconnected');
  }

  async function connectEVM(chain: 'cronos' | 'bnb') {
    if (!window.ethereum) {
      alert('Please install MetaMask to connect to EVM chains');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setEvmWallet(accounts[0]);
        setEvmConnected(true);
        
        // Switch to requested chain
        await switchChain(chain);
        
        console.log(`✅ ${chain.toUpperCase()} wallet connected:`, accounts[0]);
        
        // Notify trading system
        await notifyTradingSystem('evm_connected', {
          wallet: accounts[0],
          chain: chain
        });
      }
    } catch (error) {
      console.error(`Failed to connect ${chain} wallet:`, error);
      alert(`Failed to connect ${chain} wallet`);
    }
  }

  async function switchChain(chain: 'cronos' | 'bnb') {
    if (!window.ethereum) return;

    const chainConfig = CHAIN_CONFIGS[chain];
    
    try {
      // Try to switch to the chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.chainId }],
      });
      
      setCurrentChain(chain);
      console.log(`🔄 Switched to ${chain.toUpperCase()}`);
      
    } catch (switchError: any) {
      // Chain not added to wallet, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig],
          });
          
          setCurrentChain(chain);
          console.log(`➕ Added and switched to ${chain.toUpperCase()}`);
          
        } catch (addError) {
          console.error(`Failed to add ${chain} chain:`, addError);
          alert(`Failed to add ${chain} chain to wallet`);
        }
      } else {
        console.error(`Failed to switch to ${chain}:`, switchError);
        alert(`Failed to switch to ${chain}`);
      }
    }
  }

  function disconnectEVM() {
    setEvmWallet(null);
    setEvmConnected(false);
    setCurrentChain(null);
    console.log('🔌 EVM wallet disconnected');
  }

  function enableTrading() {
    setTradingEnabled(true);
    console.log('🚀 Trading enabled');
    
    // Notify trading system
    notifyTradingSystem('trading_enabled', {
      timestamp: new Date().toISOString(),
      chains: [
        solanaConnected ? 'solana' : null,
        evmConnected ? currentChain : null
      ].filter(Boolean)
    });
  }

  function disableTrading() {
    setTradingEnabled(false);
    console.log('🛑 Trading disabled');
    
    // Notify trading system
    notifyTradingSystem('trading_disabled', {
      timestamp: new Date().toISOString()
    });
  }

  async function notifyTradingSystem(event: string, data: any) {
    try {
      await fetch('/api/trading/auth-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to notify trading system:', error);
    }
  }

  // Listen for account/chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectEVM();
        } else if (accounts[0] !== evmWallet) {
          setEvmWallet(accounts[0]);
          console.log('🔄 EVM account changed:', accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        const chain = Object.keys(CHAIN_CONFIGS).find(
          key => CHAIN_CONFIGS[key].chainId === chainId
        );
        setCurrentChain(chain || null);
        console.log('🔄 Chain changed:', chain || chainId);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [evmWallet]);

  const value: Web3AuthContextType = {
    // Solana
    solanaWallet,
    solanaConnected,
    connectSolana,
    disconnectSolana,
    
    // EVM
    evmWallet,
    evmConnected,
    currentChain,
    connectEVM,
    switchChain,
    disconnectEVM,
    
    // Trading
    tradingEnabled,
    enableTrading,
    disableTrading,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
}