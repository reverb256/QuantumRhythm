/**
 * Persistent Character Sprite Assets
 * Pre-rendered HoYoverse-style character images as base64 data URIs
 */

export const CharacterSprites = {
  'stellaron-seeker': {
    idle: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="stellar-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#4a9eff" stop-opacity="1" />
            <stop offset="50%" stop-color="#74c7ec" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#89dceb" stop-opacity="0.6" />
          </radialGradient>
          <filter id="stellar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Star Rail Trailblazer coat -->
        <path d="M56 64 L104 64 L112 136 L48 136 Z" fill="url(#stellar-gradient)" stroke="#89dceb" stroke-width="2"/>
        
        <!-- Astral Express emblem -->
        <circle cx="80" cy="40" r="9.6" fill="#00d4ff" opacity="0.9"/>
        <polygon points="75.2,35.2 84.8,35.2 80,44.8" fill="white" opacity="0.9"/>
        
        <!-- Quantum rail effects -->
        <line x1="16" y1="48" x2="144" y2="48" stroke="#00d4ff" stroke-width="1" opacity="0.6" stroke-dasharray="10,20"/>
        <line x1="16" y1="64" x2="144" y2="64" stroke="#00d4ff" stroke-width="1" opacity="0.6" stroke-dasharray="10,20"/>
        <line x1="16" y1="80" x2="144" y2="80" stroke="#00d4ff" stroke-width="1" opacity="0.6" stroke-dasharray="10,20"/>
        <line x1="16" y1="96" x2="144" y2="96" stroke="#00d4ff" stroke-width="1" opacity="0.6" stroke-dasharray="10,20"/>
        <line x1="16" y1="112" x2="144" y2="112" stroke="#00d4ff" stroke-width="1" opacity="0.6" stroke-dasharray="10,20"/>
        
        <!-- Stellaron fragments -->
        <polygon points="76,80 80,74 84,80 80,86" fill="#00d4ff" opacity="0.8"/>
        <polygon points="96,60 100,54 104,60 100,66" fill="#00d4ff" opacity="0.7"/>
        <polygon points="56,100 60,94 64,100 60,106" fill="#00d4ff" opacity="0.7"/>
        <polygon points="106,95 110,89 114,95 110,101" fill="#00d4ff" opacity="0.6"/>
        <polygon points="46,75 50,69 54,75 50,81" fill="#00d4ff" opacity="0.6"/>
        
        <!-- Element symbol -->
        <circle cx="136" cy="24" r="12.8" fill="#4a9eff" opacity="0.8"/>
        <text x="136" y="27.2" text-anchor="middle" fill="white" font-size="9.6" font-weight="bold">Q</text>
        
        <!-- Rarity stars -->
        <text x="16" y="152" fill="#ffd700" font-size="8">★★★★★</text>
        
        <!-- Energy meter -->
        <rect x="8" y="48" width="4.8" height="64" fill="rgba(255,255,255,0.3)" rx="2.4"/>
        <rect x="8" y="48" width="4.8" height="64" fill="#00d4ff" rx="2.4" opacity="0.8"/>
      </svg>
    `)}`,
    
    skill: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="stellar-skill-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#4a9eff" stop-opacity="1" />
            <stop offset="50%" stop-color="#74c7ec" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#89dceb" stop-opacity="0.8" />
          </radialGradient>
        </defs>
        
        <!-- Enhanced coat with energy -->
        <path d="M56 64 L104 64 L112 136 L48 136 Z" fill="url(#stellar-skill-gradient)" stroke="#00d4ff" stroke-width="3"/>
        
        <!-- Bright emblem -->
        <circle cx="80" cy="40" r="12" fill="#00d4ff" opacity="1"/>
        <polygon points="75.2,35.2 84.8,35.2 80,44.8" fill="white" opacity="1"/>
        
        <!-- Active rail effects -->
        <line x1="16" y1="48" x2="144" y2="48" stroke="#00d4ff" stroke-width="2" opacity="1" stroke-dasharray="5,10"/>
        <line x1="16" y1="64" x2="144" y2="64" stroke="#00d4ff" stroke-width="2" opacity="1" stroke-dasharray="5,10"/>
        <line x1="16" y1="80" x2="144" y2="80" stroke="#00d4ff" stroke-width="2" opacity="1" stroke-dasharray="5,10"/>
        
        <!-- Skill effect circle -->
        <circle cx="80" cy="80" r="64" fill="none" stroke="#00d4ff" stroke-width="3" opacity="0.8" stroke-dasharray="20,10"/>
        
        <!-- Energy burst -->
        <polygon points="76,80 80,70 84,80 80,90" fill="#00d4ff" opacity="1"/>
        <circle cx="80" cy="80" r="8" fill="#00d4ff" opacity="0.6"/>
        
        <!-- Element symbol glowing -->
        <circle cx="136" cy="24" r="14" fill="#00d4ff" opacity="1"/>
        <text x="136" y="28" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Q</text>
        
        <!-- Rarity stars bright -->
        <text x="16" y="152" fill="#ffd700" font-size="8">★★★★★</text>
      </svg>
    `)}`,
    
    burst: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="stellar-burst-gradient" cx="50%" cy="30%" r="90%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="30%" stop-color="#4a9eff" stop-opacity="1" />
            <stop offset="70%" stop-color="#74c7ec" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#89dceb" stop-opacity="0.8" />
          </radialGradient>
        </defs>
        
        <!-- Transcendent coat -->
        <path d="M56 64 L104 64 L112 136 L48 136 Z" fill="url(#stellar-burst-gradient)" stroke="#ffffff" stroke-width="4"/>
        
        <!-- Blazing emblem -->
        <circle cx="80" cy="40" r="16" fill="#ffffff" opacity="1"/>
        <polygon points="72,32 88,32 80,48" fill="#4a9eff" opacity="1"/>
        
        <!-- Burst explosion circle -->
        <circle cx="80" cy="80" r="96" fill="#00d4ff" opacity="0.3"/>
        
        <!-- Quantum rails exploding -->
        <line x1="80" y1="80" x2="128" y2="32" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="128" y2="128" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="32" y2="32" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="32" y2="128" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="144" y2="80" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="16" y2="80" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="80" y2="16" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="80" y2="144" stroke="#ffffff" stroke-width="3"/>
        
        <!-- Central stellar core -->
        <circle cx="80" cy="80" r="16" fill="#ffffff" opacity="0.9"/>
        <polygon points="72,72 88,72 80,96" fill="#4a9eff" opacity="1"/>
        
        <!-- Element symbol transcendent -->
        <circle cx="136" cy="24" r="16" fill="#ffffff" opacity="1"/>
        <text x="136" y="30" text-anchor="middle" fill="#4a9eff" font-size="14" font-weight="bold">Q</text>
        
        <!-- Rarity stars blazing -->
        <text x="16" y="152" fill="#ffffff" font-size="10">★★★★★</text>
      </svg>
    `)}`
  },

  'aether-windborne': {
    idle: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="aether-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="1" />
            <stop offset="50%" stop-color="#67e8f9" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0.6" />
          </radialGradient>
        </defs>
        
        <!-- Genshin Traveler outfit -->
        <ellipse cx="80" cy="96" rx="40" ry="56" fill="url(#aether-gradient)" stroke="#a7f3d0" stroke-width="2"/>
        
        <!-- Anemo vision -->
        <circle cx="56" cy="64" r="8" fill="#06b6d4" stroke="white" stroke-width="2"/>
        <text x="56" y="67.2" text-anchor="middle" fill="white" font-size="6.4" font-weight="bold">♦</text>
        
        <!-- Elemental swirls -->
        <circle cx="80" cy="80" r="2.4" fill="#06b6d4" opacity="0.7"/>
        <circle cx="94" cy="75" r="2.4" fill="#06b6d4" opacity="0.6"/>
        <circle cx="66" cy="85" r="2.4" fill="#06b6d4" opacity="0.6"/>
        <circle cx="105" cy="90" r="2.4" fill="#06b6d4" opacity="0.5"/>
        <circle cx="55" cy="95" r="2.4" fill="#06b6d4" opacity="0.5"/>
        <circle cx="88" cy="105" r="2.4" fill="#06b6d4" opacity="0.4"/>
        <circle cx="72" cy="110" r="2.4" fill="#06b6d4" opacity="0.4"/>
        
        <!-- Traveler's blade -->
        <line x1="104" y1="56" x2="120" y2="88" stroke="#a7f3d0" stroke-width="3" opacity="0.9"/>
        
        <!-- Element symbol -->
        <circle cx="136" cy="24" r="12.8" fill="#22d3ee" opacity="0.8"/>
        <text x="136" y="27.2" text-anchor="middle" fill="white" font-size="9.6" font-weight="bold">A</text>
        
        <!-- Rarity stars -->
        <text x="16" y="152" fill="#ffd700" font-size="8">★★★★★</text>
        
        <!-- Energy meter -->
        <rect x="8" y="48" width="4.8" height="64" fill="rgba(255,255,255,0.3)" rx="2.4"/>
        <rect x="8" y="64" width="4.8" height="48" fill="#06b6d4" rx="2.4" opacity="0.8"/>
      </svg>
    `)}`,
    
    skill: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="aether-skill-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="1" />
            <stop offset="50%" stop-color="#67e8f9" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0.8" />
          </radialGradient>
        </defs>
        
        <!-- Enhanced outfit -->
        <ellipse cx="80" cy="96" rx="40" ry="56" fill="url(#aether-skill-gradient)" stroke="#06b6d4" stroke-width="3"/>
        
        <!-- Glowing vision -->
        <circle cx="56" cy="64" r="10" fill="#06b6d4" stroke="white" stroke-width="3"/>
        <text x="56" y="68" text-anchor="middle" fill="white" font-size="8" font-weight="bold">♦</text>
        
        <!-- Active wind swirls -->
        <circle cx="80" cy="80" r="32" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.8" stroke-dasharray="10,5"/>
        
        <!-- Anemo burst effect -->
        <path d="M80 48 Q104 72 80 96 Q56 72 80 48" stroke="#06b6d4" stroke-width="2" fill="none" opacity="0.7"/>
        
        <!-- Wind blade enhanced -->
        <line x1="104" y1="56" x2="120" y2="88" stroke="#06b6d4" stroke-width="4" opacity="1"/>
        <line x1="102" y1="58" x2="118" y2="90" stroke="#a7f3d0" stroke-width="2" opacity="0.8"/>
        
        <!-- Element symbol glowing -->
        <circle cx="136" cy="24" r="14" fill="#06b6d4" opacity="1"/>
        <text x="136" y="28" text-anchor="middle" fill="white" font-size="12" font-weight="bold">A</text>
      </svg>
    `)}`,
    
    burst: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="aether-burst-gradient" cx="50%" cy="30%" r="90%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="30%" stop-color="#22d3ee" stop-opacity="1" />
            <stop offset="70%" stop-color="#67e8f9" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0.8" />
          </radialGradient>
        </defs>
        
        <!-- Transcendent outfit -->
        <ellipse cx="80" cy="96" rx="45" ry="60" fill="url(#aether-burst-gradient)" stroke="#ffffff" stroke-width="4"/>
        
        <!-- Seven-element storm -->
        <circle cx="80" cy="80" r="96" fill="#06b6d4" opacity="0.3"/>
        
        <!-- Elemental burst rays -->
        <line x1="80" y1="80" x2="128" y2="32" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="128" y2="128" stroke="#06b6d4" stroke-width="3"/>
        <line x1="80" y1="80" x2="32" y2="32" stroke="#22d3ee" stroke-width="3"/>
        <line x1="80" y1="80" x2="32" y2="128" stroke="#67e8f9" stroke-width="3"/>
        <line x1="80" y1="80" x2="144" y2="80" stroke="#a7f3d0" stroke-width="3"/>
        <line x1="80" y1="80" x2="16" y2="80" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="80" y2="16" stroke="#06b6d4" stroke-width="3"/>
        
        <!-- Central wind vortex -->
        <circle cx="80" cy="80" r="20" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="15,5"/>
        <circle cx="80" cy="80" r="12" fill="#ffffff" opacity="0.8"/>
        
        <!-- Transcendent vision -->
        <circle cx="56" cy="64" r="14" fill="#ffffff" stroke="#06b6d4" stroke-width="4"/>
        <text x="56" y="70" text-anchor="middle" fill="#06b6d4" font-size="10" font-weight="bold">♦</text>
        
        <!-- Element symbol transcendent -->
        <circle cx="136" cy="24" r="16" fill="#ffffff" opacity="1"/>
        <text x="136" y="30" text-anchor="middle" fill="#06b6d4" font-size="14" font-weight="bold">A</text>
      </svg>
    `)}`
  },

  'belle-hacker': {
    idle: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="belle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" stop-opacity="1" />
            <stop offset="50%" stop-color="#c084fc" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#ddd6fe" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        
        <!-- ZZZ proxy outfit -->
        <rect x="56" y="64" width="48" height="64" fill="url(#belle-gradient)" rx="3.2"/>
        
        <!-- Cyberpunk visor -->
        <rect x="64" y="32" width="32" height="12.8" fill="#8b5cf6" opacity="0.9" rx="1.6"/>
        
        <!-- Data streams -->
        <line x1="24" y1="48" x2="136" y2="48" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="57.6" x2="136" y2="57.6" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="67.2" x2="136" y2="67.2" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="76.8" x2="136" y2="76.8" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="86.4" x2="136" y2="86.4" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="96" x2="136" y2="96" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="105.6" x2="136" y2="105.6" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        <line x1="24" y1="115.2" x2="136" y2="115.2" stroke="#8b5cf6" stroke-width="1" opacity="0.6" stroke-dasharray="8,12"/>
        
        <!-- Hollow interface -->
        <rect x="32" y="40" width="96" height="80" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.4" rx="8"/>
        
        <!-- Element symbol -->
        <circle cx="136" cy="24" r="12.8" fill="#a855f7" opacity="0.8"/>
        <text x="136" y="27.2" text-anchor="middle" fill="white" font-size="9.6" font-weight="bold">E</text>
        
        <!-- Rarity stars -->
        <text x="16" y="152" fill="#ffd700" font-size="8">★★★★★</text>
        
        <!-- Energy meter -->
        <rect x="8" y="48" width="4.8" height="64" fill="rgba(255,255,255,0.3)" rx="2.4"/>
        <rect x="8" y="72" width="4.8" height="40" fill="#8b5cf6" rx="2.4" opacity="0.8"/>
      </svg>
    `)}`,
    
    skill: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="belle-skill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" stop-opacity="1" />
            <stop offset="50%" stop-color="#c084fc" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#ddd6fe" stop-opacity="0.8" />
          </linearGradient>
        </defs>
        
        <!-- Enhanced proxy outfit -->
        <rect x="56" y="64" width="48" height="64" fill="url(#belle-skill-gradient)" rx="3.2" stroke="#8b5cf6" stroke-width="2"/>
        
        <!-- Glowing visor -->
        <rect x="64" y="32" width="32" height="12.8" fill="#8b5cf6" opacity="1" rx="1.6"/>
        
        <!-- Active data streams -->
        <line x1="24" y1="48" x2="136" y2="48" stroke="#8b5cf6" stroke-width="2" opacity="1" stroke-dasharray="4,8"/>
        <line x1="24" y1="57.6" x2="136" y2="57.6" stroke="#c084fc" stroke-width="2" opacity="1" stroke-dasharray="4,8"/>
        <line x1="24" y1="67.2" x2="136" y2="67.2" stroke="#ddd6fe" stroke-width="2" opacity="1" stroke-dasharray="4,8"/>
        
        <!-- Proxy hack effect -->
        <circle cx="80" cy="80" r="64" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.8" stroke-dasharray="20,10"/>
        
        <!-- Digital surge -->
        <rect x="70" y="70" width="20" height="20" fill="#8b5cf6" opacity="0.6"/>
        <rect x="74" y="74" width="12" height="12" fill="#c084fc" opacity="0.8"/>
        
        <!-- Active interface -->
        <rect x="32" y="40" width="96" height="80" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.8" rx="8"/>
        
        <!-- Element symbol glowing -->
        <circle cx="136" cy="24" r="14" fill="#8b5cf6" opacity="1"/>
        <text x="136" y="28" text-anchor="middle" fill="white" font-size="12" font-weight="bold">E</text>
      </svg>
    `)}`,
    
    burst: `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="belle-burst-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="30%" stop-color="#a855f7" stop-opacity="1" />
            <stop offset="70%" stop-color="#c084fc" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#ddd6fe" stop-opacity="0.8" />
          </linearGradient>
        </defs>
        
        <!-- System override explosion -->
        <circle cx="80" cy="80" r="96" fill="#8b5cf6" opacity="0.3"/>
        
        <!-- Transcendent outfit -->
        <rect x="56" y="64" width="48" height="64" fill="url(#belle-burst-gradient)" rx="3.2" stroke="#ffffff" stroke-width="4"/>
        
        <!-- Reality hack rays -->
        <line x1="80" y1="80" x2="128" y2="32" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="128" y2="128" stroke="#8b5cf6" stroke-width="3"/>
        <line x1="80" y1="80" x2="32" y2="32" stroke="#a855f7" stroke-width="3"/>
        <line x1="80" y1="80" x2="32" y2="128" stroke="#c084fc" stroke-width="3"/>
        <line x1="80" y1="80" x2="144" y2="80" stroke="#ddd6fe" stroke-width="3"/>
        <line x1="80" y1="80" x2="16" y2="80" stroke="#ffffff" stroke-width="3"/>
        <line x1="80" y1="80" x2="80" y2="16" stroke="#8b5cf6" stroke-width="3"/>
        
        <!-- Central data core -->
        <rect x="70" y="70" width="20" height="20" fill="#ffffff" opacity="0.9"/>
        <rect x="74" y="74" width="12" height="12" fill="#8b5cf6" opacity="1"/>
        
        <!-- Zenless awakening visor -->
        <rect x="64" y="32" width="32" height="16" fill="#ffffff" opacity="1" rx="2"/>
        
        <!-- Element symbol transcendent -->
        <circle cx="136" cy="24" r="16" fill="#ffffff" opacity="1"/>
        <text x="136" y="30" text-anchor="middle" fill="#8b5cf6" font-size="14" font-weight="bold">E</text>
      </svg>
    `)}`
  }
};

// Character sprite component that uses persistent assets
export function CharacterSprite({ 
  characterName, 
  state = 'idle', 
  size = 160 
}: { 
  characterName: string; 
  state?: 'idle' | 'skill' | 'burst'; 
  size?: number;
}) {
  const spriteKey = characterName.toLowerCase().replace(/\s+/g, '-');
  const sprite = CharacterSprites[spriteKey as keyof typeof CharacterSprites];
  
  if (!sprite || !sprite[state]) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center"
      >
        <span className="text-white/60 text-sm">Character</span>
      </div>
    );
  }
  
  return (
    <img 
      src={sprite[state]}
      alt={`${characterName} ${state}`}
      width={size}
      height={size}
      style={{
        filter: state === 'burst' ? 'brightness(1.2) contrast(1.1)' : 
                state === 'skill' ? 'brightness(1.1)' : 'none'
      }}
      className="transition-all duration-300"
    />
  );
}