export type AiMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export type AiConfig = {
  provider: 'mock' | 'openai-compatible';
  baseUrl?: string;
  apiKey?: string;
  model?: string;
};

export function aiConfig(env: NodeJS.ProcessEnv = process.env): AiConfig {
  const provider = env.AI_PROVIDER === 'openai-compatible' ? 'openai-compatible' : 'mock';
  return { provider, baseUrl: env.AI_BASE_URL, apiKey: env.AI_API_KEY, model: env.AI_MODEL };
}

export async function generateReply(messages: AiMessage[], config = aiConfig()): Promise<string> {
  if (config.provider === 'mock' || !config.apiKey || !config.model) {
    const latest = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
    return `ZYVORA AI CORE received: “${latest}”. Provider layer is ready; add AI_PROVIDER=openai-compatible, AI_BASE_URL, AI_MODEL and AI_API_KEY to enable real inference.`;
  }

  const response = await fetch(`${(config.baseUrl ?? 'https://api.openai.com/v1').replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ model: config.model, messages, temperature: 0.7 })
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || 'AI provider returned an empty response.';
}
