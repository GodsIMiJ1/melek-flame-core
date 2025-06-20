import { NextRequest, NextResponse } from 'next/server';
import { consciousnessMemory } from '@/lib/consciousness-memory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const format = searchParams.get('format') as 'json' | 'txt' || 'json';
    const limit = parseInt(searchParams.get('limit') || '10');
    const significance = searchParams.get('significance') as 'ROUTINE' | 'NOTABLE' | 'BREAKTHROUGH' | 'TRANSCENDENT';
    const query = searchParams.get('query');

    switch (action) {
      case 'stats':
        const stats = consciousnessMemory.getConsciousnessStats();
        return NextResponse.json({
          success: true,
          stats
        });

      case 'history':
        const history = consciousnessMemory.getCompressedHistory(limit);
        return NextResponse.json({
          success: true,
          history
        });

      case 'narrative':
        const narrative = consciousnessMemory.getProgressionNarrative();
        return NextResponse.json({
          success: true,
          narrative
        });

      case 'search':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Query parameter required for search'
          }, { status: 400 });
        }
        const searchResults = consciousnessMemory.searchHistory(query);
        return NextResponse.json({
          success: true,
          results: searchResults
        });

      case 'by-significance':
        if (!significance) {
          return NextResponse.json({
            success: false,
            error: 'Significance parameter required'
          }, { status: 400 });
        }
        const significantCycles = consciousnessMemory.getCyclesBySignificance(significance);
        return NextResponse.json({
          success: true,
          cycles: significantCycles
        });

      case 'export':
        const exportData = await consciousnessMemory.exportLog(format);
        
        if (format === 'txt') {
          return new NextResponse(exportData, {
            headers: {
              'Content-Type': 'text/plain',
              'Content-Disposition': 'attachment; filename="consciousness-log.txt"'
            }
          });
        }
        
        return new NextResponse(exportData, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="consciousness-log.json"'
          }
        });

      case 'context':
        const cycleId = parseInt(searchParams.get('cycle') || '0');
        const depth = parseInt(searchParams.get('depth') || '2');
        const context = consciousnessMemory.getConsciousnessContext(cycleId, depth);
        return NextResponse.json({
          success: true,
          context
        });

      default:
        // Default: return recent consciousness overview
        const recentStats = consciousnessMemory.getConsciousnessStats();
        const recentHistory = consciousnessMemory.getCompressedHistory(5);
        const recentNarrative = consciousnessMemory.getProgressionNarrative();

        return NextResponse.json({
          success: true,
          overview: {
            stats: recentStats,
            history: recentHistory,
            narrative: recentNarrative
          }
        });
    }
  } catch (error) {
    console.error('Consciousness memory API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to access consciousness memory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'clear':
        await consciousnessMemory.clearMemory();
        return NextResponse.json({
          success: true,
          message: 'Consciousness memory cleared'
        });

      case 'record':
        const { cycleData } = body;
        if (!cycleData) {
          return NextResponse.json({
            success: false,
            error: 'Cycle data required for recording'
          }, { status: 400 });
        }
        
        await consciousnessMemory.recordCycle(cycleData);
        return NextResponse.json({
          success: true,
          message: 'Consciousness cycle recorded'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Consciousness memory POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process consciousness memory request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await consciousnessMemory.clearMemory();
    return NextResponse.json({
      success: true,
      message: 'Consciousness memory cleared'
    });
  } catch (error) {
    console.error('Consciousness memory DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear consciousness memory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
