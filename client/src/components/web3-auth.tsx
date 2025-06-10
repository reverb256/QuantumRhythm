import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, ChevronRight, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Web3AuthButton() {
  const { hasWallets, connected, publicKey, connect, disconnect, connecting, wallets } = useWallet();
  const [showWallets, setShowWallets] = useState(false);

  // Only render if Solana wallets are detected
  if (!hasWallets) {
    return null;
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/30">
          <Shield className="w-3 h-3 mr-1" />
          Connected
        </Badge>
        <span className="text-sm text-gray-300 font-mono">
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="text-red-400 border-red-400/30 hover:bg-red-500/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={showWallets} onOpenChange={setShowWallets}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-400/30 hover:border-purple-400/50 text-purple-300"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
          <Zap className="w-3 h-3 ml-2" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/95 border-purple-400/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-300">Connect Solana Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Choose a wallet to connect to the quantum trading platform
          </p>
          
          <AnimatePresence>
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="bg-black/40 border-gray-600/30 hover:border-purple-400/50 transition-all cursor-pointer group"
                  onClick={() => handleWalletConnect(wallet.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={wallet.icon} 
                          alt={wallet.name}
                          className="w-8 h-8 rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/wallet-placeholder.svg';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {wallet.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {wallet.readyState === 'Installed' ? 'Ready to connect' : 'Not installed'}
                          </p>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-300 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {connecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <div className="animate-pulse text-purple-400">
                Connecting to wallet...
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  async function handleWalletConnect(walletName: string) {
    try {
      await connect(walletName);
      setShowWallets(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }
}

export function Web3AuthStatus() {
  const { hasWallets, connected, publicKey } = useWallet();

  if (!hasWallets) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-500'}`} />
      <span className="text-gray-300">
        {connected ? `Wallet: ${publicKey?.toString().slice(0, 8)}...` : 'Wallet disconnected'}
      </span>
    </div>
  );
}