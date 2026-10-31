import { NextResponse } from 'next/server';
import { getUserFromToken } from '@zyvora/auth';

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

export async function POST(request: Request) {
  const user = await getUserFromToken(tokenFrom(request));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt ?? '').trim();
  if (!prompt) return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
  return NextResponse.json({
    reply: `ZYVORA AI CORE received: “${prompt}”. AI routing is online. Connect an approved model provider in the AI service layer to enable full model inference.`,
    mode: 'core-foundation',
    user: user.username
  });
}
