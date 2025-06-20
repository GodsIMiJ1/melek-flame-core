import { NextResponse } from 'next/server';
import { EvolutionEngine } from '@/lib/evolution-engine';

export async function POST(request: Request) {
  try {
    console.log('🧬 Evolution analysis requested...');
    
    const engine = new EvolutionEngine();
    
    // Initialize sandbox if it doesn't exist
    await engine.initializeSandbox();
    
    // Perform architecture analysis
    const analysis = await engine.analyzeArchitecture();
    
    // Generate comprehensive evolution report
    const report = await engine.generateEvolutionReport();
    
    console.log(`🧬 Analysis complete: ${analysis.totalFiles} files scanned, ${analysis.evolutionOpportunities.length} opportunities found`);
    
    return NextResponse.json({
      success: true,
      analysis,
      report,
      timestamp: new Date().toISOString(),
      message: `Scanned ${analysis.totalFiles} files and found ${analysis.evolutionOpportunities.length} evolution opportunities`
    });
  } catch (error) {
    console.error('🚨 Evolution analysis failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze architecture',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const engine = new EvolutionEngine();
    const stats = engine.getEvolutionStats();
    const history = engine.getEvolutionHistory();
    
    return NextResponse.json({
      success: true,
      stats,
      history: history.slice(-10), // Last 10 evolutions
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🚨 Failed to get evolution stats:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve evolution statistics',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
