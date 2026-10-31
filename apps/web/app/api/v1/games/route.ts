import { NextResponse } from 'next/server';
import { getSessionUser } from '@zyvora/auth';
import { db } from '@zyvora/database';
import { games } from '@zyvora/database/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await db.select().from(games).orderBy(asc(games.title));
  return NextResponse.json({ games: rows });
}
