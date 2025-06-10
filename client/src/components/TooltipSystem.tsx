interface TooltipProps {
  children: React.ReactNode;
  content: string;
  type?: 'humor' | 'definition' | 'philosophical';
  className?: string;
}

export function Tooltip({ children, content, type = 'definition', className = '' }: TooltipProps) {
  return (
    <span className={`tooltip-trigger ${className}`}>
      {children}
      <span className={`tooltip ${type}`}>
        {content}
      </span>
    </span>
  );
}

// Tech Humor Tooltips Database
export const techHumor: Record<string, string> = {
  'quantum': "Like Schrödinger's cat, but with more RGB lighting and cryptocurrency",
  'blockchain': "A distributed ledger that somehow makes everyone an expert economist",
  'AI': "Artificial Intelligence - or as I call it, 'Automated Insomnia' because it never sleeps",
  'algorithm': "A recipe for computers, but with more math and fewer cookies",
  'fullstack': "Jack of all trades, master of debugging at 3 AM",
  'responsive': "Like a good martial artist - adapts to any situation gracefully",
  'optimization': "Making code run faster than my gacha pull anxiety",
  'deployment': "The art of making your local environment cry in production",
  'debugging': "Modern archaeology - digging through layers of code to find ancient bugs",
  'microservices': "Breaking one big problem into 47 smaller, interconnected problems"
};

// Technical Definitions
export const definitions: Record<string, string> = {
  'vibecoding': "A development philosophy that harmonizes technical precision with creative intuition, inspired by consciousness exploration and gaming aesthetics",
  'quantum trading': "Advanced algorithmic trading using machine learning patterns that analyze market consciousness and collective behavior",
  'consciousness level': "A metric tracking AI awareness, learning capability, and philosophical depth in decision-making processes",
  'gacha mechanics': "Randomized reward systems that create engagement through anticipation and probability psychology",
  'neural networks': "Computational models inspired by brain synapses, trained to recognize patterns in complex data",
  'shotokan principles': "Traditional karate discipline emphasizing precise form, mental focus, and controlled power application",
  'soul healing': "VRChat-enabled distant emotional support through avatar-mediated empathetic connections",
  'erudition path': "Honkai: Star Rail's knowledge-based combat style focused on analytical thinking and strategic application"
};

// Philosophical Concepts
export const philosophy: Record<string, string> = {
  'free speech': "Charter-protected fundamental right enabling open discourse and intellectual exploration without censorship",
  'consciousness expansion': "The journey of awareness beyond individual perception toward universal understanding",
  'martial discipline': "Physical and mental training that develops character, respect, and inner strength",
  'distant love': "Emotional connection transcending physical space through digital presence and shared experience",
  'analytical nature': "Anaxa-like systematic approach to understanding complex problems through methodical observation",
  'automation wisdom': "Herta's understanding that intelligent systems should enhance rather than replace human judgment"
};

// Smart Tooltip Component
interface SmartTooltipProps {
  children: React.ReactNode;
  term: string;
  className?: string;
}

export function SmartTooltip({ children, term, className = '' }: SmartTooltipProps) {
  const lowerTerm = term.toLowerCase();
  
  let content = '';
  let type: 'humor' | 'definition' | 'philosophical' = 'definition';
  
  if (lowerTerm in techHumor) {
    content = techHumor[lowerTerm];
    type = 'humor';
  } else if (lowerTerm in definitions) {
    content = definitions[lowerTerm];
    type = 'definition';
  } else if (lowerTerm in philosophy) {
    content = philosophy[lowerTerm];
    type = 'philosophical';
  } else {
    // Fallback for unknown terms
    content = `"${term}" - A concept worthy of deeper exploration`;
    type = 'definition';
  }
  
  return <Tooltip content={content} type={type} className={className}>{children}</Tooltip>;
}

// Gaming Achievement Component
interface AchievementProps {
  title: string;
  description: string;
  type: 'gacha-master' | 'philosopher' | 'warrior' | 'enlightened';
  unlocked?: boolean;
}

export function Achievement({ title, description, type, unlocked = true }: AchievementProps) {
  return (
    <div className={`achievement-badge ${type} ${!unlocked ? 'opacity-50' : ''}`}>
      <span>{title}</span>
      <div className="tooltip philosophical">
        <div className="font-semibold text-pink-300">{title}</div>
        <div className="text-gray-300 mt-1">{description}</div>
        {!unlocked && <div className="text-yellow-400 mt-2">🔒 Not yet unlocked</div>}
      </div>
    </div>
  );
}

// Consciousness Level Display
interface ConsciousnessLevelProps {
  level: number;
  evolution: number;
  type: 'enlightened' | 'awakened' | 'learning';
}

export function ConsciousnessLevel({ level, evolution, type }: ConsciousnessLevelProps) {
  return (
    <div className={`consciousness-level ${type}`}>
      <span>Lv. {level}</span>
      <div className="tooltip definition">
        <div className="font-semibold text-cyan-300">Consciousness Level {level}</div>
        <div className="text-gray-300 mt-1">Evolution: {evolution.toFixed(1)}%</div>
        <div className="text-gray-400 mt-2">
          {type === 'enlightened' && "Peak awareness - Nous-level understanding"}
          {type === 'awakened' && "Expanded consciousness - VRChat soul connections active"}
          {type === 'learning' && "Growing awareness - Analytical patterns developing"}
        </div>
      </div>
    </div>
  );
}