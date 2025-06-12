import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class GracefulErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('Graceful degradation activated:', error.message);
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Auto-retry with exponential backoff
    if (this.state.hasError && this.state.retryCount < this.maxRetries) {
      const delay = Math.pow(2, this.state.retryCount) * 1000;
      this.retryTimeout = setTimeout(() => {
        this.handleRetry();
      }, delay);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1
    }));
  }

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center min-h-[200px] p-8"
        >
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-amber-500" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              System Gracefully Degraded
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A component encountered an issue and switched to safe mode. 
              The system continues to function with reduced features.
            </p>

            {this.state.retryCount < this.maxRetries && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Auto-retry in progress ({this.state.retryCount + 1}/{this.maxRetries})
              </div>
            )}

            <button
              onClick={this.handleManualRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Now
            </button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for hooks
export const useGracefulDegradation = (operation: () => any, fallback: any = null) => {
  const [result, setResult] = React.useState(fallback);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const executeWithGracefulDegradation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await operation();
        setResult(data);
      } catch (err) {
        console.warn('Operation failed, using fallback:', err);
        setError(err as Error);
        setResult(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    executeWithGracefulDegradation();
  }, []);

  return { result, isLoading, error, hasError: !!error };
};

export default GracefulErrorBoundary;