/**
 * SiteHub AI Provider Registry & OpenAI-Compatible Client
 * Real execution engine for KiraAI (DeepSeek/GLM), NVIDIA Nemotron, Google Gemini, and OpenAI.
 */

import { GoogleGenAI } from '@google/genai';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderCallResult {
  success: boolean;
  content?: string;
  provider: string;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs: number;
  error?: string;
  isFallback?: boolean;
}

export interface ResolvedAiKeys {
  kiraKey?: string;
  kiraCodeKey?: string;
  nemotronKey?: string;
  geminiKey?: string;
  openaiKey?: string;
}

export class AiProviderRegistry {
  /**
   * Resolves effective API keys from server environment or client overrides.
   */
  static getResolvedKeys(clientKeys?: Record<string, string>): ResolvedAiKeys {
    const fromClient = (name: string) => {
      const val = clientKeys?.[name]?.trim();
      return val && val !== 'configured_in_environment' && val !== 'live' ? val : undefined;
    };

    return {
      kiraKey: fromClient('KIRA_API_KEY') || process.env.KIRA_API_KEY?.trim(),
      kiraCodeKey: fromClient('KIRA_CODE_API_KEY') || process.env.KIRA_CODE_API_KEY?.trim(),
      nemotronKey: fromClient('NEMOTRON_API_KEY') || process.env.NEMOTRON_API_KEY?.trim(),
      geminiKey: fromClient('GEMINI_API_KEY') || process.env.GEMINI_API_KEY?.trim(),
      openaiKey: fromClient('OPENAI_API_KEY') || process.env.OPENAI_API_KEY?.trim(),
    };
  }

  /**
   * Checks which providers have keys configured.
   */
  static getAvailableProviders(keys: ResolvedAiKeys): string[] {
    const available: string[] = [];
    if (keys.kiraCodeKey) available.push('kira-coding');
    if (keys.kiraKey) available.push('kira-general');
    if (keys.nemotronKey) available.push('nemotron-ultra');
    if (keys.geminiKey) available.push('gemini');
    if (keys.openaiKey) available.push('openai');
    return available;
  }

