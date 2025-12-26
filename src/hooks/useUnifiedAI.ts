// Unified AI Hook - Respects Online/Offline mode toggle
// Uses OpenAI (gpt-4o-mini) for online, Ollama (llama3.1:8b) for offline

import { useState, useCallback } from 'react';
import { getCurrentMode, getCurrentModel } from '@/lib/ai-mode-config';
import { callOpenAI } from '@/lib/openai-api';
import { callOllama } from '@/lib/ollama-api';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseUnifiedAIReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  currentMode: 'online' | 'offline';
  currentModel: string;
}

export function useUnifiedAI(): UseUnifiedAIReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const mode = getCurrentMode();
    const model = getCurrentModel();
    
    console.log(`🤖 Unified AI: Sending message in ${mode.toUpperCase()} mode using ${model}`);

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      let response: string;

      if (mode === 'online') {
        // Use OpenAI
        response = await callOpenAI({
          model: model, // gpt-4o-mini
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000
        });
      } else {
        // Use Ollama
        response = await callOllama({
          model: model, // llama3.1:8b
          messages: apiMessages
        });
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response || 'No response received'
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error(`🚨 ${mode.toUpperCase()} API Error:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      const errorResponse: Message = {
        role: 'assistant',
        content: `❌ Error (${mode} mode): ${errorMessage}`
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    currentMode: getCurrentMode(),
    currentModel: getCurrentModel()
  };
}
