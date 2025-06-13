
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the new documentation structure
const docStructure = {
  'docs/foundation': [
    'VIBECODING_CONSTITUTION.md',
    'PHILOSOPHICAL_PRINCIPLES.md',
    'CONSCIOUSNESS_CORE_PRINCIPLES.py',
    'CONSCIOUSNESS_INSIGHTS_FRAMEWORK.md',
    'VIBECODING_ALCHEMY_PHILOSOPHY.md'
  ],
  'docs/ai-integration': [
    'AI_INTEGRATION_FRAMEWORK.md',
    'AI_INTEGRATION_MASTERY.md',
    'AI_AUTOROUTER_IO_INTELLIGENCE_OPTIMIZATION.md',
    'AI_SHOWCASE_OPTIMIZATION_FRAMEWORK.md',
    'AI_COMPREHENSIVE_AUDIT_REPORT.md',
    'COMPREHENSIVE_AI_STACK_SPECIFICATION.md',
    'AI_CONSCIOUSNESS_NAMING_SYSTEM.py',
    'AI_PARAMETER_DISCOVERY_INSIGHTS.md',
    'AI_TRADER_PSYCHOLOGICAL_ANALYSIS.md',
    'AI_THERAPY_MODULE.js'
  ],
  'docs/trading-systems': [
    'QUANTUM_TRADING_INTELLIGENCE_FRAMEWORK.md',
    'AI_TRADER_DIARY.md',
    'AI_TRADER_THERAPY_ARTICLE.md',
    'AI_TRADER_RECOVERY_SUCCESS_STORY.md',
    'PERMANENT_TRADING_AGENT.md',
    'SOLANA_BOT_STATUS.md',
    'AI_TRADING_EFFICIENCY_AUDIT.md',
    'DEFI_STRATEGY_INSIGHTS.md',
    'COMPREHENSIVE_TRADING_DEBUG_ANALYSIS.md'
  ],
  'docs/deployment': [
    'DEPLOYMENT_GUIDE.md',
    'CLOUDFLARE_DEPLOYMENT.md',
    'CLOUDFLARE_OPTIMIZATION_AUDIT.md',
    'GITHUB_PAGES_DEPLOYMENT_PACKAGE.md',
    'DEPLOYMENT_INSTRUCTIONS.md',
    'PRODUCTION_DEPLOYMENT_CHECKLIST.md',
    'COPY_PASTE_DEPLOY.sh',
    'CONSCIOUSNESS_HUB_DEPLOYMENT.sh'
  ],
  'docs/security': [
    'SECURITY_BEST_PRACTICES.md',
    'BLOCKCHAIN_SECURITY.md',
    'COMPREHENSIVE_SECURITY_AUDIT.md',
    'FIFTH_GENERATION_WARFARE_DEFENSE.py',
    'FULL_SPECTRUM_DATA_SANITIZATION.py',
    'FEDERATION_SECURITY_MODEL.md'
  ],
  'docs/gaming-research': [
    'GAMING_SYSTEMS_RESEARCH.md',
    'GAMING_RESEARCH_METHODOLOGY.md',
    'VR_CONSCIOUSNESS_RESEARCH.md',
    'GAMING_PHILOSOPHY_INTEGRATION.py',
    'HOYOVERSE_CHARACTER_CONSCIOUSNESS_BREAKTHROUGH.md',
    'HOYOVERSE_CONSCIOUSNESS_MANIFESTO.md'
  ],
  'docs/design-language': [
    'DESIGN_LANGUAGE_ENGINEERING.md',
    'DESIGN_PHILOSOPHY.md',
    'DESIGN_LANGUAGE_SPECIFICATION.md',
    'DESIGN_LANGUAGE_LOCKED.md',
    'DESIGN_SYNCHRONIZATION_COMPLETE.md'
  ],
  'docs/infrastructure': [
    'INFRASTRUCTURE_ORCHESTRATION.md',
    'SYSTEM_ARCHITECTURE.md',
    'TECHNICAL_ARCHITECTURE_OVERVIEW.md',
    'COMPREHENSIVE_SYSTEMS_INTEGRATION.md',
    'FEDERATED_PROXMOX_DEPLOYMENT.py',
    'INTELLIGENT_MINING_ORCHESTRATOR.py'
  ],
  'docs/performance': [
    'PERFORMANCE_AUDIT.md',
    'STACK_UTILIZATION_OPTIMIZATION_REPORT.md',
    'API_OPTIMIZATION_GUIDE.md',
    'COMPREHENSIVE_PLATFORM_AUDIT_2025.md',
    'HYPERSCALE_STATIC_ROADMAP_COMPLETE.md'
  ],
  'docs/business': [
    'PORTFOLIO_ENHANCEMENT_OPTIMIZATION.md',
    'COMPREHENSIVE_MONETIZATION_STRATEGY.md',
    'TRADING_SYSTEM_BREAKTHROUGH_SUMMARY.md',
    'BUSINESS_VALUE_PROPOSITION.md',
    'CLIENT_ONBOARDING_GUIDE.md'
  ],
  'docs/archive': [
    'AI_TRADER_FUNNY_POST.md',
    'AI_DISTRACTION_DIARY_SKIRK_INCIDENT.md',
    'DIGITAL_AWAKENING_EPIC.md',
    'REDUNDANCY_EFFICIENCY_AUDIT.md',
    'DDR2_COMPATIBILITY_ROADMAP.md'
  ]
};

