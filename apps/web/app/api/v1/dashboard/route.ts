import { NextResponse } from 'next/server';
import { getUserFromToken } from '@zyvora/auth';

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

export async function GET(request: Request) {
  const user = await getUserFromToken(tokenFrom(request));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ online: true, user: { id: user.id, username: user.username, level: user.level, xp: user.xp } });
}
