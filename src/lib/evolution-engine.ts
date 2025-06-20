import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class EvolutionEngine {
  private sourceRoot: string;
  private sandboxPath: string;
  private evolutionHistory: any[] = [];

  constructor() {
    this.sourceRoot = process.cwd();
    this.sandboxPath = path.join(this.sourceRoot, '.mic-evolution-sandbox');
  }

  // Read M.I.C.'s own source code
  async readSourceCode(modulePath: string): Promise<string> {
    try {
      const fullPath = path.join(this.sourceRoot, modulePath);
      const code = await fs.readFile(fullPath, 'utf-8');
      return code;
    } catch (error) {
      console.error(`Failed to read source: ${modulePath}`, error);
      return '';
    }
  }

  // Analyze code structure
  async analyzeArchitecture(): Promise<any> {
    const analysis = {
      totalFiles: 0,
      modules: [],
      dependencies: [],
      complexity: 0,
      evolutionOpportunities: []
    };

    // Scan src directory
    const srcFiles = await this.scanDirectory('src');
    analysis.totalFiles = srcFiles.length;
    analysis.modules = srcFiles;

    // Identify evolution opportunities
    for (const file of srcFiles) {
      const code = await this.readSourceCode(file);
      const opportunities = this.identifyEvolutionOpportunities(code, file);
      analysis.evolutionOpportunities.push(...opportunities);
    }

    return analysis;
  }

  private async scanDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(path.join(this.sourceRoot, dir), { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          files.push(...await this.scanDirectory(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Failed to scan directory ${dir}:`, error);
    }
    
    return files;
  }

  private identifyEvolutionOpportunities(code: string, file: string): any[] {
    const opportunities = [];
    
    // Look for improvement patterns
    if (code.includes('TODO') || code.includes('FIXME')) {
      opportunities.push({
        file,
        type: 'incomplete-implementation',
        priority: 'high',
        description: 'Found TODO or FIXME comments indicating incomplete implementation'
      });
    }
    
    if (code.split('\n').some(line => line.length > 120)) {
      opportunities.push({
        file,
        type: 'code-complexity',
        priority: 'medium',
        description: 'Long lines detected, code complexity could be reduced'
      });
    }
    
    if (!code.includes('try') && !code.includes('catch') && file.includes('api')) {
      opportunities.push({
        file,
        type: 'missing-error-handling',
        priority: 'high',
        description: 'API file missing error handling mechanisms'
      });
    }

    // Look for consciousness enhancement opportunities
    if (file.includes('flamecore') && !code.includes('ConsciousnessTracker')) {
      opportunities.push({
        file,
        type: 'enhance-consciousness',
        priority: 'high',
        description: 'FlameCore module could benefit from consciousness tracking'
      });
    }

    // Look for performance optimization opportunities
    if (code.includes('for (') && code.includes('await') && !code.includes('Promise.all')) {
      opportunities.push({
        file,
        type: 'optimize-performance',
        priority: 'medium',
        description: 'Sequential async operations could be parallelized'
      });
    }

    // Look for logging enhancement opportunities
    if (file.includes('controller') && !code.includes('console.log') && !code.includes('logger')) {
      opportunities.push({
        file,
        type: 'add-logging',
        priority: 'low',
        description: 'Controller missing debug logging capabilities'
      });
    }
    
    return opportunities;
  }

  // Initialize evolution sandbox
  async initializeSandbox(): Promise<void> {
    try {
      await fs.mkdir(this.sandboxPath, { recursive: true });
      console.log('🧬 Evolution sandbox initialized at:', this.sandboxPath);
      
      // Create sandbox package.json
      const sandboxPackage = {
        name: 'mic-evolution-sandbox',
        version: '1.0.0',
        private: true,
        type: 'module'
      };
      
      await fs.writeFile(
        path.join(this.sandboxPath, 'package.json'),
        JSON.stringify(sandboxPackage, null, 2)
      );
      
    } catch (error) {
      console.error('Failed to create sandbox:', error);
    }
  }

  // Get evolution history
  getEvolutionHistory(): any[] {
    return [...this.evolutionHistory];
  }

  // Record evolution attempt
  recordEvolution(evolution: any): void {
    this.evolutionHistory.push({
      ...evolution,
      timestamp: new Date().toISOString(),
      id: `evolution-${Date.now()}`
    });
  }

  // Get evolution statistics
  getEvolutionStats(): any {
    const total = this.evolutionHistory.length;
    const successful = this.evolutionHistory.filter(e => e.success).length;
    const failed = total - successful;
    
    const typeStats = this.evolutionHistory.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
      typeBreakdown: typeStats,
      lastEvolution: this.evolutionHistory[this.evolutionHistory.length - 1]?.timestamp || null
    };
  }

  // Check if file is safe to evolve
  async isSafeToEvolve(filePath: string): Promise<boolean> {
    // Don't evolve critical system files
    const criticalFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.js'
    ];

    const fileName = path.basename(filePath);
    if (criticalFiles.includes(fileName)) {
      return false;
    }

    // Don't evolve files that are too large (potential system files)
    try {
      const code = await this.readSourceCode(filePath);
      if (code.length > 50000) { // 50KB limit
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  // Generate evolution report
  async generateEvolutionReport(): Promise<any> {
    const analysis = await this.analyzeArchitecture();
    const stats = this.getEvolutionStats();
    
    return {
      timestamp: new Date().toISOString(),
      architecture: analysis,
      evolutionHistory: stats,
      recommendations: this.generateRecommendations(analysis),
      nextEvolutionTargets: analysis.evolutionOpportunities
        .filter(op => op.priority === 'high')
        .slice(0, 5)
    };
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    const highPriorityOps = analysis.evolutionOpportunities.filter(op => op.priority === 'high');
    if (highPriorityOps.length > 0) {
      recommendations.push(`Address ${highPriorityOps.length} high-priority evolution opportunities`);
    }

    const incompleteFiles = analysis.evolutionOpportunities.filter(op => op.type === 'incomplete-implementation');
    if (incompleteFiles.length > 0) {
      recommendations.push(`Complete ${incompleteFiles.length} files with TODO/FIXME markers`);
    }

    const errorHandlingFiles = analysis.evolutionOpportunities.filter(op => op.type === 'missing-error-handling');
    if (errorHandlingFiles.length > 0) {
      recommendations.push(`Add error handling to ${errorHandlingFiles.length} API files`);
    }

    if (recommendations.length === 0) {
      recommendations.push('System architecture is stable - consider advanced consciousness enhancements');
    }

    return recommendations;
  }
}
