import React from 'react';
import { IntelligentTooltip } from './intelligent-tooltip';

interface WordTagConfig {
  word: string;
  category: 'tech' | 'concept' | 'humor' | 'gaming' | 'error' | 'loading' | 'deprecated' | 'success';
  definition: string;
  context?: string;
  relatedTerms?: string[];
  funFact?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Comprehensive word database for auto-tagging
const wordDatabase: WordTagConfig[] = [
  // Technology Terms
  { word: 'React', category: 'tech', definition: 'A JavaScript library for building user interfaces', difficulty: 'intermediate' },
  { word: 'Node.js', category: 'tech', definition: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine', difficulty: 'intermediate' },
  { word: 'TypeScript', category: 'tech', definition: 'Typed superset of JavaScript that compiles to plain JavaScript', difficulty: 'intermediate' },
  { word: 'Proxmox', category: 'tech', definition: 'Open-source virtualization management platform', difficulty: 'expert' },
  { word: 'Ansible', category: 'tech', definition: 'Open-source automation tool for configuration management', difficulty: 'advanced' },
  { word: 'Terraform', category: 'tech', definition: 'Infrastructure as Code tool for building and managing infrastructure', difficulty: 'advanced' },
  { word: 'Docker', category: 'tech', definition: 'Platform for developing, shipping, and running applications in containers', difficulty: 'intermediate' },
  { word: 'Kubernetes', category: 'tech', definition: 'Open-source container orchestration platform', difficulty: 'expert' },
  { word: 'PostgreSQL', category: 'tech', definition: 'Advanced open-source relational database', difficulty: 'intermediate' },
  { word: 'MongoDB', category: 'tech', definition: 'NoSQL document-oriented database program', difficulty: 'intermediate' },
  { word: 'Tailwind CSS', category: 'tech', definition: 'Utility-first CSS framework', difficulty: 'beginner' },
  { word: 'Vite', category: 'tech', definition: 'Fast build tool for modern web development', difficulty: 'intermediate' },
  { word: 'Cloudflare', category: 'tech', definition: 'Web infrastructure and security company', difficulty: 'intermediate' },
  
  // Concept Terms
  { word: 'VibeCoding', category: 'concept', definition: 'Philosophical development methodology balancing technical excellence with conscious intention', difficulty: 'advanced' },
  { word: 'Consciousness', category: 'concept', definition: 'State of being aware and having subjective experiences', difficulty: 'expert' },
  { word: 'Quantum', category: 'concept', definition: 'Relating to quantum mechanics and discrete energy levels', difficulty: 'expert' },
  { word: 'Glassmorphism', category: 'concept', definition: 'UI design trend featuring semi-transparent backgrounds with blur effects', difficulty: 'beginner' },
  { word: 'Meta-recursive', category: 'concept', definition: 'Self-referential structures that examine or modify themselves', difficulty: 'advanced' },
  { word: 'Infrastructure', category: 'concept', definition: 'Fundamental facilities and systems serving a project or organization', difficulty: 'intermediate' },
  { word: 'Virtualization', category: 'concept', definition: 'Creating virtual versions of computing resources', difficulty: 'intermediate' },
  { word: 'Authentication', category: 'concept', definition: 'Process of verifying the identity of users or systems', difficulty: 'intermediate' },
  { word: 'Orchestration', category: 'concept', definition: 'Automated coordination and management of complex systems', difficulty: 'advanced' },
  
  // Gaming Terms
  { word: 'VRChat', category: 'gaming', definition: 'Virtual reality social platform for user interaction and content creation', difficulty: 'beginner' },
  { word: 'Fighting Games', category: 'gaming', definition: 'Video game genre featuring combat between limited characters', difficulty: 'beginner' },
  { word: 'Frame Data', category: 'gaming', definition: 'Timing information for moves in fighting games', difficulty: 'advanced' },
  { word: 'Optimization', category: 'gaming', definition: 'Process of improving performance and efficiency', difficulty: 'intermediate' },
  { word: 'Konami Code', category: 'gaming', definition: 'Famous cheat code sequence in video games', difficulty: 'beginner', funFact: 'Up, Up, Down, Down, Left, Right, Left, Right, B, A' },
  
  // Humor/Easter Egg Terms
  { word: 'Stack Overflow', category: 'humor', definition: 'Programming Q&A site where developers copy-paste solutions', difficulty: 'beginner', funFact: 'Every developer\'s best friend' },
  { word: 'Git Commit', category: 'humor', definition: 'Saving changes to version control, often with amusing messages', difficulty: 'beginner' },
  { word: 'Coffee', category: 'humor', definition: 'Essential fuel for programming sessions', difficulty: 'beginner', funFact: 'Converts caffeine to code' },
  { word: 'Pizza Kitchen', category: 'humor', definition: 'Source of authentic work ethic and reliability training', difficulty: 'beginner', funFact: 'Where legendary consistency is forged' },
  
  // Error Terms
  { word: 'Syntax Error', category: 'error', definition: 'Programming error due to incorrect language syntax', difficulty: 'beginner' },
  { word: '404', category: 'error', definition: 'HTTP status code for resource not found', difficulty: 'beginner' },
  { word: 'Segmentation Fault', category: 'error', definition: 'Memory access violation error', difficulty: 'intermediate' },
  { word: 'Null Pointer', category: 'error', definition: 'Reference to a memory location that doesn\'t exist', difficulty: 'intermediate' },
  
  // Loading/Status Terms
  { word: 'Loading', category: 'loading', definition: 'State indicating data or resources are being fetched', difficulty: 'beginner' },
  { word: 'Buffering', category: 'loading', definition: 'Temporarily storing data while it\'s being transferred', difficulty: 'beginner' },
  { word: 'Async', category: 'loading', definition: 'Asynchronous operations that don\'t block execution', difficulty: 'intermediate' },
  
  // Deprecated Terms
  { word: 'jQuery', category: 'deprecated', definition: 'JavaScript library popular before modern frameworks', difficulty: 'beginner', funFact: 'Made JavaScript tolerable in the early 2000s' },
  { word: 'Flash', category: 'deprecated', definition: 'Adobe multimedia platform, discontinued in 2020', difficulty: 'beginner' },
  { word: 'Internet Explorer', category: 'deprecated', definition: 'Microsoft web browser, finally retired in 2022', difficulty: 'beginner' },
  
  // Success Terms
  { word: 'Production', category: 'success', definition: 'Live environment where applications serve real users', difficulty: 'intermediate' },
  { word: 'Deploy', category: 'success', definition: 'Process of releasing software to production environment', difficulty: 'intermediate' },
  { word: 'Optimization', category: 'success', definition: 'Improving performance, efficiency, or effectiveness', difficulty: 'intermediate' }
];

interface QuantumWordTaggerProps {
  children: string;
  enableAutoTagging?: boolean;
  customTags?: WordTagConfig[];
}

export function QuantumWordTagger({ 
  children, 
  enableAutoTagging = true, 
  customTags = [] 
}: QuantumWordTaggerProps) {
  if (!enableAutoTagging) {
    return <>{children}</>;
  }

  const allTags = [...wordDatabase, ...customTags];
  
  // Create a map for faster lookup
  const tagMap = new Map<string, WordTagConfig>();
  allTags.forEach(tag => {
    tagMap.set(tag.word.toLowerCase(), tag);
  });

  // Process text to identify and tag words
  const processText = (text: string): React.ReactNode[] => {
    // Split by words while preserving punctuation and spaces
    const words = text.split(/(\s+|[^\w\s])/);
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
      const tagConfig = tagMap.get(cleanWord);
      
      if (tagConfig && word.trim()) {
        const tooltipData = {
          term: tagConfig.word,
          category: tagConfig.category,
          definition: tagConfig.definition,
          context: tagConfig.context,
          relatedTerms: tagConfig.relatedTerms,
          funFact: tagConfig.funFact,
          difficulty: tagConfig.difficulty
        };
        
        return (
          <IntelligentTooltip key={index} tooltipData={tooltipData}>
            {word}
          </IntelligentTooltip>
        );
      }
      
      return <span key={index}>{word}</span>;
    });
  };

  return <>{processText(children)}</>;
}

// Helper function to manually tag specific terms
export function tagTerm(
  text: string, 
  category: WordTagConfig['category'],
  definition: string,
  options?: Partial<WordTagConfig>
) {
  const tooltipData = {
    term: text,
    category,
    definition,
    ...options
  };
  
  return (
    <IntelligentTooltip tooltipData={tooltipData}>
      {text}
    </IntelligentTooltip>
  );
}

// Preset tagging functions for common categories
export const TechTag = (text: string, definition: string, options?: Partial<WordTagConfig>) => 
  tagTerm(text, 'tech', definition, options);

export const ConceptTag = (text: string, definition: string, options?: Partial<WordTagConfig>) => 
  tagTerm(text, 'concept', definition, options);

export const HumorTag = (text: string, definition: string, options?: Partial<WordTagConfig>) => 
  tagTerm(text, 'humor', definition, options);

export const GamingTag = (text: string, definition: string, options?: Partial<WordTagConfig>) => 
  tagTerm(text, 'gaming', definition, options);

export default QuantumWordTagger;