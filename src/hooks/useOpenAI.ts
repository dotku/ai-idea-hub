import { useState, useCallback } from 'react';
import { OpenAIService } from '../services/openai';
import { OPENAI_CONFIG } from '../config/openai';

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const openAIService = new OpenAIService(OPENAI_CONFIG.apiKey);

  const sendMessage = useCallback(async (
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await openAIService.createChatCompletion(messages, options);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('发生未知错误'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateImage = useCallback(async (
    prompt: string,
    options?: {
      size?: '256x256' | '512x512' | '1024x1024';
      n?: number;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const images = await openAIService.createImage(prompt, options);
      return images;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('图片生成失败'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    sendMessage,
    generateImage
  };
}