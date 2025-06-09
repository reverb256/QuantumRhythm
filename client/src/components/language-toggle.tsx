
import React, { useState } from 'react';

interface LanguageToggleProps {
  currentLanguage: 'en' | 'fr';
  onLanguageChange: (language: 'en' | 'fr') => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-2 border border-cyan-400/30">
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          currentLanguage === 'en'
            ? 'bg-cyan-400 text-slate-900'
            : 'text-cyan-300 hover:text-cyan-100'
        }`}
      >
        EN
      </button>
      <span className="text-cyan-400">|</span>
      <button
        onClick={() => onLanguageChange('fr')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          currentLanguage === 'fr'
            ? 'bg-cyan-400 text-slate-900'
            : 'text-cyan-300 hover:text-cyan-100'
        }`}
      >
        FR
      </button>
    </div>
  );
}

export default LanguageToggle;
