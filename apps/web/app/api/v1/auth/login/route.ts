import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { createSession, verifyPassword } from '@zyvora/auth';
import { getDb, users } from '@zyvora/database';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  if (!email || !password) return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });

  const [user] = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });

  const session = await createSession(user.id);
  const response = NextResponse.json({ message: 'Welcome back.', user: { id: user.id, username: user.username, email: user.email, level: user.level, xp: user.xp } });
  response.cookies.set('zyvora_session', session.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: session.expiresAt });
  return response;
}
