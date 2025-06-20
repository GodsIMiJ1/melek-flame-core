import { NextResponse } from 'next/server';
import { EvolutionEngine } from '@/lib/evolution-engine';
import { EvolutionGenerator } from '@/lib/evolution-generator';
import { EvolutionSandbox } from '@/lib/evolution-sandbox';

export async function POST(request: Request) {
  try {
    console.log('🧬 Evolution process initiated...');
    
    const { targetFile, improvementType } = await request.json();
    
    if (!targetFile || !improvementType) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: targetFile and improvementType'
      }, { status: 400 });
    }
    
    const engine = new EvolutionEngine();
    const generator = new EvolutionGenerator();
    const sandbox = new EvolutionSandbox();
    
    console.log(`🧬 Evolving ${targetFile} with improvement: ${improvementType}`);
    
    // Check if file is safe to evolve
    const isSafe = await engine.isSafeToEvolve(targetFile);
    if (!isSafe) {
      return NextResponse.json({
        success: false,
        error: 'Target file is not safe for evolution (critical system file or too large)',
        targetFile
      }, { status: 400 });
    }
    
    // Read current code
    const currentCode = await engine.readSourceCode(targetFile);
    if (!currentCode) {
      return NextResponse.json({
        success: false,
        error: 'Failed to read target file or file is empty',
        targetFile
      }, { status: 404 });
    }
    
    console.log(`🧬 Original code length: ${currentCode.length} characters`);
    
    // Generate improvement
    const evolvedCode = await generator.generateImprovement(
      targetFile,
      improvementType,
      currentCode
    );
    
    console.log(`🧬 Evolved code length: ${evolvedCode.length} characters`);
    
    // Test in sandbox
    const testResults = await sandbox.testEvolution(targetFile, evolvedCode);
    
    // Generate evolution summary
    const summary = generator.generateEvolutionSummary(
      targetFile,
      improvementType,
      currentCode.length,
      evolvedCode.length
    );
    
    // Record evolution attempt
    engine.recordEvolution({
      ...summary,
      success: testResults.success,
      testResults: testResults.metrics
    });
    
    if (testResults.success) {
      console.log('🧬 Evolution successful - ready for integration');
      
      // Generate test report
      const testReport = await sandbox.generateTestReport(targetFile, testResults);
      
      return NextResponse.json({
        success: true,
        targetFile,
        improvementType,
        evolvedCode,
        originalLength: currentCode.length,
        evolvedLength: evolvedCode.length,
        metrics: testResults.metrics,
        summary,
        testReport,
        readyForIntegration: true,
        message: `Evolution successful! ${improvementType} applied to ${targetFile}`,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('🚨 Evolution failed testing');
      
      return NextResponse.json({
        success: false,
        error: 'Evolution failed testing phase',
        targetFile,
        improvementType,
        details: testResults.metrics,
        summary,
        evolvedCode, // Include for debugging
        message: 'Evolution generated but failed validation tests',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('🚨 Evolution process failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Evolution process encountered an error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const engine = new EvolutionEngine();
    const sandbox = new EvolutionSandbox();
    
    // Get evolution statistics
    const stats = engine.getEvolutionStats();
    const history = engine.getEvolutionHistory();
    const sandboxStatus = await sandbox.getSandboxStatus();
    
    return NextResponse.json({
      success: true,
      stats,
      recentEvolutions: history.slice(-5), // Last 5 evolutions
      sandboxStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🚨 Failed to get evolution status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve evolution status',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Apply evolution (integrate evolved code)
export async function PUT(request: Request) {
  try {
    console.log('🧬 Evolution integration requested...');
    
    const { targetFile, evolvedCode, evolutionId } = await request.json();
    
    if (!targetFile || !evolvedCode || !evolutionId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: targetFile, evolvedCode, and evolutionId'
      }, { status: 400 });
    }
    
    // This is a dangerous operation - in a real implementation, you would:
    // 1. Create a backup of the original file
    // 2. Apply the evolution in a controlled manner
    // 3. Run comprehensive tests
    // 4. Have rollback capabilities
    
    // For now, we'll just simulate the integration
    console.log(`🧬 Simulating integration of evolution ${evolutionId} for ${targetFile}`);
    
    return NextResponse.json({
      success: true,
      message: 'Evolution integration simulated successfully',
      targetFile,
      evolutionId,
      warning: 'This is a simulation - actual file integration requires additional safety measures',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🚨 Evolution integration failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Evolution integration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
