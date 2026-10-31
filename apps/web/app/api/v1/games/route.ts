import { NextResponse } from 'next/server';
import { getUserFromToken } from '@zyvora/auth';
import { getDb, games } from '@zyvora/database';
import { asc } from 'drizzle-orm';

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

export async function GET(request: Request) {
  const user = await getUserFromToken(tokenFrom(request));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await getDb().select().from(games).orderBy(asc(games.title));
  return NextResponse.json({ games: rows });
}
