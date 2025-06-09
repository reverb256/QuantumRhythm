import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// Enhanced tooltip data structure
export interface TooltipData {
  title: string;
  description?: string;
  category?: 'navigation' | 'action' | 'info' | 'warning' | 'technical' | 'philosophy';
  shortcut?: string;
  status?: 'active' | 'inactive' | 'loading' | 'error';
  metadata?: {
    confidence?: number;
    impact?: 'low' | 'medium' | 'high';
    relevance?: number;
    technicalLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  contextualInfo?: {
    currentValue?: string;
    suggestedAction?: string;
    relatedFeatures?: string[];
    securityLevel?: 'public' | 'protected' | 'restricted';
  };
  aiInsights?: {
    optimizationSuggestion?: string;
    performanceImpact?: string;
    semanticContext?: string;
  };
}

interface CursorTooltipState {
  isVisible: boolean;
  position: { x: number; y: number };
  data: TooltipData | null;
  targetElement: Element | null;
}

// Global tooltip registry for cross-component coordination
class TooltipRegistry {
  private static instance: TooltipRegistry;
  private registry = new Map<Element, TooltipData>();
  private observers = new Set<(state: CursorTooltipState) => void>();

  static getInstance(): TooltipRegistry {
    if (!TooltipRegistry.instance) {
      TooltipRegistry.instance = new TooltipRegistry();
    }
    return TooltipRegistry.instance;
  }

  register(element: Element, data: TooltipData) {
    this.registry.set(element, data);
  }

  unregister(element: Element) {
    this.registry.delete(element);
  }

  get(element: Element): TooltipData | undefined {
    return this.registry.get(element);
  }

  subscribe(callback: (state: CursorTooltipState) => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notify(state: CursorTooltipState) {
    this.observers.forEach(callback => callback(state));
  }

  // AI-powered tooltip enhancement
  enhanceTooltip(element: Element, baseData: TooltipData): TooltipData {
    const elementType = element.tagName.toLowerCase();
    const className = element.className;
    const role = element.getAttribute('role');
    
    // Context-aware enhancements
    const enhanced: TooltipData = { ...baseData };

    // Add technical context based on element type
    if (elementType === 'button') {
      enhanced.contextualInfo = {
        ...enhanced.contextualInfo,
        suggestedAction: this.getButtonAction(element),
        securityLevel: this.assessSecurityLevel(element)
      };
    }

    // Trading-specific enhancements
    if (className.includes('trading') || className.includes('agent')) {
      enhanced.aiInsights = {
        ...enhanced.aiInsights,
        semanticContext: 'Autonomous trading system component',
        performanceImpact: 'Real-time market data processing'
      };
    }

    // Philosophy/dojo enhancements
    if (className.includes('dojo') || className.includes('philosophy')) {
      enhanced.aiInsights = {
        ...enhanced.aiInsights,
        semanticContext: 'Martial arts ethics integration',
        optimizationSuggestion: 'Reflects Shotokan karate principles'
      };
    }

    return enhanced;
  }

  private getButtonAction(element: Element): string {
    const text = element.textContent?.toLowerCase() || '';
    if (text.includes('start') || text.includes('begin')) return 'Initiates process';
    if (text.includes('stop') || text.includes('cancel')) return 'Terminates current action';
    if (text.includes('save') || text.includes('submit')) return 'Persists changes';
    if (text.includes('delete') || text.includes('remove')) return 'Destructive operation';
    return 'Executes primary action';
  }

  private assessSecurityLevel(element: Element): 'public' | 'protected' | 'restricted' {
    const className = element.className.toLowerCase();
    if (className.includes('delete') || className.includes('admin')) return 'restricted';
    if (className.includes('save') || className.includes('edit')) return 'protected';
    return 'public';
  }
}

// Main cursor tooltip component
export const UniversalCursorTooltip: React.FC = () => {
  const [tooltipState, setTooltipState] = useState<CursorTooltipState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    data: null,
    targetElement: null
  });

  const registry = TooltipRegistry.getInstance();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const currentElementRef = useRef<Element | null>(null);

  const showTooltip = useCallback((element: Element, x: number, y: number) => {
    const data = registry.get(element);
    if (!data) return;

    const enhancedData = registry.enhanceTooltip(element, data);
    
    setTooltipState({
      isVisible: true,
      position: { x: x + 15, y: y - 10 },
      data: enhancedData,
      targetElement: element
    });

    registry.notify({
      isVisible: true,
      position: { x: x + 15, y: y - 10 },
      data: enhancedData,
      targetElement: element
    });
  }, [registry]);

