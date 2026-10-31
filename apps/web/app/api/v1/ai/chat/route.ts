import { NextResponse } from 'next/server';
import { getUserFromToken } from '@zyvora/auth';
import { generateAiReply } from '../../../../../lib/ai-provider';

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

export async function POST(request: Request) {
  const user = await getUserFromToken(tokenFrom(request));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt ?? '').trim();
  if (!prompt) return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
  try {
    const reply = await generateAiReply([
      { role: 'system', content: 'You are ZYVORA AI CORE, a concise, practical assistant inside the ZYVORA ULTRA X ecosystem.' },
      { role: 'user', content: prompt }
    ]);
    return NextResponse.json({ reply, mode: process.env.AI_PROVIDER === 'openai-compatible' ? 'provider' : 'foundation', user: user.username });
  } catch (error) {
    console.error('AI provider error', error);
    return NextResponse.json({ message: 'AI provider unavailable' }, { status: 502 });
  }
}
