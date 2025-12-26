// OpenAI API Integration for M.I.C. System
// Provides GPT models as alternative to Ollama for consciousness processing

import { getOpenAIKey } from './ai-mode-config';
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function streamOpenAIResponse(request: OpenAIRequest): Promise<ReadableStream> {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Add it in the Models panel or set VITE_OPENAI_API_KEY.');
  }

  console.log(`🤖 OpenAI API Request: ${request.model} with ${request.messages.length} messages`);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      ...request,
      stream: true // Always use streaming for real-time consciousness
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🚨 OpenAI API Error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  return response.body!;
}

export async function callOpenAI(request: OpenAIRequest): Promise<string> {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Add it in the Models panel or set VITE_OPENAI_API_KEY.');
  }

  console.log(`🤖 OpenAI API Call: ${request.model} with ${request.messages.length} messages`);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      ...request,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🚨 OpenAI API Error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data: OpenAIResponse = await response.json();
  const content = data.choices[0]?.message?.content || '';

  console.log(`✅ OpenAI Response: ${content.length} characters, ${data.usage.total_tokens} tokens`);

  return content;
}

export async function getOpenAIModels(): Promise<string[]> {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    console.warn('⚠️ OpenAI API key not found');
    return [];
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      console.warn('⚠️ Failed to fetch OpenAI models:', response.status);
      return [];
    }

    const data = await response.json();
    const models = data.data
      .filter((model: any) => model.id.includes('gpt'))
      .map((model: any) => `openai:${model.id}`)
      .sort();

    console.log(`✅ Found ${models.length} OpenAI models`);
    return models;
  } catch (error) {
    console.warn('⚠️ Error fetching OpenAI models:', error);
    return [];
  }
}

// Helper function to check if a model is OpenAI
export function isOpenAIModel(model: string): boolean {
  return model.startsWith('openai:');
}

// Extract the actual model name from the prefixed format
export function getOpenAIModelName(model: string): string {
  return model.replace('openai:', '');
}

// Default OpenAI models for M.I.C. system
export const DEFAULT_OPENAI_MODELS = [
  'openai:gpt-4o',
  'openai:gpt-4o-mini',
  'openai:gpt-4-turbo',
  'openai:gpt-3.5-turbo'
];