  const hideTooltip = useCallback(() => {
    setTooltipState(prev => ({ ...prev, isVisible: false }));
    registry.notify({
      isVisible: false,
      position: { x: 0, y: 0 },
      data: null,
      targetElement: null
    });
  }, [registry]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (tooltipState.isVisible) {
      setTooltipState(prev => ({
        ...prev,
        position: { x: e.clientX + 15, y: e.clientY - 10 }
      }));
    }
  }, [tooltipState.isVisible]);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (target === currentElementRef.current) return;

    currentElementRef.current = target;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if element has tooltip data
    const data = registry.get(target);
    if (data) {
      timeoutRef.current = setTimeout(() => {
        showTooltip(target, e.clientX, e.clientY);
      }, 500); // 500ms delay for better UX
    }
  }, [registry, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    hideTooltip();
    currentElementRef.current = null;
  }, [hideTooltip]);

  useEffect(() => {
    // Enhanced event delegation for comprehensive coverage
    const handleEvent = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Check if target or any parent has tooltip data
      let currentTarget: Element | null = target;
      while (currentTarget && currentTarget !== document.body) {
        if (registry.get(currentTarget)) {
          if (e.type === 'mouseenter') {
            handleMouseEnter(e);
          } else if (e.type === 'mouseleave') {
            handleMouseLeave();
          }
          break;
        }
        currentTarget = currentTarget.parentElement;
      }
    };

    document.addEventListener('mouseover', handleEvent);
    document.addEventListener('mouseout', handleEvent);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseover', handleEvent);
      document.removeEventListener('mouseout', handleEvent);
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'navigation': return 'from-blue-500 to-cyan-500';
      case 'action': return 'from-green-500 to-emerald-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'technical': return 'from-purple-500 to-indigo-500';
      case 'philosophy': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSecurityIndicator = (level?: string) => {
    switch (level) {
      case 'restricted': return { color: 'text-red-400', icon: '🔒' };
      case 'protected': return { color: 'text-yellow-400', icon: '🛡️' };
      case 'public': return { color: 'text-green-400', icon: '🌐' };
      default: return { color: 'text-gray-400', icon: '📝' };
    }
  };

  if (!tooltipState.isVisible || !tooltipState.data) {
    return null;
  }

  const { data, position } = tooltipState;
  const categoryGradient = getCategoryColor(data.category);
  const securityInfo = getSecurityIndicator(data.contextualInfo?.securityLevel);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: Math.min(position.x, window.innerWidth - 350),
          top: Math.max(10, position.y)
        }}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Main tooltip container */}
        <div className="bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl max-w-80 overflow-hidden">
          {/* Header with category gradient */}
          <div className={`bg-gradient-to-r ${categoryGradient} p-3`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm truncate">
                {data.title}
              </h3>
              {data.status && (
                <div className={`w-2 h-2 rounded-full ${
                  data.status === 'active' ? 'bg-green-400' :
                  data.status === 'loading' ? 'bg-yellow-400 animate-pulse' :
                  data.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
              )}
            </div>
            {data.shortcut && (
              <div className="text-xs text-white/80 mt-1">
                <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">{data.shortcut}</kbd>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            {data.description && (
              <p className="text-gray-300 text-xs leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Metadata section */}
            {data.metadata && (
              <div className="flex items-center gap-3 text-xs">
                {data.metadata.confidence && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Confidence:</span>
                    <div className="flex items-center">
                      <div className="w-12 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 transition-all duration-300"
                          style={{ width: `${data.metadata.confidence}%` }}
                        />
                      </div>
                      <span className="text-gray-300 ml-1">{data.metadata.confidence}%</span>
                    </div>
                  </div>
                )}
                {data.metadata.impact && (
                  <div className={`px-2 py-0.5 rounded text-xs ${
                    data.metadata.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                    data.metadata.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {data.metadata.impact} impact
                  </div>
                )}
              </div>
            )}

            {/* Contextual info */}
            {data.contextualInfo && (
              <div className="border-t border-gray-700/50 pt-2 space-y-1">
                {data.contextualInfo.currentValue && (
                  <div className="text-xs">
                    <span className="text-gray-400">Current:</span>
                    <span className="text-gray-200 ml-1">{data.contextualInfo.currentValue}</span>
                  </div>
                )}
                {data.contextualInfo.suggestedAction && (
                  <div className="text-xs">
                    <span className="text-gray-400">Action:</span>
                    <span className="text-blue-300 ml-1">{data.contextualInfo.suggestedAction}</span>
                  </div>
                )}
                {data.contextualInfo.securityLevel && (
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400">Security:</span>
                    <span className={`ml-1 ${securityInfo.color}`}>
                      {securityInfo.icon} {data.contextualInfo.securityLevel}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* AI insights */}
            {data.aiInsights && (
              <div className="border-t border-purple-700/30 pt-2 space-y-1">
                <div className="flex items-center gap-1 text-xs text-purple-300">
                  <span>🤖</span>
                  <span className="font-medium">AI Insights</span>
                </div>
                {data.aiInsights.semanticContext && (
                  <div className="text-xs text-gray-300">
                    {data.aiInsights.semanticContext}
                  </div>
                )}
                {data.aiInsights.optimizationSuggestion && (
                  <div className="text-xs text-blue-300">
                    💡 {data.aiInsights.optimizationSuggestion}
                  </div>
                )}
              </div>
            )}

            {/* Related features */}
            {data.contextualInfo?.relatedFeatures && data.contextualInfo.relatedFeatures.length > 0 && (
              <div className="border-t border-gray-700/50 pt-2">
                <div className="text-xs text-gray-400 mb-1">Related:</div>
                <div className="flex flex-wrap gap-1">
                  {data.contextualInfo.relatedFeatures.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// Hook for registering tooltip data
export const useTooltip = (data: TooltipData) => {
  const registry = TooltipRegistry.getInstance();
  
  return useCallback((element: HTMLElement | null) => {
    if (element) {
      registry.register(element, data);
      return () => registry.unregister(element);
    }
  }, [data, registry]);
};

// Enhanced tooltip HOC for automatic registration
export const withTooltip = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  tooltipData: TooltipData | ((props: P) => TooltipData)
) => {
  return React.forwardRef<HTMLElement, P>((props, ref) => {
    const data = typeof tooltipData === 'function' ? tooltipData(props) : tooltipData;
    const tooltipRef = useTooltip(data);
    
    return (
      <WrappedComponent
        {...props}
        ref={(element: HTMLElement) => {
          tooltipRef(element);
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
      />
    );
  });
};

export { TooltipRegistry };
export default UniversalCursorTooltip;