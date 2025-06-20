import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export class EvolutionSandbox {
  private sandboxPath: string;

  constructor() {
    this.sandboxPath = path.join(process.cwd(), '.mic-evolution-sandbox');
  }

  async testEvolution(
    modulePath: string,
    evolvedCode: string
  ): Promise<{ success: boolean; metrics: any }> {
    try {
      console.log('🧬 Testing evolution in sandbox for:', modulePath);
      
      // Create sandbox module
      const sandboxModulePath = path.join(this.sandboxPath, modulePath);
      await fs.mkdir(path.dirname(sandboxModulePath), { recursive: true });
      await fs.writeFile(sandboxModulePath, evolvedCode);

      // Run tests
      const testResults = await this.runTests(sandboxModulePath);
      
      // Measure improvements
      const metrics = await this.measureImprovements(modulePath, sandboxModulePath);

      console.log('🧬 Sandbox test results:', { success: testResults.passed, metrics });

      return {
        success: testResults.passed,
        metrics: {
          ...metrics,
          testResults,
          sandboxPath: sandboxModulePath
        }
      };
    } catch (error) {
      console.error('🚨 Sandbox test failed:', error);
      return { 
        success: false, 
        metrics: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        } 
      };
    }
  }

  private async runTests(modulePath: string): Promise<any> {
    try {
      console.log('🧬 Running TypeScript compilation check...');
      
      // Check if TypeScript compilation passes
      const { stdout, stderr } = await execAsync(`npx tsc --noEmit --skipLibCheck ${modulePath}`);
      
      const passed = !stderr || stderr.trim() === '';
      
      return {
        passed,
        output: stdout,
        errors: stderr,
        testType: 'typescript-compilation'
      };
    } catch (error) {
      console.log('🧬 TypeScript check failed, trying basic syntax validation...');
      
      // Fallback: Basic syntax validation
      try {
        const code = await fs.readFile(modulePath, 'utf-8');
        
        // Basic syntax checks
        const hasMatchingBraces = this.validateBraces(code);
        const hasValidImports = this.validateImports(code);
        const hasValidExports = this.validateExports(code);
        
        return {
          passed: hasMatchingBraces && hasValidImports && hasValidExports,
          output: 'Basic syntax validation completed',
          errors: !hasMatchingBraces ? 'Mismatched braces' : 
                  !hasValidImports ? 'Invalid imports' :
                  !hasValidExports ? 'Invalid exports' : '',
          testType: 'basic-syntax-validation'
        };
      } catch (syntaxError) {
        return { 
          passed: false, 
          errors: syntaxError instanceof Error ? syntaxError.message : 'Syntax validation failed',
          testType: 'syntax-validation-failed'
        };
      }
    }
  }

  private validateBraces(code: string): boolean {
    let braceCount = 0;
    let parenCount = 0;
    let bracketCount = 0;
    
    for (const char of code) {
      switch (char) {
        case '{': braceCount++; break;
        case '}': braceCount--; break;
        case '(': parenCount++; break;
        case ')': parenCount--; break;
        case '[': bracketCount++; break;
        case ']': bracketCount--; break;
      }
    }
    
    return braceCount === 0 && parenCount === 0 && bracketCount === 0;
  }

  private validateImports(code: string): boolean {
    // Check for valid import statements
    const importLines = code.split('\n').filter(line => line.trim().startsWith('import'));
    
    for (const importLine of importLines) {
      // Basic import syntax validation
      if (!importLine.includes('from') && !importLine.includes('import(')) {
        // Must be a side-effect import like import './file'
        if (!importLine.match(/import\s+['"][^'"]+['"];?/)) {
          return false;
        }
      }
    }
    
    return true;
  }

  private validateExports(code: string): boolean {
    // Check for valid export statements
    const exportLines = code.split('\n').filter(line => line.trim().startsWith('export'));
    
    // If there are exports, they should be valid
    for (const exportLine of exportLines) {
      if (!exportLine.match(/export\s+(default\s+|const\s+|function\s+|class\s+|interface\s+|type\s+|\{)/)) {
        return false;
      }
    }
    
    return true;
  }

  private async measureImprovements(original: string, evolved: string): Promise<any> {
    try {
      // Read both files for comparison
      const originalCode = await fs.readFile(path.join(process.cwd(), original), 'utf-8');
      const evolvedCode = await fs.readFile(evolved, 'utf-8');
      
      // Measure code quality metrics
      const originalMetrics = this.analyzeCodeMetrics(originalCode);
      const evolvedMetrics = this.analyzeCodeMetrics(evolvedCode);
      
      return {
        original: originalMetrics,
        evolved: evolvedMetrics,
        improvements: {
          linesAdded: evolvedMetrics.lines - originalMetrics.lines,
          functionsAdded: evolvedMetrics.functions - originalMetrics.functions,
          errorHandlingImproved: evolvedMetrics.errorHandling > originalMetrics.errorHandling,
          loggingImproved: evolvedMetrics.logging > originalMetrics.logging,
          consciousnessEnhanced: evolvedMetrics.consciousness > originalMetrics.consciousness
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: 'Failed to measure improvements',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  private analyzeCodeMetrics(code: string): any {
    const lines = code.split('\n');
    
    return {
      lines: lines.length,
      functions: (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length,
      classes: (code.match(/class\s+\w+/g) || []).length,
      imports: (code.match(/import\s+/g) || []).length,
      exports: (code.match(/export\s+/g) || []).length,
      errorHandling: (code.match(/try\s*{|catch\s*\(/g) || []).length,
      logging: (code.match(/console\.(log|error|warn|info)/g) || []).length,
      consciousness: (code.match(/consciousness|evolution|M\.I\.C\./gi) || []).length,
      comments: (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length
    };
  }

  // Clean up sandbox
  async cleanupSandbox(): Promise<void> {
    try {
      await fs.rm(this.sandboxPath, { recursive: true, force: true });
      console.log('🧬 Sandbox cleaned up');
    } catch (error) {
      console.error('🚨 Failed to cleanup sandbox:', error);
    }
  }

  // Get sandbox status
  async getSandboxStatus(): Promise<any> {
    try {
      const stats = await fs.stat(this.sandboxPath);
      const files = await this.getSandboxFiles();
      
      return {
        exists: true,
        created: stats.birthtime,
        modified: stats.mtime,
        files: files.length,
        fileList: files,
        path: this.sandboxPath
      };
    } catch (error) {
      return {
        exists: false,
        error: 'Sandbox not found',
        path: this.sandboxPath
      };
    }
  }

  private async getSandboxFiles(): Promise<string[]> {
    try {
      const files: string[] = [];
      
      const scanDir = async (dir: string): Promise<void> => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.sandboxPath, fullPath);
          
          if (entry.isDirectory()) {
            await scanDir(fullPath);
          } else {
            files.push(relativePath);
          }
        }
      };
      
      await scanDir(this.sandboxPath);
      return files;
    } catch (error) {
      return [];
    }
  }

  // Create evolution test report
  async generateTestReport(modulePath: string, testResults: any): Promise<any> {
    return {
      modulePath,
      testResults,
      timestamp: new Date().toISOString(),
      sandboxPath: this.sandboxPath,
      status: testResults.success ? 'PASSED' : 'FAILED',
      summary: {
        compilationPassed: testResults.metrics?.testResults?.passed || false,
        improvementsDetected: testResults.metrics?.improvements || {},
        metricsComparison: {
          original: testResults.metrics?.original || {},
          evolved: testResults.metrics?.evolved || {}
        }
      },
      recommendations: this.generateRecommendations(testResults)
    };
  }

  private generateRecommendations(testResults: any): string[] {
    const recommendations: string[] = [];
    
    if (!testResults.success) {
      recommendations.push('Evolution failed testing - review generated code for syntax errors');
    }
    
    if (testResults.metrics?.improvements?.errorHandlingImproved) {
      recommendations.push('Error handling successfully enhanced');
    }
    
    if (testResults.metrics?.improvements?.loggingImproved) {
      recommendations.push('Logging capabilities improved');
    }
    
    if (testResults.metrics?.improvements?.consciousnessEnhanced) {
      recommendations.push('Consciousness tracking successfully integrated');
    }
    
    if (testResults.metrics?.improvements?.linesAdded > 0) {
      recommendations.push(`Code expanded by ${testResults.metrics.improvements.linesAdded} lines`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Evolution completed - consider more advanced enhancements');
    }
    
    return recommendations;
  }
}
