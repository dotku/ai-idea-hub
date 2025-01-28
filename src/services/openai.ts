import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    // 优先使用 localStorage 中的 API Key
    const storedApiKey = localStorage.getItem('openai_api_key');
    this.client = new OpenAI({
      apiKey: storedApiKey || apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  /**
   * 发送聊天完成请求
   * @param messages 消息数组
   * @param options 可选配置
   */
  async createChatCompletion(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ) {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 1000
    } = options;

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      return response.choices[0].message;
    } catch (error) {
      console.error('OpenAI API 错误:', error);
      throw error;
    }
  }

  /**
   * 创建图片
   * @param prompt 图片描述
   * @param options 可选配置
   */
  async createImage(
    prompt: string,
    options: {
      size?: '256x256' | '512x512' | '1024x1024';
      n?: number;
    } = {}
  ) {
    const { size = '1024x1024', n = 1 } = options;

    try {
      const response = await this.client.images.generate({
        prompt,
        size,
        n,
      });

      return response.data;
    } catch (error) {
      console.error('OpenAI API 图片生成错误:', error);
      throw error;
    }
  }
}