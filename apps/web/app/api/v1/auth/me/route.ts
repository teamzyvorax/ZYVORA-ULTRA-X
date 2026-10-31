import { NextResponse } from 'next/server';
import { getUserFromToken } from '@zyvora/auth';

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user });
}
