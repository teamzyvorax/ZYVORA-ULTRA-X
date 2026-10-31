export type AiMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function generateAiReply(messages: AiMessage[]) {
  const latest = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  const provider = process.env.AI_PROVIDER ?? 'mock';
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const baseUrl = (process.env.AI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');

  if (provider !== 'openai-compatible' || !apiKey || !model) {
    return `ZYVORA AI CORE received: “${latest}”. Provider layer is ready. Add AI_PROVIDER=openai-compatible, AI_BASE_URL, AI_MODEL and AI_API_KEY for real inference.`;
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.7 })
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || 'AI provider returned an empty response.';
}