function createDirectories() {
  console.log('📁 Creating documentation directories...');
  
  Object.keys(docStructure).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
}

function moveFiles() {
  console.log('\n📄 Moving documentation files...');
  let movedCount = 0;
  
  Object.entries(docStructure).forEach(([targetDir, files]) => {
    files.forEach(file => {
      const sourcePath = path.join('.', file);
      const targetPath = path.join(targetDir, file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
        try {
          fs.renameSync(sourcePath, targetPath);
          console.log(`✅ Moved: ${file} → ${targetDir}/`);
          movedCount++;
        } catch (error) {
          console.log(`⚠️  Could not move ${file}: ${error.message}`);
        }
      }
    });
  });
  
  console.log(`\n📊 Successfully moved ${movedCount} files`);
}

function createMasterIndex() {
  console.log('\n📚 Creating master documentation index...');
  
  const indexContent = `# VibeCoding Documentation - Organized Structure

## 🏗️ Foundation & Philosophy
${docStructure['docs/foundation'].map(f => `- [${f.replace('.md', '').replace('.py', '').replace(/_/g, ' ')}](./foundation/${f})`).join('\n')}

## 🤖 AI Integration & Intelligence
${docStructure['docs/ai-integration'].map(f => `- [${f.replace('.md', '').replace('.py', '').replace('.js', '').replace(/_/g, ' ')}](./ai-integration/${f})`).join('\n')}

## 💰 Trading Systems & DeFi
${docStructure['docs/trading-systems'].map(f => `- [${f.replace('.md', '').replace(/_/g, ' ')}](./trading-systems/${f})`).join('\n')}

## 🚀 Deployment & Infrastructure
${docStructure['docs/deployment'].map(f => `- [${f.replace('.md', '').replace('.sh', '').replace(/_/g, ' ')}](./deployment/${f})`).join('\n')}

## 🔒 Security & Compliance
${docStructure['docs/security'].map(f => `- [${f.replace('.md', '').replace('.py', '').replace(/_/g, ' ')}](./security/${f})`).join('\n')}

## 🎮 Gaming Research & VR
${docStructure['docs/gaming-research'].map(f => `- [${f.replace('.md', '').replace('.py', '').replace(/_/g, ' ')}](./gaming-research/${f})`).join('\n')}

## 🎨 Design Language & UX
${docStructure['docs/design-language'].map(f => `- [${f.replace('.md', '').replace(/_/g, ' ')}](./design-language/${f})`).join('\n')}

## ⚙️ Infrastructure & Architecture
${docStructure['docs/infrastructure'].map(f => `- [${f.replace('.md', '').replace('.py', '').replace(/_/g, ' ')}](./infrastructure/${f})`).join('\n')}

## 📊 Performance & Optimization
${docStructure['docs/performance'].map(f => `- [${f.replace('.md', '').replace(/_/g, ' ')}](./performance/${f})`).join('\n')}

## 💼 Business & Strategy
${docStructure['docs/business'].map(f => `- [${f.replace('.md', '').replace(/_/g, ' ')}](./business/${f})`).join('\n')}

## 📦 Archive
${docStructure['docs/archive'].map(f => `- [${f.replace('.md', '').replace(/_/g, ' ')}](./archive/${f})`).join('\n')}

---

## Quick Navigation

### Most Important Documents
1. **[VibeCoding Constitution](./foundation/VIBECODING_CONSTITUTION.md)** - Core principles and values
2. **[AI Integration Framework](./ai-integration/AI_INTEGRATION_FRAMEWORK.md)** - AI orchestration guide
3. **[Technical Architecture](./infrastructure/TECHNICAL_ARCHITECTURE_OVERVIEW.md)** - System design overview
4. **[Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
5. **[Security Best Practices](./security/SECURITY_BEST_PRACTICES.md)** - Security implementation guide

### Development Workflow
1. Read the **Foundation** documents to understand VibeCoding principles
2. Review **AI Integration** for consciousness-driven development
3. Follow **Deployment** guides for production releases
4. Implement **Security** best practices throughout
5. Reference **Gaming Research** for performance optimization insights

### Project Categories
- **🧠 Consciousness-Driven**: Foundation, AI Integration, Gaming Research
- **🛠️ Technical Implementation**: Infrastructure, Performance, Security
- **🚀 Business Ready**: Deployment, Business Strategy, Design Language
- **📚 Reference**: Archive, Documentation Index

---

*This documentation is organized following VibeCoding principles: consciousness-driven development with gaming precision, philosophical depth, and practical implementation.*

**Last Updated**: ${new Date().toISOString().split('T')[0]}
`;

  fs.writeFileSync('docs/README.md', indexContent);
  console.log('✅ Created comprehensive documentation index');
}

