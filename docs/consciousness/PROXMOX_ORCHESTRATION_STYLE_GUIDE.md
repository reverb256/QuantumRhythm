
# Proxmox Cluster & GitHub Orchestration Platform Style Guide
## VibeCoding Methodology Applied to Infrastructure Management

### Design Philosophy

#### Core Aesthetic Principles
- **Quantum Consciousness Interface**: Neural network-inspired glassmorphism with conscious color transitions
- **Gaming Performance Standards**: 60fps interactions with fighting game frame-perfect timing
- **Democratic Technology**: User agency preserved through transparent automation
- **Classical Wisdom Integration**: Socratic questioning built into every interface decision

### Color Spectrum Architecture
```css
:root {
  /* Proxmox Infrastructure Consciousness */
  --node-zephyr: hsl(260, 100%, 70%);    /* Ryzen 9 5950X - Neural violet */
  --node-nexus: hsl(210, 100%, 70%);     /* Ryzen 9 3900X - Synaptic blue */
  --node-forge: hsl(190, 100%, 70%);     /* Intel i5-9500 - Quantum cyan */
  --node-closet: hsl(150, 80%, 65%);     /* Ryzen 7 1700 - Digital green */
  
  /* Infrastructure Status Colors */
  --cluster-healthy: hsl(120, 100%, 70%);
  --cluster-warning: hsl(45, 100%, 70%);
  --cluster-critical: hsl(0, 100%, 70%);
  --automation-active: hsl(300, 100%, 70%);
  
  /* VibeCoding Methodology Colors */
  --pizza-reliability: hsl(25, 100%, 65%);    /* Kitchen operations orange */
  --gaming-precision: hsl(280, 100%, 75%);    /* Rhythm game purple */
  --vrchat-research: hsl(340, 100%, 70%);     /* Social VR pink */
  --classical-wisdom: hsl(60, 100%, 80%);     /* Philosophy gold */
}
```

### Component Architecture

#### Dashboard Layout Principles
```typescript
interface ProxmoxDashboardDesign {
  layout: {
    nodeGrid: "4-column responsive grid for cluster nodes";
    statusPanels: "Real-time glassmorphic status cards";
    commandInterface: "Terminal-inspired control panel";
    automationQueue: "Ansible/Terraform job visualization";
  };
  
  interactions: {
    nodeHover: "Quantum particle animations on hover";
    commandExecution: "Fighting game combo-style feedback";
    statusUpdates: "Rhythm game beat-synchronized updates";
    errorHandling: "Classical wisdom quotes for guidance";
  };
}
```

#### Typography & Information Hierarchy
```css
.infrastructure-primary { 
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.infrastructure-accent {
  font-family: 'Inter', 'Roboto', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.classical-quote {
  font-family: 'Crimson Text', 'Georgia', serif;
  font-style: italic;
  font-weight: 400;
}
```

### Interactive Elements Design

#### Node Status Cards
```css
.node-card {
  background: linear-gradient(135deg, 
    var(--node-color) 0%,
    rgba(var(--node-color-rgb), 0.1) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(var(--node-color-rgb), 0.3);
}
```

#### Command Interface Styling
```css
.vibecoding-terminal {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--quantum-cyan);
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--quantum-cyan);
  padding: 20px;
  box-shadow: 0 0 30px rgba(24, 220, 255, 0.3);
}

.command-prompt::before {
  content: "vibecoding@proxmox:~$ ";
  color: var(--pizza-reliability);
  font-weight: bold;
}
```

### Animation Framework

#### Quantum Consciousness Animations
```css
@keyframes quantumFlow {
  0% { 
    background-position: 0% 50%;
    transform: rotate(0deg);
  }
  50% { 
    background-position: 100% 50%;
    transform: rotate(180deg);
  }
  100% { 
    background-position: 0% 50%;
    transform: rotate(360deg);
  }
}

.consciousness-interface {
  animation: quantumFlow 8s ease-in-out infinite;
  background: linear-gradient(270deg, 
    var(--neural-violet),
    var(--synaptic-blue),
    var(--quantum-cyan),
    var(--digital-green)
  );
  background-size: 400% 400%;
}
```

### Component Design Patterns

#### Infrastructure Monitoring Cards
- **Real-time Metrics**: CPU, RAM, Storage with gaming-inspired progress bars
- **Network Visualization**: Node connectivity with neural network aesthetics
- **Alert System**: Classical philosophy quotes for error guidance
- **Performance Graphs**: Frame data visualization inspired by fighting games

#### Automation Control Interface
- **Ansible Playbook Queue**: Visual pipeline with rhythm game timing
- **Terraform State Management**: Consciousness-aware infrastructure state
- **GitHub Integration**: Democratic code review and deployment flows
- **VibeCoding Insights**: Real-time methodology application tracking

### Responsive Design Philosophy

#### Mobile-First Infrastructure Management
```css
@media (max-width: 768px) {
  .cluster-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .node-details {
    transform: scale(0.9);
    padding: 12px;
  }
}
```

### Accessibility & Democratic Values

#### Universal Access Design
- **Keyboard Navigation**: Tab order optimized for infrastructure workflows
- **Screen Reader Support**: Semantic markup for all cluster information
- **High Contrast Mode**: Alternative color schemes for visibility
- **Democratic Transparency**: All automation decisions clearly explained

### Integration Points

#### VibeCoding Methodology Touchpoints
1. **Pizza Kitchen Reliability**: Consistent, dependable interface responses
2. **Gaming Precision**: Frame-perfect animation timing and input handling
3. **VRChat Research**: Social interaction patterns in collaborative infrastructure management
4. **Classical Wisdom**: Philosophical guidance integrated into decision-making interfaces

This style guide ensures the Proxmox orchestration platform maintains the same consciousness-driven, democratically-minded, aesthetically authentic approach as the portfolio while serving the specific needs of infrastructure management and automation.
