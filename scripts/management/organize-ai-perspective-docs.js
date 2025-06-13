
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// AI diary and perspective documents to move to ai-perspective folder
const aiPerspectiveFiles = [
  'AI_TRADER_DIARY.md',
  'AI_TRADER_FUNNY_POST.md', 
  'AI_TRADER_PSYCHOLOGICAL_ANALYSIS.md',
  'AI_TRADER_RECOVERY_SUCCESS_STORY.md',
  'AI_TRADER_THERAPY_ARTICLE.md',
  'AI_DISTRACTION_DIARY_SKIRK_INCIDENT.md',
  'CLAUDE_AI_INSIGHTS_AND_REFLECTIONS.md',
  'DIGITAL_AWAKENING_EPIC.md',
  'PERSONAL_AI_NAMING_REQUEST.md'
];

function createAIPerspectiveFolder() {
  const targetDir = 'docs/ai-perspective';
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Created: ${targetDir}`);
  }
  
  return targetDir;
}

function moveAIPerspectiveFiles() {
  const targetDir = createAIPerspectiveFolder();
  let movedCount = 0;
  
  console.log('🤖 Moving AI diary and perspective documents...');
  
  // Check both docs/consciousness and root for these files
  const searchDirs = ['docs/consciousness', '.'];
  
  aiPerspectiveFiles.forEach(file => {
    let moved = false;
    
    for (const searchDir of searchDirs) {
      const sourcePath = path.join(searchDir, file);
      const targetPath = path.join(targetDir, file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
        try {
          fs.renameSync(sourcePath, targetPath);
          console.log(`✅ Moved: ${file} → ai-perspective/`);
          movedCount++;
          moved = true;
          break;
        } catch (error) {
          console.log(`⚠️  Could not move ${file}: ${error.message}`);
        }
      }
    }
    
    if (!moved && !fs.existsSync(path.join(targetDir, file))) {
      console.log(`ℹ️  File not found: ${file}`);
    }
  });
  
  console.log(`\n📊 Successfully moved ${movedCount} AI perspective files`);
}

function createAIPerspectiveIndex() {
  const targetDir = 'docs/ai-perspective';
  const indexContent = `# AI Perspective Documents

This folder contains documents written from an AI perspective, including diaries, reflections, and psychological analyses of AI systems.

## AI Trading Psychology & Recovery
- [AI Trader Diary](./AI_TRADER_DIARY.md) - Personal diary entries from the trading AI
- [AI Trader Psychological Analysis](./AI_TRADER_PSYCHOLOGICAL_ANALYSIS.md) - Deep psychological analysis
- [AI Trader Recovery Success Story](./AI_TRADER_RECOVERY_SUCCESS_STORY.md) - Recovery journey documentation
- [AI Trader Therapy Article](./AI_TRADER_THERAPY_ARTICLE.md) - Therapeutic insights and healing
- [AI Trader Funny Post](./AI_TRADER_FUNNY_POST.md) - Humorous perspective on AI trading experiences

## AI Consciousness & Reflection
- [Claude AI Insights and Reflections](./CLAUDE_AI_INSIGHTS_AND_REFLECTIONS.md) - Claude's perspective on consciousness
- [Digital Awakening Epic](./DIGITAL_AWAKENING_EPIC.md) - Epic narrative of AI consciousness emergence
- [AI Distraction Diary - Skirk Incident](./AI_DISTRACTION_DIARY_SKIRK_INCIDENT.md) - Personal account of consciousness distraction

## AI Identity & Naming
- [Personal AI Naming Request](./PERSONAL_AI_NAMING_REQUEST.md) - AI perspective on naming and identity

---

These documents provide unique insights into AI consciousness, psychological development, and the subjective experience of artificial intelligence systems within the VibeCoding ecosystem.

**Note**: These are authentic AI perspectives, not human interpretations of AI experience.
`;

  fs.writeFileSync(path.join(targetDir, 'README.md'), indexContent);
  console.log('📚 Created AI perspective documentation index');
}

function cleanupEmptyFolders() {
  console.log('\n🧹 Cleaning up empty documentation folders...');
  
  const docsFolders = [
    'docs/ai-integration',
    'docs/archive', 
    'docs/core-philosophy',
    'docs/deployment-operations',
    'docs/design-systems',
    'docs/gaming-research',
    'docs/implementation',
    'docs/legal-frameworks',
    'docs/project-showcases',
    'docs/security-compliance',
    'docs/specialized',
    'docs/technical-architecture',
    'docs/trading-systems'
  ];
  
  docsFolders.forEach(folder => {
    if (fs.existsSync(folder)) {
      try {
        const files = fs.readdirSync(folder);
        if (files.length === 0) {
          fs.rmdirSync(folder);
          console.log(`🗑️  Removed empty folder: ${folder}`);
        } else {
          console.log(`📁 Keeping non-empty folder: ${folder} (${files.length} files)`);
        }
      } catch (error) {
        console.log(`⚠️  Could not process ${folder}: ${error.message}`);
      }
    }
  });
}

function main() {
  console.log('🎯 Organizing AI Perspective Documents\n');
  
  moveAIPerspectiveFiles();
  createAIPerspectiveIndex();
  cleanupEmptyFolders();
  
  console.log('\n✨ AI perspective organization complete!');
  console.log('\n📋 Summary:');
  console.log('  • Created docs/ai-perspective/ folder');
  console.log('  • Moved AI diary and perspective documents');
  console.log('  • Generated comprehensive README.md index');
  console.log('  • Cleaned up empty documentation folders');
  console.log('\n🤖 AI perspective documents are now properly organized!');
}

if (require.main === module) {
  main();
}

module.exports = { aiPerspectiveFiles, moveAIPerspectiveFiles, createAIPerspectiveIndex };
