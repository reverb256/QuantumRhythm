/**
 * Trading Interface Page
 * Multi-chain trading dashboard with Web3 authentication and live AI communication
 */

import React from 'react';
import { useWeb3Auth } from '@/components/Web3AuthProvider';
import { TradingCommunicationHub } from '@/components/TradingCommunicationHub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TradingInterface() {
  const {
    solanaConnected,
    evmConnected,
    currentChain,
    tradingEnabled,
    connectSolana,
    connectEVM,
    switchChain,
    disconnectSolana,
    disconnectEVM
  } = useWeb3Auth();

  const isConnected = solanaConnected || evmConnected;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Multi-Chain Trading Interface
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallets and communicate with the autonomous AI trading system
          </p>
        </div>

        {/* Connection Status Alert */}
        {!isConnected && (
          <Alert className="mb-6">
            <AlertDescription>
              Connect at least one wallet to start communicating with the trading AI and monitor cross-chain opportunities.
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Solana Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  Solana
                </span>
                <Badge variant={solanaConnected ? 'default' : 'secondary'}>
                  {solanaConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Connect to access SOL DeFi opportunities, staking, and yield farming
              </p>
              {solanaConnected ? (
                <Button onClick={disconnectSolana} variant="outline" className="w-full">
                  Disconnect Phantom
                </Button>
              ) : (
                <Button onClick={connectSolana} className="w-full">
                  Connect Phantom
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Cronos Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Cronos
                </span>
                <Badge variant={evmConnected && currentChain === 'cronos' ? 'default' : 'secondary'}>
                  {evmConnected && currentChain === 'cronos' ? 'Connected' : 'Disconnected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Access VVS Finance, high-yield staking, and emerging DeFi protocols
              </p>
              {evmConnected && currentChain === 'cronos' ? (
                <Button onClick={disconnectEVM} variant="outline" className="w-full">
                  Disconnect MetaMask
                </Button>
              ) : (
                <Button onClick={() => connectEVM('cronos')} className="w-full">
                  Connect to Cronos
                </Button>
              )}
            </CardContent>
          </Card>

          {/* BNB Chain Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  BNB Chain
                </span>
                <Badge variant={evmConnected && currentChain === 'bnb' ? 'default' : 'secondary'}>
                  {evmConnected && currentChain === 'bnb' ? 'Connected' : 'Disconnected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Trade on PancakeSwap, participate in farms, and earn CAKE rewards
              </p>
              {evmConnected && currentChain === 'bnb' ? (
                <Button onClick={() => switchChain('cronos')} variant="outline" className="w-full">
                  Switch to Cronos
                </Button>
              ) : (
                <Button onClick={() => connectEVM('bnb')} className="w-full">
                  Connect to BNB
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chain Switching for EVM */}
        {evmConnected && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Chain Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={() => switchChain('cronos')}
                  variant={currentChain === 'cronos' ? 'default' : 'outline'}
                >
                  Switch to Cronos
                </Button>
                <Button 
                  onClick={() => switchChain('bnb')}
                  variant={currentChain === 'bnb' ? 'default' : 'outline'}
                >
                  Switch to BNB Chain
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Trading Communication Hub */}
        {isConnected ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              AI Trading Communication Hub
            </h2>
            <TradingCommunicationHub />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Connect a Wallet to Begin
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Connect at least one wallet to access the AI trading communication interface and monitor cross-chain opportunities.
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={connectSolana} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    Connect Solana
                  </Button>
                  <Button onClick={() => connectEVM('cronos')} variant="outline" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Connect Cronos
                  </Button>
                  <Button onClick={() => connectEVM('bnb')} variant="outline" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    Connect BNB
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trading Status */}
        {tradingEnabled && (
          <Alert className="mt-6">
            <AlertDescription>
              <strong>Trading Active:</strong> The AI system is actively monitoring and executing trades across connected chains. 
              Monitor the communication hub for real-time updates and opportunities.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}