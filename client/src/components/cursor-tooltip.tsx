import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
  type?: 'default' | 'consciousness' | 'trading' | 'neural';
}

interface CursorTooltipContextType {
  showTooltip: (content: string, type?: TooltipState['type']) => void;
  hideTooltip: () => void;
  updatePosition: (x: number, y: number) => void;
}

const CursorTooltipContext = createContext<CursorTooltipContextType | null>(null);

export const useCursorTooltip = () => {
  const context = useContext(CursorTooltipContext);
  if (!context) {
    throw new Error('useCursorTooltip must be used within CursorTooltipProvider');
  }
  return context;
};

interface CursorTooltipProviderProps {
  children: ReactNode;
}

export const CursorTooltipProvider = ({ children }: CursorTooltipProviderProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
    type: 'default'
  });

  const showTooltip = (content: string, type: TooltipState['type'] = 'default') => {
    setTooltip(prev => ({ ...prev, visible: true, content, type }));
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const updatePosition = (x: number, y: number) => {
    setTooltip(prev => ({ ...prev, x: x + 15, y: y - 40 }));
  };

  // Track mouse movement globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getTooltipStyles = (type: TooltipState['type']) => {
    switch (type) {
      case 'consciousness':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
        };
      case 'trading':
        return {
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          border: '1px solid rgba(17, 153, 142, 0.3)',
          boxShadow: '0 8px 32px rgba(17, 153, 142, 0.2)',
        };
      case 'neural':
        return {
          background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
          border: '1px solid rgba(252, 70, 107, 0.3)',
          boxShadow: '0 8px 32px rgba(252, 70, 107, 0.2)',
        };
      default:
        return {
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        };
    }
  };

  return (
    <CursorTooltipContext.Provider value={{ showTooltip, hideTooltip, updatePosition }}>
      {children}
      
      <AnimatePresence>
        {tooltip.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[9999] pointer-events-none px-3 py-2 text-sm text-white rounded-lg backdrop-blur-md"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              ...getTooltipStyles(tooltip.type),
            }}
          >
            <div className="relative">
              {tooltip.content}
              
              {/* Consciousness particles for special tooltips */}
              {tooltip.type === 'consciousness' && (
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <motion.div
                    className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                    animate={{
                      x: [0, 20, 0],
                      y: [0, -10, 0],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ left: '10%', top: '20%' }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40"
                    animate={{
                      x: [0, -15, 0],
                      y: [0, 15, 0],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    style={{ right: '15%', bottom: '25%' }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CursorTooltipContext.Provider>
  );
};

// HOC for easy tooltip attachment
interface WithCursorTooltipProps {
  tooltip: string;
  tooltipType?: TooltipState['type'];
  children: ReactNode;
  className?: string;
}

export const WithCursorTooltip = ({ 
  tooltip, 
  tooltipType = 'default', 
  children, 
  className 
}: WithCursorTooltipProps) => {
  const { showTooltip, hideTooltip } = useCursorTooltip();

  return (
    <div
      className={className}
      onMouseEnter={() => showTooltip(tooltip, tooltipType)}
      onMouseLeave={hideTooltip}
    >
      {children}
    </div>
  );
};