  /**
   * Calls an OpenAI-compatible API endpoint (KiraAI, NVIDIA NIM, OpenAI).
   */
  static async callOpenAiCompatible(
    baseUrl: string,
    apiKey: string,
    model: string,
    messages: LlmMessage[],
    temperature: number = 0.3,
    maxTokens: number = 4000,
    timeoutMs: number = 25000
  ): Promise<{ content: string; tokensIn?: number; tokensOut?: number }> {
    const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Provider returned HTTP ${response.status}: ${errorText.slice(0, 300)}`);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const tokensIn = data.usage?.prompt_tokens;
      const tokensOut = data.usage?.completion_tokens;

      return { content, tokensIn, tokensOut };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Calls Google Gemini via @google/genai SDK.
   */
  static async callGemini(
    apiKey: string,
    model: string,
    messages: LlmMessage[],
    systemInstruction?: string,
    timeoutMs: number = 25000
  ): Promise<{ content: string; tokensIn?: number; tokensOut?: number }> {
    const ai = new GoogleGenAI({ apiKey });

    // Extract user content and system prompt
    const userMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');
    const combinedContent = userMessages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    const sysPrompt = systemInstruction || messages.find(m => m.role === 'system')?.content;

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: combinedContent,
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: 'application/json',
      },
    });

    const content = response.text || '';
    const tokensIn = response.usageMetadata?.promptTokenCount;
    const tokensOut = response.usageMetadata?.candidatesTokenCount;

    return { content, tokensIn, tokensOut };
  }

  /**
   * Executes LLM call with intelligent fallback across configured providers.
   */
  static async executeWithFallback(
    messages: LlmMessage[],
    requestedModel: string = 'auto',
    clientKeys?: Record<string, string>,
    systemInstruction?: string
  ): Promise<ProviderCallResult> {
    const startTime = performance.now();
    const keys = this.getResolvedKeys(clientKeys);
    const errors: string[] = [];

    // Define priority chain based on user keys
    // Priority:
    // 1. Kira Code (DeepSeek / GLM) if key exists
    // 2. Gemini if key exists
    // 3. Nemotron 3 Ultra if key exists
    // 4. Kira General if key exists
    // 5. OpenAI if key exists

    interface CallTarget {
      provider: string;
      model: string;
      caller: () => Promise<{ content: string; tokensIn?: number; tokensOut?: number }>;
    }

    const targets: CallTarget[] = [];

    // User explicitly requested a model
    if (requestedModel && requestedModel !== 'auto') {
      if (requestedModel.includes('deepseek') || requestedModel.includes('glm')) {
        if (keys.kiraCodeKey) {
          targets.push({
            provider: 'kira-coding',
            model: requestedModel,
            caller: () =>
              this.callOpenAiCompatible(
                process.env.KIRA_BASE_URL || 'https://api.kiraai.vn/v1',
                keys.kiraCodeKey!,
                requestedModel,
                messages
              ),
          });
        }
      } else if (requestedModel.includes('gemini')) {
        if (keys.geminiKey) {
          targets.push({
            provider: 'gemini',
            model: requestedModel,
            caller: () => this.callGemini(keys.geminiKey!, requestedModel, messages, systemInstruction),
          });
        }
      } else if (requestedModel.includes('nemotron')) {
        if (keys.nemotronKey) {
          targets.push({
            provider: 'nemotron-ultra',
            model: 'nvidia/nemotron-3-ultra',
            caller: () =>
              this.callOpenAiCompatible(
                'https://integrate.api.nvidia.com/v1',
                keys.nemotronKey!,
                'nvidia/nemotron-3-ultra',
                messages
              ),
          });
        }
      }
    }

    // Add fallback options based on available keys
    if (keys.kiraCodeKey && !targets.some(t => t.provider === 'kira-coding')) {
      targets.push({
        provider: 'kira-coding',
        model: 'deepseek-v4.1-flash',
        caller: () =>
          this.callOpenAiCompatible(
            process.env.KIRA_BASE_URL || 'https://api.kiraai.vn/v1',
            keys.kiraCodeKey!,
            'deepseek-v4.1-flash',
            messages
          ),
      });
    }

    if (keys.geminiKey && !targets.some(t => t.provider === 'gemini')) {
      targets.push({
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        caller: () => this.callGemini(keys.geminiKey!, 'gemini-2.5-flash', messages, systemInstruction),
      });
    }

    if (keys.nemotronKey && !targets.some(t => t.provider === 'nemotron-ultra')) {
      targets.push({
        provider: 'nemotron-ultra',
        model: 'nvidia/nemotron-3-ultra',
        caller: () =>
          this.callOpenAiCompatible(
            'https://integrate.api.nvidia.com/v1',
            keys.nemotronKey!,
            'nvidia/nemotron-3-ultra',
            messages
          ),
      });
    }

    if (keys.kiraKey && !targets.some(t => t.provider === 'kira-general')) {
      targets.push({
        provider: 'kira-general',
        model: 'kira-general-strong',
        caller: () =>
          this.callOpenAiCompatible(
            process.env.KIRA_BASE_URL || 'https://api.kiraai.vn/v1',
            keys.kiraKey!,
            'kira-general-strong',
            messages
          ),
      });
    }

    if (keys.openaiKey && !targets.some(t => t.provider === 'openai')) {
      targets.push({
        provider: 'openai',
        model: 'gpt-4o',
        caller: () =>
          this.callOpenAiCompatible(
            'https://api.openai.com/v1',
            keys.openaiKey!,
            'gpt-4o',
            messages
          ),
      });
    }

    // If no real keys are configured at all
    if (targets.length === 0) {
      return {
        success: false,
        provider: 'none',
        model: 'none',
        durationMs: Math.round(performance.now() - startTime),
        error: 'NO_API_KEYS_CONFIGURED: Add KIRA_CODE_API_KEY, KIRA_API_KEY, or NEMOTRON_API_KEY in Secrets Manager.',
      };
    }

    // Try each target in sequence
    for (const target of targets) {
      try {
        const result = await target.caller();
        const durationMs = Math.round(performance.now() - startTime);

        if (result.content && result.content.trim()) {
          return {
            success: true,
            content: result.content,
            provider: target.provider,
            model: target.model,
            tokensIn: result.tokensIn,
            tokensOut: result.tokensOut,
            durationMs,
          };
        }
      } catch (err: any) {
        errors.push(`${target.provider} (${target.model}): ${err.message}`);
        console.warn(`[AI Provider Failed] ${target.provider}: ${err.message}`);
      }
    }

    const durationMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      provider: targets[0]?.provider || 'unknown',
      model: targets[0]?.model || 'unknown',
      durationMs,
      error: `All AI providers failed:\n${errors.join('\n')}`,
    };
  }
}
