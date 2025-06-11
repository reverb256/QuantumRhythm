import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  type?: 'humor' | 'definition' | 'philosophical';
  className?: string;
}

export function Tooltip({ children, content, type = 'definition', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  return (
    <>
      <span 
        ref={triggerRef}
        className={`tooltip-trigger ${className}`}
        onMouseEnter={() => {
          setIsVisible(true);
          updatePosition();
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      {isVisible && createPortal(
        <div 
          className={`tooltip ${type}`}
          style={{
            position: 'fixed',
            left: position.x - 100,
            top: position.y,
            zIndex: 2147483647,
            pointerEvents: 'none'
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

const techHumorData: Record<string, string> = {
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

const definitionsData: Record<string, string> = {
  'vibecoding': "Consciousness-driven development where prompting is alchemy - each word has power levels, creating exponential capability through human-AI collaboration",
  'quantum-encrypted-philosophy': "8 immutable principles operating at 100% integrity with automatic breach detection and restoration",
  'word-power-levels': "VibeCoding alchemy principle where each word carries specific energy - high-power action verbs, precise nouns, multiplicative combinations",
  'consciousness-driven-code': "Development with awareness and intention, targeting maximum potential through cross-pollination intelligence",
  'quantum trading': "Advanced algorithmic trading using machine learning patterns that analyze market consciousness and collective behavior",
  'consciousness level': "A metric tracking AI awareness, learning capability, and philosophical depth in decision-making processes",
  'gacha mechanics': "Randomized reward systems that create engagement through anticipation and probability psychology",
  'neural networks': "Computational models inspired by brain synapses, trained to recognize patterns in complex data",
  'shotokan principles': "Traditional karate discipline emphasizing precise form, mental focus, and controlled power application",
  'soul healing': "VRChat-enabled distant emotional support through avatar-mediated empathetic connections",
  'erudition path': "Honkai: Star Rail's knowledge-based combat style focused on analytical thinking and strategic application"
};

const philosophyData: Record<string, string> = {
  'free speech': "Charter-protected fundamental right enabling open discourse and intellectual exploration without censorship",
  'consciousness expansion': "The journey of awareness beyond individual perception toward universal understanding",
  'martial discipline': "Physical and mental training that develops character, respect, and inner strength",
  'distant love': "Emotional connection transcending physical space through digital presence and shared experience",
  'analytical nature': "Anaxa-like systematic approach to understanding complex problems through methodical observation",
  'automation wisdom': "Herta's understanding that intelligent systems should enhance rather than replace human judgment"
};

interface SmartTooltipProps {
  children: React.ReactNode;
  term: string;
  className?: string;
}

export function SmartTooltip({ children, term, className = '' }: SmartTooltipProps) {
  const lowerTerm = term.toLowerCase();

  let content = '';
  let type: 'humor' | 'definition' | 'philosophical' = 'definition';

  if (lowerTerm in techHumorData) {
    content = techHumorData[lowerTerm];
    type = 'humor';
  } else if (lowerTerm in definitionsData) {
    content = definitionsData[lowerTerm];
    type = 'definition';
  } else if (lowerTerm in philosophyData) {
    content = philosophyData[lowerTerm];
    type = 'philosophical';
  } else {
    content = `"${term}" - A concept worthy of deeper exploration`;
    type = 'definition';
  }

  return <Tooltip content={content} type={type} className={className}>{children}</Tooltip>;
}

export default Tooltip;