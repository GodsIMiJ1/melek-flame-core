// OpenAI API Integration for M.I.C. System
// Provides GPT models as alternative to Ollama for consciousness processing
// Uses edge function proxy to avoid CORS issues

import { supabase } from '@/integrations/supabase/client';

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

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-proxy`;

export async function streamOpenAIResponse(request: OpenAIRequest): Promise<ReadableStream> {
  console.log(`🤖 OpenAI Proxy Request: ${request.model} with ${request.messages.length} messages (streaming)`);

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      stream: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🚨 OpenAI Proxy Error:', response.status, errorText);
    throw new Error(`OpenAI Proxy error: ${response.status} - ${errorText}`);
  }

  return response.body!;
}

export async function callOpenAI(request: OpenAIRequest): Promise<string> {
  console.log(`🤖 OpenAI Proxy Call: ${request.model} with ${request.messages.length} messages`);

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🚨 OpenAI Proxy Error:', response.status, errorText);
    throw new Error(`OpenAI Proxy error: ${response.status} - ${errorText}`);
  }

  const data: OpenAIResponse = await response.json();
  const content = data.choices[0]?.message?.content || '';

  console.log(`✅ OpenAI Response: ${content.length} characters, ${data.usage?.total_tokens || 0} tokens`);

  return content;
}

export async function getOpenAIModels(): Promise<string[]> {
  // Return default models - no need to call API since we use the proxy
  console.log('✅ Returning default OpenAI models (using proxy)');
  return DEFAULT_OPENAI_MODELS;
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
