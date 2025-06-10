import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletStatus {
  connected: boolean;
  wallet: {
    publicKey: string;
    source: string;
    lastUpdated: number;
  } | null;
  validation: {
    valid: boolean;
    balance: number;
    address: string;
    source: string;
  };
  source: string;
}

export function WalletConnector() {
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: walletStatus, isLoading } = useQuery<WalletStatus>({
    queryKey: ['/api/wallet/status'],
    refetchInterval: 10000,
    staleTime: 5000
  });

  const connectMutation = useMutation({
    mutationFn: async (publicKey: string) => {
      return apiRequest('/api/wallet/connect', {
        method: 'POST',
        body: JSON.stringify({ publicKey, source: 'user_input' })
      });
    },
    onSuccess: () => {
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected to the trading system."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/status'] });
      setWalletAddress('');
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Invalid wallet address format",
        variant: "destructive"
      });
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/wallet/disconnect', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected from the trading system."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/status'] });
    }
  });

  const handleConnect = () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Solana wallet address",
        variant: "destructive"
      });
      return;
    }
    connectMutation.mutate(walletAddress.trim());
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  const formatAddress = (address: string) => {
    if (!address) return 'None';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const getSourceBadge = (source: string) => {
    const colors = {
      'environment': 'bg-blue-500',
      'user_input': 'bg-green-500',
      'web3auth': 'bg-purple-500',
      'phantom': 'bg-orange-500',
      'solflare': 'bg-red-500'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          Loading wallet status...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Configuration
        </CardTitle>
        <CardDescription>
          Configure your Solana wallet for live trading analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletStatus?.connected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Wallet Connected</span>
              </div>
              <Badge className={`${getSourceBadge(walletStatus.wallet?.source || '')} text-white`}>
                {walletStatus.wallet?.source}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">Address:</label>
                <p className="font-mono">{formatAddress(walletStatus.validation.address)}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">Balance:</label>
                <p className="font-semibold">{walletStatus.validation.balance.toFixed(6)} SOL</p>
              </div>
            </div>

            {walletStatus.validation.valid ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                Wallet validated and ready for trading
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                Wallet validation failed
              </div>
            )}

            <Button 
              onClick={handleDisconnect}
              variant="outline"
              disabled={disconnectMutation.isPending}
              className="w-full"
            >
              {disconnectMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect Wallet'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">No wallet connected - using demo mode</span>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="wallet-address" className="text-sm font-medium">
                Solana Wallet Address
              </label>
              <Input
                id="wallet-address"
                placeholder="Enter your Solana wallet public key..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Example: 4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA
              </p>
            </div>

            <Button 
              onClick={handleConnect}
              disabled={connectMutation.isPending || !walletAddress.trim()}
              className="w-full"
            >
              {connectMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}