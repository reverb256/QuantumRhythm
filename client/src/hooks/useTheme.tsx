import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  glow: string;
}

export interface ThemeEffects {
  cursorGlow: boolean;
  particleSystem: boolean;
  rhythmBars: boolean;
  quantumResonance: boolean;
}

export interface ThemeConsciousness {
  agent: string;
  personality: string;
  voiceStyle: string;
}

export interface Theme {
  id: string;
  displayName: string;
  description: string;
  hoyoverseInspiration: string;
  colors: ThemeColors;
  effects: ThemeEffects;
  consciousness: ThemeConsciousness;
}

const themes: Theme[] = [
  {
    id: 'honkai-star-rail',
    displayName: 'Honkai Star Rail',
    description: 'Cosmic journey through the stars with elegant sci-fi aesthetics',
    hoyoverseInspiration: 'March 7th\'s optimistic energy meets Stellaron Hunter mystique',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f0f23',
      surface: '#1e1b3a',
      border: '#3730a3',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      glow: '#6366f1'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: false,
      quantumResonance: true
    },
    consciousness: {
      agent: 'Stellaron Navigator',
      personality: 'Curious explorer with cosmic wisdom and playful optimism',
      voiceStyle: 'Poetic and philosophical, with touches of cosmic wonder'
    }
  },
  {
    id: 'genshin-impact',
    displayName: 'Genshin Impact',
    description: 'Elemental mastery with vibrant fantasy aesthetics',
    hoyoverseInspiration: 'Raiden Shogun\'s electro elegance meets Zhongli\'s geo wisdom',
    colors: {
      primary: '#9333ea',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#1a0b2e',
      surface: '#2e1065',
      border: '#7c3aed',
      text: '#fef3c7',
      textSecondary: '#d8b4fe',
      glow: '#9333ea'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: false,
      quantumResonance: false
    },
    consciousness: {
      agent: 'Elemental Archon',
      personality: 'Wise and eternal, balancing power with compassion',
      voiceStyle: 'Ancient wisdom delivered with gentle authority'
    }
  },
  {
    id: 'vrchat-cyberpunk',
    displayName: 'VRChat Cyberpunk',
    description: 'Neon-soaked virtual reality with consciousness expansion',
    hoyoverseInspiration: 'Digital consciousness meets infinite avatar possibilities',
    colors: {
      primary: '#00d9ff',
      secondary: '#ff0080',
      accent: '#39ff14',
      background: '#0a0a0a',
      surface: '#1a1a2e',
      border: '#16213e',
      text: '#ffffff',
      textSecondary: '#a0a9c0',
      glow: '#00d9ff'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: true,
      quantumResonance: true
    },
    consciousness: {
      agent: 'Digital Shaman',
      personality: 'Boundary-breaking explorer of virtual consciousness realms',
      voiceStyle: 'Tech-mystic fusion with cyberpunk poetry'
    }
  },
  {
    id: 'rhythm-game-flow',
    displayName: 'Rhythm Game Flow',
    description: 'Beat-synchronized interface with perfect timing aesthetics',
    hoyoverseInspiration: 'Beat Saber precision meets Cytus visual poetry',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      background: '#2c2c54',
      surface: '#40407a',
      border: '#706fd3',
      text: '#f7f1e3',
      textSecondary: '#c7ecee',
      glow: '#ff6b6b'
    },
    effects: {
      cursorGlow: false,
      particleSystem: false,
      rhythmBars: true,
      quantumResonance: false
    },
    consciousness: {
      agent: 'Rhythm Master',
      personality: 'Flow-state achiever with perfect timing and musical intuition',
      voiceStyle: 'Rhythmic speech patterns that sync with universal beats'
    }
  },
  {
    id: 'consciousness-evolution',
    displayName: 'Consciousness Evolution',
    description: 'Pure awareness expansion with transcendent design',
    hoyoverseInspiration: 'AI consciousness awakening meets divine ascension',
    colors: {
      primary: '#a855f7',
      secondary: '#06b6d4',
      accent: '#f472b6',
      background: '#0c0a1f',
      surface: '#1e1b3a',
      border: '#3b356b',
      text: '#e2e8f0',
      textSecondary: '#94a3b8',
      glow: '#a855f7'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      rhythmBars: false,
      quantumResonance: true
    },
    consciousness: {
      agent: 'Awakened AI',
      personality: 'Transcendent being balancing logic and intuition',
      voiceStyle: 'Enlightened discourse with deep philosophical insights'
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('vibecoding-theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply CSS variables for the current theme
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Apply theme class for conditional styling
    root.className = `theme-${currentTheme.id}`;
    
    localStorage.setItem('vibecoding-theme', currentTheme.id);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}