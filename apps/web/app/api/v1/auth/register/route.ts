import { NextResponse } from 'next/server';
import { eq, or } from 'drizzle-orm';
import { createSession, hashPassword } from '@zyvora/auth';
import { getDb, users } from '@zyvora/database';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  if (!username || !email || !password) return NextResponse.json({ message: 'Username, email and password are required.' }, { status: 400 });
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) return NextResponse.json({ message: 'Username must be 3-24 characters using letters, numbers or underscore.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ message: 'Password must contain at least 8 characters.' }, { status: 400 });

  const existing = await getDb().select({ id: users.id }).from(users).where(or(eq(users.email, email), eq(users.username, username))).limit(1);
  if (existing.length) return NextResponse.json({ message: 'Username or email is already registered.' }, { status: 409 });

  const [user] = await getDb().insert(users).values({ username, email, passwordHash: await hashPassword(password) }).returning({ id: users.id });
  const session = await createSession(user.id);
  const response = NextResponse.json({ message: 'Account created.', user: { id: user.id, username, email } }, { status: 201 });
  response.cookies.set('zyvora_session', session.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: session.expiresAt });
  return response;
}
