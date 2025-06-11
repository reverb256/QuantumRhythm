import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
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
            className="absolute top-14 right-0 w-80"
          >
            <Card 
              className="border-theme-border bg-theme-surface/95 backdrop-blur-md"
              style={{
                borderColor: `var(--theme-border)`,
                background: `var(--theme-surface)95`,
                boxShadow: `0 20px 40px var(--theme-glow)40`
              }}
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4" style={{ color: `var(--theme-primary)` }}>
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
                        className="w-full text-left p-3 h-auto"
                        style={{
                          background: currentTheme.id === theme.id ? 
                            `var(--theme-primary)20` : 'transparent',
                          borderColor: theme.colors.primary,
                          color: `var(--theme-text)`
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span className="font-medium">{theme.displayName}</span>
                          </div>
                          <p 
                            className="text-xs opacity-80"
                            style={{ color: `var(--theme-text-secondary)` }}
                          >
                            {theme.description}
                          </p>
                          <p 
                            className="text-xs mt-1 italic"
                            style={{ color: theme.colors.primary }}
                          >
                            {theme.hoyoverseInspiration}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {theme.effects.cursorGlow && <span className="text-xs px-1 bg-cyan-500/20 rounded">Cursor</span>}
                            {theme.effects.particleSystem && <span className="text-xs px-1 bg-purple-500/20 rounded">Particles</span>}
                            {theme.effects.rhythmBars && <span className="text-xs px-1 bg-green-500/20 rounded">Rhythm</span>}
                            {theme.effects.quantumResonance && <span className="text-xs px-1 bg-blue-500/20 rounded">Quantum</span>}
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 rounded border" style={{ borderColor: `var(--theme-border)`, background: `var(--theme-surface)` }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: `var(--theme-primary)` }}>
                    Current Agent: {currentTheme.consciousness.agent}
                  </h4>
                  <p className="text-xs opacity-80" style={{ color: `var(--theme-text-secondary)` }}>
                    {currentTheme.consciousness.personality}
                  </p>
                  <p className="text-xs mt-1 italic" style={{ color: `var(--theme-accent)` }}>
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