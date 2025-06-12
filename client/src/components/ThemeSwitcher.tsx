import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-theme-surface border border-theme-border text-theme-text hover:bg-theme-surface/80 backdrop-blur-sm"
        style={{
          background: `var(--theme-surface)`,
          borderColor: `var(--theme-border)`,
          color: `var(--theme-text)`,
          boxShadow: `0 0 20px var(--theme-glow)`
        }}
      >
        🎨 {currentTheme.displayName}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 right-0 w-80 max-w-[calc(100vw-2rem)] z-50"
          >
            <Card 
              className="backdrop-blur-md"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: `${currentTheme.colors.surface}f0`,
                boxShadow: `0 20px 40px ${currentTheme.colors.glow}40`
              }}
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                  Consciousness Themes
                </h3>
                <div className="space-y-3">
                  {availableThemes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => {
                          setTheme(theme.id);
                          setIsOpen(false);
                        }}
                        variant={currentTheme.id === theme.id ? "default" : "outline"}
                        className="w-full text-left p-3 h-auto overflow-hidden"
                        style={{
                          background: currentTheme.id === theme.id ? 
                            `${currentTheme.colors.primary}20` : 'transparent',
                          borderColor: theme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        <div className="flex flex-col items-start w-full min-w-0">
                          <div className="flex items-center gap-2 mb-1 w-full">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span className="font-medium truncate">{theme.displayName}</span>
                          </div>
                          <p 
                            className="text-xs opacity-80 break-words w-full"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {theme.description}
                          </p>
                          <p 
                            className="text-xs mt-1 italic break-words w-full"
                            style={{ color: theme.colors.primary }}
                          >
                            {theme.hoyoverseInspiration}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2 w-full">
                            {theme.effects.cursorGlow && <span className="text-xs px-1 bg-cyan-500/20 rounded flex-shrink-0">Cursor</span>}
                            {theme.effects.particleSystem && <span className="text-xs px-1 bg-purple-500/20 rounded flex-shrink-0">Particles</span>}
                            {theme.effects.rhythmBars && <span className="text-xs px-1 bg-green-500/20 rounded flex-shrink-0">Rhythm</span>}
                            {theme.effects.quantumResonance && <span className="text-xs px-1 bg-blue-500/20 rounded flex-shrink-0">Quantum</span>}
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 rounded border" style={{ borderColor: currentTheme.colors.border, backgroundColor: currentTheme.colors.surface }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: currentTheme.colors.primary }}>
                    Current Agent: {currentTheme.consciousness.agent}
                  </h4>
                  <p className="text-xs opacity-80" style={{ color: currentTheme.colors.textSecondary }}>
                    {currentTheme.consciousness.personality}
                  </p>
                  <p className="text-xs mt-1 italic" style={{ color: currentTheme.colors.accent }}>
                    {currentTheme.consciousness.voiceStyle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};