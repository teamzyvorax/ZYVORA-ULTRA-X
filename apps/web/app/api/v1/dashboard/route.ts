import { NextResponse } from 'next/server';
import { getSessionUser } from '@zyvora/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ online: true, user: { id: user.id, username: user.username, level: user.level, xp: user.xp } });
}
