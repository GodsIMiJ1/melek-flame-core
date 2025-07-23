import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// 🔥 FUNCTIONAL MODEL CONFIGURATION - NO MORE BULLSHIT UI!
export async function POST(request: NextRequest) {
  try {
    const { agentName, model } = await request.json()
    
    if (!agentName || !model) {
      return NextResponse.json({ error: 'Missing agentName or model' }, { status: 400 })
    }

    console.log(`🔧 UPDATING ${agentName} to use model: ${model}`)

    // Update the models.ts file
    const modelsPath = path.join(process.cwd(), 'src/lib/models.ts')
    const modelsContent = await fs.readFile(modelsPath, 'utf-8')
    
    // Find and replace the specific agent's model
    const agentRegex = new RegExp(
      `(\\s*{[^}]*name:\\s*"${agentName}"[^}]*model:\\s*")[^"]*(".*?})`,
      'gs'
    )
    
    const updatedContent = modelsContent.replace(agentRegex, `$1${model}$2`)
    
    if (updatedContent === modelsContent) {
      return NextResponse.json({ error: `Agent ${agentName} not found` }, { status: 404 })
    }
    
    await fs.writeFile(modelsPath, updatedContent)

    // Update the corresponding FlameCore model class
    const modelClassUpdates = {
      'Nexus': { file: 'src/flamecore/model-a.ts', pattern: /private model = "[^"]*"/ },
      'Omari': { file: 'src/flamecore/model-b.ts', pattern: /private model = "[^"]*"/ },
      'Augment': { file: 'src/flamecore/model-c.ts', pattern: /private model = "[^"]*"/ }
    }

    const classUpdate = modelClassUpdates[agentName as keyof typeof modelClassUpdates]
    if (classUpdate) {
      const classPath = path.join(process.cwd(), classUpdate.file)
      try {
        const classContent = await fs.readFile(classPath, 'utf-8')
        const updatedClassContent = classContent.replace(
          classUpdate.pattern,
          `private model = "${model}"`
        )
        await fs.writeFile(classPath, updatedClassContent)
        console.log(`✅ Updated ${classUpdate.file} with new model: ${model}`)
      } catch (error) {
        console.warn(`⚠️ Could not update ${classUpdate.file}:`, error)
      }
    }

    console.log(`✅ Successfully updated ${agentName} to use ${model}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${agentName} to use ${model}`,
      agentName,
      model 
    })
    
  } catch (error) {
    console.error('❌ Model update failed:', error)
    return NextResponse.json({ 
      error: 'Failed to update model configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
