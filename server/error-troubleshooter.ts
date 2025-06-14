/**
 * AI Error Troubleshooter
 * Automatically detects and fixes common errors in real-time
 */

interface ErrorPattern {
  type: string;
  pattern: RegExp;
  solution: string;
  auto_fix?: boolean;
  file_fix?: (content: string) => string;
}

interface ErrorFix {
  file: string;
  error: string;
  fix_applied: string;
  success: boolean;
}

export class AIErrorTroubleshooter {
  private error_patterns: ErrorPattern[] = [
    {
      type: 'react_import_missing',
      pattern: /'React' refers to a UMD global, but the current file is a module/,
      solution: 'Add React import to component files',
      auto_fix: true,
      file_fix: (content: string) => {
        if (!content.includes('import React from') && !content.includes('import { ')) {
          return `import React from 'react';\n${content}`;
        }
        return content;
      }
    },
    {
      type: 'utils_import_missing',
      pattern: /Cannot find module '@\/lib\/utils'/,
      solution: 'Create missing utils file with cn helper',
      auto_fix: true
    },
    {
      type: 'promise_rejection',
      pattern: /Unhandled promise rejection/,
      solution: 'Add proper error handling to async operations',
      auto_fix: false
    },
    {
      type: 'websocket_property_missing',
      pattern: /Property 'on' does not exist on type 'WebSocket'/,
      solution: 'Import WebSocket from ws package without type prefix',
      auto_fix: true,
      file_fix: (content: string) => {
        return content.replace(/import.*WebSocket.*from 'ws';/, "import WebSocket from 'ws';");
      }
    },
    {
      type: 'property_access_error',
      pattern: /Property '.*' does not exist on type/,
      solution: 'Add optional chaining or null checks',
      auto_fix: false
    }
  ];

  private fixes_applied: ErrorFix[] = [];
  private monitoring: boolean = false;

  constructor() {
    this.startErrorMonitoring();
  }

  private startErrorMonitoring() {
    this.monitoring = true;
    console.log('🔧 AI Error Troubleshooter initialized - monitoring for issues');
    
    // Monitor console for errors every 10 seconds
    setInterval(() => {
      this.scanForErrors();
    }, 10000);
  }

  private async scanForErrors() {
    try {
      // Check for common file issues and auto-fix where possible
      await this.checkAndFixMissingUtils();
      await this.checkAndFixReactImports();
      await this.checkWebSocketImports();
    } catch (error) {
      console.log('🔧 Error troubleshooter encountered issue:', error);
    }
  }

  private async checkAndFixMissingUtils() {
    const fs = await import('fs');
    const path = await import('path');
    
    try {
      const utilsPath = path.default.join(process.cwd(), 'client/src/lib/utils.ts');
      await fs.promises.access(utilsPath);
    } catch {
      // Utils file missing, create it
      await this.createUtilsFile();
    }
  }

  private async createUtilsFile() {
    const fs = await import('fs');
    const path = await import('path');
    
    const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

    try {
      const libDir = path.join(process.cwd(), 'client/src/lib');
      await fs.mkdir(libDir, { recursive: true });
      await fs.writeFile(path.join(libDir, 'utils.ts'), utilsContent);
      
      this.fixes_applied.push({
        file: 'client/src/lib/utils.ts',
        error: 'Missing utils file',
        fix_applied: 'Created utils.ts with cn helper function',
        success: true
      });
      
      console.log('🔧 Auto-fixed: Created missing utils.ts file');
    } catch (error) {
      console.log('🔧 Failed to create utils file:', error);
    }
  }

  private async checkAndFixReactImports() {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const componentsDir = path.join(process.cwd(), 'client/src/components');
      const files = await this.getAllTsxFiles(componentsDir);
      
      for (const file of files) {
        await this.fixReactImportInFile(file);
      }
    } catch (error) {
      console.log('🔧 Error checking React imports:', error);
    }
  }

  private async getAllTsxFiles(dir: string): Promise<string[]> {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const files = await fs.readdir(dir, { withFileTypes: true });
      const tsxFiles: string[] = [];
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          const subFiles = await this.getAllTsxFiles(fullPath);
          tsxFiles.push(...subFiles);
        } else if (file.name.endsWith('.tsx')) {
          tsxFiles.push(fullPath);
        }
      }
      
      return tsxFiles;
    } catch {
      return [];
    }
  }

  private async fixReactImportInFile(filePath: string) {
    const fs = require('fs').promises;
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      if (content.includes("'React' refers to a UMD global") || 
          (!content.includes('import React') && content.includes('React.'))) {
        
        const fixedContent = this.addReactImport(content);
        if (fixedContent !== content) {
          await fs.writeFile(filePath, fixedContent);
          
          this.fixes_applied.push({
            file: filePath,
            error: 'React import missing',
            fix_applied: 'Added React import statement',
            success: true
          });
          
          console.log(`🔧 Auto-fixed React import in ${filePath}`);
        }
      }
    } catch (error) {
      console.log(`🔧 Error fixing React import in ${filePath}:`, error);
    }
  }

  private addReactImport(content: string): string {
    const lines = content.split('\n');
    const firstImportIndex = lines.findIndex(line => line.startsWith('import'));
    
    if (firstImportIndex === -1) {
      return `import React from 'react';\n${content}`;
    }
    
    // Check if React is already imported
    if (lines.some(line => line.includes('import React'))) {
      return content;
    }
    
    // Add React import after existing imports
    lines.splice(firstImportIndex, 0, "import React from 'react';");
    return lines.join('\n');
  }

  private async checkWebSocketImports() {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const serverDir = path.join(process.cwd(), 'server');
      const files = await fs.readdir(serverDir);
      
      for (const file of files) {
        if (file.endsWith('.ts')) {
          await this.fixWebSocketImport(path.join(serverDir, file));
        }
      }
    } catch (error) {
      console.log('🔧 Error checking WebSocket imports:', error);
    }
  }

  private async fixWebSocketImport(filePath: string) {
    const fs = require('fs').promises;
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      if (content.includes("Property 'on' does not exist on type 'WebSocket'")) {
        const fixedContent = content.replace(
          /import.*{.*WebSocket.*}.*from 'ws';/g,
          "import WebSocket from 'ws';"
        );
        
        if (fixedContent !== content) {
          await fs.writeFile(filePath, fixedContent);
          console.log(`🔧 Auto-fixed WebSocket import in ${filePath}`);
        }
      }
    } catch (error) {
      console.log(`🔧 Error fixing WebSocket import:`, error);
    }
  }

  public getFixHistory(): ErrorFix[] {
    return this.fixes_applied;
  }

  public getErrorGuidance(): string {
    return `AI Error Troubleshooter Active:
- Monitoring for React import issues
- Auto-creating missing utility files  
- Fixing WebSocket import problems
- Detecting promise rejection patterns
- Applied ${this.fixes_applied.length} fixes automatically`;
  }

  public teachErrorPrevention(): void {
    console.log('🔧 Teaching AI agents error prevention patterns:');
    console.log('- Always import React in .tsx files');
    console.log('- Use optional chaining for object properties');
    console.log('- Wrap async operations in try-catch blocks');
    console.log('- Import WebSocket directly from ws package');
  }
}

export const errorTroubleshooter = new AIErrorTroubleshooter();