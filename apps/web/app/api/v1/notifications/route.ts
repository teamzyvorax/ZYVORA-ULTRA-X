import { NextResponse } from 'next/server';
import { desc, eq, and } from 'drizzle-orm';
import { getUserFromToken } from '@zyvora/auth';
import { getDb, notifications } from '@zyvora/database';

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

async function authenticatedUser(request: Request) {
  return getUserFromToken(tokenFrom(request));
}

export async function GET(request: Request) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const items = await getDb().select().from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
  return NextResponse.json({
    notifications: items,
    unread: items.filter(item => !item.isRead).length
  });
}

export async function PATCH(request: Request) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { id?: string; all?: boolean };
  if (body.all) {
    await getDb().update(notifications).set({ isRead: true })
      .where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));
    return NextResponse.json({ updated: 'all' });
  }
  if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) {
    return NextResponse.json({ message: 'A valid notification id is required' }, { status: 400 });
  }
  await getDb().update(notifications).set({ isRead: true })
    .where(and(eq(notifications.id, body.id), eq(notifications.userId, user.id)));
  return NextResponse.json({ updated: body.id });
}