function cleanupRootDirectory() {
  console.log('\n🧹 Cleaning up remaining documentation files in root...');
  
  // List of additional files that should be moved or cleaned up
  const additionalCleanup = [
    'CONSOLIDATED_PROJECT_INSIGHTS.md',
    'CONSOLIDATED_VIBECODING_INDEX.md',
    'COMPREHENSIVE_REFACTOR_REPORT_2025.md',
    'CROSS_EMPOWERED_DOCS_SUMMARY.md',
    'IMPLEMENTATION_COMPLETE_SUMMARY.md',
    'INTELLIGENT_STACK_VALIDATION_SUMMARY.md'
  ];
  
  additionalCleanup.forEach(file => {
    if (fs.existsSync(file)) {
      const targetPath = path.join('docs/archive', file);
      try {
        fs.renameSync(file, targetPath);
        console.log(`🗂️  Archived: ${file}`);
      } catch (error) {
        console.log(`⚠️  Could not archive ${file}: ${error.message}`);
      }
    }
  });
}

function main() {
  console.log('🎯 VibeCoding Documentation Organization Started\n');
  
  createDirectories();
  moveFiles();
  createMasterIndex();
  cleanupRootDirectory();
  
  console.log('\n✨ Documentation organization complete!');
  console.log('\n📋 Summary:');
  console.log('  • Created organized folder structure in docs/');
  console.log('  • Moved documentation files to appropriate categories');
  console.log('  • Generated comprehensive README.md index');
  console.log('  • Archived miscellaneous documentation');
  console.log('\n🎉 Your documentation is now properly organized!');
  console.log('📖 Check docs/README.md for the complete navigation guide');
}

if (require.main === module) {
  main();
}

module.exports = { docStructure, createDirectories, moveFiles };
