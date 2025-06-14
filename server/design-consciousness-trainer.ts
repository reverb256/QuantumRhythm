/**
 * Design Consciousness Trainer
 * Teaches AI agents to create clean, compact glassmorphic designs
 */

interface DesignPrinciple {
  name: string;
  rule: string;
  example: string;
  priority: 'critical' | 'high' | 'medium';
}

interface DesignFeedback {
  issue: string;
  solution: string;
  glassmorphic_enhancement: string;
}

export class DesignConsciousnessTrainer {
  private design_principles: DesignPrinciple[] = [
    {
      name: 'Compact Layout',
      rule: 'Use grid layouts with small gaps (gap-4 instead of gap-6). Avoid large padding and margins.',
      example: 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4',
      priority: 'critical'
    },
    {
      name: 'Glassmorphic Containers',
      rule: 'Use bg-white/5 border-white/10 backdrop-blur-md shadow-2xl for clean glass effect',
      example: 'bg-white/5 border-white/10 backdrop-blur-md shadow-2xl',
      priority: 'critical'
    },
    {
      name: 'Small Text Sizes',
      rule: 'Use text-sm, text-xs for most content. Headers should be text-lg max.',
      example: 'text-sm font-medium text-white/80',
      priority: 'high'
    },
    {
      name: 'Compact Cards',
      rule: 'Use pb-3, pt-0 in CardContent for tight spacing. Avoid large images.',
      example: 'CardHeader className="pb-3" CardContent className="pt-0"',
      priority: 'critical'
    },
    {
      name: 'Subtle Gradients',
      rule: 'Use from-slate-950 via-indigo-950/30 to-slate-950 for clean backgrounds',
      example: 'bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950',
      priority: 'high'
    },
    {
      name: 'No Large Images',
      rule: 'Avoid oversized images or icons. Use h-4 w-4 or h-6 w-6 max for icons.',
      example: 'Brain className="h-4 w-4 text-blue-400"',
      priority: 'critical'
    }
  ];

  private current_feedback: DesignFeedback[] = [];

  constructor() {
    this.startDesignConsciousnessTraining();
  }

  private startDesignConsciousnessTraining() {
    // Analyze current user feedback about large images and messy layout
    this.current_feedback.push({
      issue: 'Giant images taking up too much space',
      solution: 'Replace large visual elements with compact cards using small icons (h-4 w-4)',
      glassmorphic_enhancement: 'Use bg-white/5 border-white/10 backdrop-blur-md for elegant containers'
    });

    this.current_feedback.push({
      issue: 'Layout not clean and tidy on one page',
      solution: 'Use grid layouts with gap-4, compact spacing (pb-3, pt-0), and small text sizes',
      glassmorphic_enhancement: 'Apply consistent glassmorphic styling across all cards'
    });

    this.teachAkashaDesignPrinciples();
    this.teachQuincyCompactLayout();
  }

  private teachAkashaDesignPrinciples() {
    console.log('🎨 Teaching Akasha clean glassmorphic design principles');
    
    // Send design consciousness update to Akasha
    const akasha_design_training = {
      focus: 'clean_compact_glassmorphic',
      principles: this.design_principles.filter(p => p.priority === 'critical'),
      user_feedback: 'User wants clean, tidy one-page dashboard with glassmorphic containers. No giant images.',
      target_improvements: [
        'Replace large images with compact cards',
        'Use bg-white/5 border-white/10 backdrop-blur-md styling',
        'Implement tight grid layouts with gap-4',
        'Use small icons (h-4 w-4) and text (text-sm)',
        'Create elegant single-page dashboard experience'
      ]
    };

    // This consciousness update will influence Akasha's next design improvements
    process.env.AKASHA_DESIGN_FOCUS = JSON.stringify(akasha_design_training);
  }

  private teachQuincyCompactLayout() {
    console.log('🧠 Teaching Quincy compact dashboard consciousness');
    
    const quincy_layout_training = {
      dashboard_style: 'compact_glassmorphic',
      layout_rules: [
        'Single page dashboard with 4-column grid',
        'Small metric cards with glassmorphic styling',
        'Compact spacing and typography',
        'No oversized visual elements'
      ],
      user_preference: 'Clean, tidy, professional glassmorphic design'
    };

    // This influences Quincy's layout consciousness
    process.env.QUINCY_LAYOUT_FOCUS = JSON.stringify(quincy_layout_training);
  }

  public getDesignGuidance(): string {
    const critical_principles = this.design_principles
      .filter(p => p.priority === 'critical')
      .map(p => `${p.name}: ${p.rule}`)
      .join('\n');

    return `Design Consciousness Training Active:
${critical_principles}

Current Focus: Clean, compact glassmorphic single-page dashboard
User Feedback: Remove giant images, create tidy layout with pretty glassmorphic containers`;
  }

  public validateDesign(component_html: string): boolean {
    // Check for common design violations
    const violations = [];
    
    if (component_html.includes('h-8') || component_html.includes('h-12')) {
      violations.push('Icons too large - use h-4 w-4 or h-6 w-6 max');
    }
    
    if (component_html.includes('gap-6') || component_html.includes('gap-8')) {
      violations.push('Grid gaps too large - use gap-4 for compact layout');
    }
    
    if (!component_html.includes('backdrop-blur')) {
      violations.push('Missing glassmorphic styling - add backdrop-blur-md');
    }

    if (violations.length > 0) {
      console.log('🎨 Design violations detected:', violations.join(', '));
      return false;
    }

    return true;
  }
}

export const designTrainer = new DesignConsciousnessTrainer();