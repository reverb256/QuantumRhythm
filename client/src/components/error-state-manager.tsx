import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import { 
  Robot404, 
  NetworkError, 
  LoadingError, 
  ServerError, 
  EmptyState, 
  MaintenanceMode 
} from './error-illustrations';

export type ErrorType = 
  | '404' 
  | 'network' 
  | 'loading' 
  | 'server' 
  | 'empty' 
  | 'maintenance'
  | 'generic';

interface ErrorStateProps {
  type: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
  className?: string;
  showActions?: boolean;
}

const ErrorStateManager: React.FC<ErrorStateProps> = ({
  type,
  title,
  message,
  onRetry,
  onHome,
  className = '',
  showActions = true
}) => {
  // Default configurations for each error type
  const errorConfigs = {
    '404': {
      illustration: <Robot404 />,
      defaultTitle: 'Page Not Found',
      defaultMessage: 'The page you\'re looking for seems to have wandered off into cyberspace.',
      actionText: 'Go Home'
    },
    network: {
      illustration: <NetworkError />,
      defaultTitle: 'Connection Lost',
      defaultMessage: 'Unable to connect to our servers. Check your internet connection and try again.',
      actionText: 'Retry Connection'
    },
    loading: {
      illustration: <LoadingError />,
      defaultTitle: 'Loading Failed',
      defaultMessage: 'Something went wrong while loading. Our digital gears need a quick adjustment.',
      actionText: 'Try Again'
    },
    server: {
      illustration: <ServerError />,
      defaultTitle: 'Server Error',
      defaultMessage: 'Our servers are having a rough day. We\'re working to fix this issue.',
      actionText: 'Reload Page'
    },
    empty: {
      illustration: <EmptyState />,
      defaultTitle: 'Nothing Here Yet',
      defaultMessage: 'This space is waiting for content. Check back later or explore other areas.',
      actionText: 'Explore'
    },
    maintenance: {
      illustration: <MaintenanceMode />,
      defaultTitle: 'Under Maintenance',
      defaultMessage: 'We\'re making improvements to serve you better. Please check back soon.',
      actionText: 'Check Status'
    },
    generic: {
      illustration: (
        <div className="w-48 h-48 flex items-center justify-center">
          <AlertCircle className="w-16 h-16 text-red-400" />
        </div>
      ),
      defaultTitle: 'Something Went Wrong',
      defaultMessage: 'An unexpected error occurred. Please try again.',
      actionText: 'Retry'
    }
  };

  const config = errorConfigs[type];
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Illustration */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {config.illustration}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {displayTitle}
      </motion.h2>

      {/* Message */}
      <motion.p
        className="text-gray-300 text-lg max-w-md mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {displayMessage}
      </motion.p>

      {/* Actions */}
      {showActions && (
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              {config.actionText}
            </motion.button>
          )}
          
          {onHome && (
            <motion.button
              onClick={onHome}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Additional Context for Specific Errors */}
      {type === 'network' && (
        <motion.div
          className="mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>Troubleshooting tips:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check your internet connection</li>
            <li>Disable VPN if active</li>
            <li>Try refreshing the page</li>
          </ul>
        </motion.div>
      )}

      {type === 'server' && (
        <motion.div
          className="mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>Error Code: 500 | Server temporarily unavailable</p>
        </motion.div>
      )}

      {type === 'maintenance' && (
        <motion.div
          className="mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>Estimated completion: Usually takes 15-30 minutes</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Specialized error boundary component
interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetError
}) => {
  const getErrorType = (error: Error): ErrorType => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('server') || message.includes('500')) {
      return 'server';
    }
    if (message.includes('loading') || message.includes('chunk')) {
      return 'loading';
    }
    
    return 'generic';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
      <ErrorStateManager
        type={getErrorType(error)}
        title="Oops! Something Broke"
        message={`We encountered an unexpected issue: ${error.message}`}
        onRetry={resetError}
        onHome={() => window.location.href = '/'}
      />
    </div>
  );
};

// Hook for consistent error handling
export const useErrorHandler = () => {
  const handleError = (error: Error, type?: ErrorType) => {
    console.error('Error caught by handler:', error);
    
    // You can extend this to send errors to logging service
    // logErrorToService(error);
    
    return type || 'generic';
  };

  return { handleError };
};

export default ErrorStateManager;