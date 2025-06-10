import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export function Web3AuthButton() {
  // Show demo connected state with trading wallet
  const demoWalletAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <motion.div className="flex items-center space-x-3">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-400">Trading Wallet</div>
          <div className="text-sm font-mono text-cyan-300">
            {demoWalletAddress.substring(0, 6)}...{demoWalletAddress.substring(demoWalletAddress.length - 4)}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </motion.div>
    </motion.div>
  );
}