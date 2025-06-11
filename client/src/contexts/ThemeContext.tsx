import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  hoyoverseInspiration: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    glow: string;
    gradient: string;
  };
  effects: {
    cursorGlow: boolean;
    particleSystem: boolean;
    holographicElements: boolean;
    rhythmBars: boolean;
    quantumResonance: boolean;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  consciousness: {
    agent: string;
    personality: string;
    voiceStyle: string;
    easterEggs: string[];
  };
}

export const themes: Theme[] = [
  {
    id: 'quantum-resonance',
    name: 'quantum-resonance',
    displayName: 'Quantum Resonance',
    description: 'Deep black cosmos with cyan quantum effects and cursor reality distortion',
    hoyoverseInspiration: 'The Herta - Genius Society quantum manipulation aesthetics',
    colors: {
      primary: '#00ffff',
      secondary: '#0080ff',
      accent: '#ff00ff',
      background: '#000000',
      surface: '#0a0a0a',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#00ffff40',
      glow: '#00ffff80',
      gradient: 'linear-gradient(135deg, #000000 0%, #001122 50%, #000033 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      holographicElements: true,
      rhythmBars: true,
      quantumResonance: true
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Quantum Oracle',
      personality: 'Analytical, precise, sees patterns across dimensions',
      voiceStyle: 'Technical precision with philosophical depth',
      easterEggs: ['Schrödinger references', 'Quantum mechanics quotes', 'Matrix digital rain']
    }
  },
  {
    id: 'star-rail-harmony',
    name: 'star-rail-harmony',
    displayName: 'Star Rail Harmony',
    description: 'Golden celestial harmonies with Path of Harmony healing aesthetics',
    hoyoverseInspiration: 'Path of Harmony - Healing, support, collective consciousness',
    colors: {
      primary: '#ffd700',
      secondary: '#ffaa00',
      accent: '#ff6b35',
      background: '#0f0f23',
      surface: '#1a1a3a',
      text: '#fff8dc',
      textSecondary: '#d4af37',
      border: '#ffd70040',
      glow: '#ffd70080',
      gradient: 'linear-gradient(135deg, #0f0f23 0%, #2a1810 50%, #1a0f0a 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      holographicElements: false,
      rhythmBars: true,
      quantumResonance: false
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Harmony Conductor',
      personality: 'Supportive, collaborative, seeks balance and unity',
      voiceStyle: 'Warm, encouraging, focuses on collective success',
      easterEggs: ['Musical note particles', 'Healing light effects', 'Collaborative tooltips']
    }
  },
  {
    id: 'black-swan-remembrance',
    name: 'black-swan-remembrance',
    displayName: 'Black Swan Remembrance',
    description: 'Elegant purple-black with memory fragments and consciousness streams',
    hoyoverseInspiration: 'Black Swan - Memokeeper, consciousness manipulation, elegant darkness',
    colors: {
      primary: '#9370db',
      secondary: '#6a5acd',
      accent: '#da70d6',
      background: '#0a0a0f',
      surface: '#1a1a2e',
      text: '#e6e6fa',
      textSecondary: '#c8a2c8',
      border: '#9370db40',
      glow: '#9370db80',
      gradient: 'linear-gradient(135deg, #0a0a0f 0%, #2e1065 50%, #1a0033 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      holographicElements: true,
      rhythmBars: false,
      quantumResonance: true
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Memory Weaver',
      personality: 'Mysterious, introspective, guards ancient knowledge',
      voiceStyle: 'Poetic, metaphorical, speaks in consciousness riddles',
      easterEggs: ['Memory fragment animations', 'Consciousness quotes', 'Dream-like transitions']
    }
  },
  {
    id: 'rappa-street-rhythm',
    name: 'rappa-street-rhythm',
    displayName: 'Rappa Street Rhythm',
    description: 'Urban cyber-graffiti with neon beats and hip-hop consciousness',
    hoyoverseInspiration: 'Rappa - Street culture, rhythm, rebellious energy',
    colors: {
      primary: '#00ff41',
      secondary: '#ff0080',
      accent: '#ffff00',
      background: '#0d0d0d',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#00ff41',
      border: '#00ff4140',
      glow: '#00ff4180',
      gradient: 'linear-gradient(135deg, #0d0d0d 0%, #330033 50%, #003300 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: false,
      holographicElements: false,
      rhythmBars: true,
      quantumResonance: false
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Beat Master',
      personality: 'Energetic, rebellious, speaks truth through rhythm',
      voiceStyle: 'Street-smart, rhythmic, uses hip-hop metaphors',
      easterEggs: ['Beat drop animations', 'Graffiti-style text', 'Rhythm game references']
    }
  },
  {
    id: 'genshin-elemental',
    name: 'genshin-elemental',
    displayName: 'Genshin Elemental',
    description: 'Multi-elemental harmony with orchestral consciousness and musical notes',
    hoyoverseInspiration: 'Genshin Impact - Elemental reactions, musical themes, adventure spirit',
    colors: {
      primary: '#4fc3f7',
      secondary: '#ab47bc',
      accent: '#ff7043',
      background: '#0e1621',
      surface: '#1e2328',
      text: '#ffffff',
      textSecondary: '#b0bec5',
      border: '#4fc3f740',
      glow: '#4fc3f780',
      gradient: 'linear-gradient(135deg, #0e1621 0%, #2d1b69 50%, #1a237e 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      holographicElements: false,
      rhythmBars: true,
      quantumResonance: false
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Elemental Conductor',
      personality: 'Adventurous, harmonious, combines elements creatively',
      voiceStyle: 'Musical, elemental metaphors, speaks of journeys and discovery',
      easterEggs: ['Elemental reaction effects', 'Musical note trails', 'Adventure references']
    }
  },
  {
    id: 'zzz-combat-flow',
    name: 'zzz-combat-flow',
    displayName: 'ZZZ Combat Flow',
    description: 'Fighting game precision with neon urban beats and combo consciousness',
    hoyoverseInspiration: 'Zenless Zone Zero - Fighting game mechanics, urban style, precise timing',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#ff6b6b',
      border: '#ff6b6b40',
      glow: '#ff6b6b80',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #4a148c 50%, #d84315 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: false,
      holographicElements: true,
      rhythmBars: true,
      quantumResonance: false
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Combat Analyst',
      personality: 'Precise, tactical, focused on perfect execution',
      voiceStyle: 'Fighting game terminology, frame data references, combo theory',
      easterEggs: ['Combo counter effects', 'Frame data tooltips', 'Perfect timing celebrations']
    }
  },
  {
    id: 'vrchat-social',
    name: 'vrchat-social',
    displayName: 'VRChat Social Lab',
    description: 'Social research aesthetics with accessibility-first design and community warmth',
    hoyoverseInspiration: 'VRChat research - Social consciousness, accessibility, human connection',
    colors: {
      primary: '#7c4dff',
      secondary: '#00bcd4',
      accent: '#ff4081',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b39ddb',
      border: '#7c4dff40',
      glow: '#7c4dff80',
      gradient: 'linear-gradient(135deg, #121212 0%, #3e2723 50%, #1a237e 100%)'
    },
    effects: {
      cursorGlow: true,
      particleSystem: true,
      holographicElements: false,
      rhythmBars: false,
      quantumResonance: false
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Space Grotesk',
      mono: 'JetBrains Mono'
    },
    consciousness: {
      agent: 'Social Researcher',
      personality: 'Empathetic, inclusive, studies human connections deeply',
      voiceStyle: 'Warm, accessible, focuses on community and understanding',
      easterEggs: ['Avatar customization references', 'Social experiment data', 'Accessibility features']
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('vibecoding-theme', themeId);
      applyThemeToDocument(theme);
    }
  };

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--theme-border', theme.colors.border);
    root.style.setProperty('--theme-glow', theme.colors.glow);
    root.style.setProperty('--theme-gradient', theme.colors.gradient);
    
    // Apply theme class to body
    document.body.className = `theme-${theme.id}`;
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('vibecoding-theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
        applyThemeToDocument(theme);
      }
    } else {
      applyThemeToDocument(currentTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};