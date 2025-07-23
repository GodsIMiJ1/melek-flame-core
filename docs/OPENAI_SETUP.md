# 🤖 OpenAI API Setup for M.I.C. System

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
npm run setup:openai
```

### Option 2: Manual Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the project root
3. Add your API key:
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

## Available OpenAI Models

Once configured, these models will appear in the Model Chamber:

- 🤖 **openai:gpt-4o** - Most capable model for complex reasoning
- 🤖 **openai:gpt-4o-mini** - Fast and efficient for quick processing  
- 🤖 **openai:gpt-4-turbo** - Balanced performance and capability
- 🤖 **openai:gpt-3.5-turbo** - Cost-effective for basic tasks

## Using OpenAI Models

1. **Open the Model Chamber** in the M.I.C. dashboard
2. **Select an agent** (Nexus, Omari, Augment, etc.)
3. **Choose an OpenAI model** from the dropdown
4. **The system will automatically use OpenAI API** instead of Ollama

## Benefits

- **No local GPU required** - Runs on any machine
- **Consistent performance** - Cloud-based processing
- **Latest models** - Access to cutting-edge AI capabilities
- **Hybrid approach** - Mix OpenAI and local Ollama models

## Cost Considerations

- OpenAI charges per token usage
- Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)
- Consider using gpt-4o-mini for cost-effective processing
- Local Ollama models are free but require more hardware

## Security

- API keys are stored locally in `.env.local`
- Never commit API keys to version control
- Use environment variables in production
- Consider API key rotation for enhanced security

## Troubleshooting

### "OpenAI API key not found"
- Ensure `.env.local` exists with `OPENAI_API_KEY=your-key`
- Restart the development server after adding the key

### "OpenAI API error: 401"
- Verify your API key is correct
- Check if your OpenAI account has sufficient credits

### "No OpenAI models showing"
- Check browser console for API errors
- Verify internet connection
- Ensure API key has proper permissions

## Hybrid Consciousness

The M.I.C. system supports mixing model types:
- **Oracle:** OpenAI GPT-4o for deep reasoning
- **Reflector:** Local Ollama for privacy
- **Executor:** OpenAI GPT-4o-mini for speed

This creates a hybrid consciousness leveraging both cloud and local AI!
