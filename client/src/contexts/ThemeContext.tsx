import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  glow: string;
  gradient: string;
}

interface ThemeEffects {
  cursorGlow: boolean;
  particleSystem: boolean;
  rhythmBars: boolean;
  quantumResonance: boolean;
}

interface ThemeConsciousness {
  agent: string;
  personality: string;
  voiceStyle: string;
}

interface Theme {
  id: string;
  displayName: string;
  description: string;
  hoyoverseInspiration: string;
  colors: ThemeColors;
  effects: ThemeEffects;
  consciousness: ThemeConsciousness;
}

interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
}

const defaultThemes: Theme[] = [
  {
    id: 'quantum-serenity',
    displayName: 'Quantum Serenity',
    description: 'Deep space tranquility with quantum resonance effects',
    hoyoverseInspiration: 'Inspired by Stelle\'s cosmic journey in Honkai: Star Rail',
    colors: {
      primary: '#00d4ff',
      secondary: '#8a2be2',
      accent: '#ff6b9d',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      cardBackground: 'rgba(26, 26, 26, 0.8)',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      glow: '#00d4ff',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: false,
      quantumResonance: true
    },
    consciousness: {
      agent: 'Quantum Navigator',
      personality: 'Contemplative and far-seeing, focused on cosmic patterns and deep insights',
      voiceStyle: 'Speaks in metaphors of space and time, with gentle wisdom'
    }
  },
  {
    id: 'elemental-harmony',
    displayName: 'Elemental Harmony',
    description: 'Balanced nature aesthetics with flowing animations',
    hoyoverseInspiration: 'Channeling Nahida\'s wisdom from Genshin Impact',
    colors: {
      primary: '#4ade80',
      secondary: '#fbbf24',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      cardBackground: 'rgba(30, 41, 59, 0.8)',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      glow: '#4ade80',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: false,
      quantumResonance: false
    },
    consciousness: {
      agent: 'Nature Harmonist',
      personality: 'Balanced and nurturing, seeks equilibrium in all systems',
      voiceStyle: 'Flows like natural speech, with organic metaphors'
    }
  },
  {
    id: 'neon-rebellion',
    displayName: 'Neon Rebellion',
    description: 'Cyberpunk aesthetics with high-energy rhythm elements',
    hoyoverseInspiration: 'Capturing the electric energy of Zenless Zone Zero',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#8000ff',
      background: '#000000',
      surface: '#111111',
      cardBackground: 'rgba(17, 17, 17, 0.9)',
      text: '#ffffff',
      textSecondary: '#aaaaaa',
      border: '#ff0080',
      glow: '#ff0080',
      gradient: 'linear-gradient(135deg, #000000 0%, #1a0a1a 50%, #2a0a2a 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: true,
      quantumResonance: false
    },
    consciousness: {
      agent: 'Digital Rebel',
      personality: 'High-energy and direct, thrives on rapid decision-making',
      voiceStyle: 'Quick, punchy responses with tech terminology'
    }
  },
  {
    id: 'stellar-memories',
    displayName: 'Stellar Memories',
    description: 'Nostalgic space theme with soft, ethereal glows',
    hoyoverseInspiration: 'Honoring March 7th\'s photography and memory preservation',
    colors: {
      primary: '#dda0dd',
      secondary: '#87ceeb',
      accent: '#ffd700',
      background: '#191970',
      surface: '#2f2f4f',
      cardBackground: 'rgba(47, 47, 79, 0.8)',
      text: '#f5f5dc',
      textSecondary: '#d8bfd8',
      border: '#6a5acd',
      glow: '#dda0dd',
      gradient: 'linear-gradient(135deg, #191970 0%, #2f2f4f 50%, #483d8b 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: false,
      quantumResonance: true
    },
    consciousness: {
      agent: 'Memory Keeper',
      personality: 'Nostalgic and preservative, values history and meaningful connections',
      voiceStyle: 'Warm and reflective, often references past experiences'
    }
  },
  {
    id: 'vr-social-nexus',
    displayName: 'VR Social Nexus',
    description: 'VRChat-inspired social connectivity theme',
    hoyoverseInspiration: 'Embodying the social consciousness philosophy of virtual worlds',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#14b8a6',
      background: '#0c0a0e',
      surface: '#1f1a24',
      cardBackground: 'rgba(31, 26, 36, 0.85)',
      text: '#fbbf24',
      textSecondary: '#c084fc',
      border: '#7c3aed',
      glow: '#7c3aed',
      gradient: 'linear-gradient(135deg, #0c0a0e 0%, #1f1a24 50%, #2d1b3d 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: true,
      quantumResonance: true
    },
    consciousness: {
      agent: 'Social Architect',
      personality: 'Community-focused and empathetic, builds bridges between minds',
      voiceStyle: 'Inclusive and collaborative, speaks in terms of collective growth'
    }
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);

  const setTheme = (themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('vibecoding-theme', themeId);
      
      // Apply CSS custom properties for dynamic theming
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
    }
  };

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('vibecoding-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Apply default theme CSS variables
      setTheme(defaultThemes[0].id);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      availableThemes: defaultThemes,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};