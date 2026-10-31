import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.email || !body.password || !body.username) {
    return NextResponse.json({ message: 'Username, email and password are required.' }, { status: 400 });
  }
  if (String(body.password).length < 8) {
    return NextResponse.json({ message: 'Password must contain at least 8 characters.' }, { status: 400 });
  }
  return NextResponse.json({
    message: 'Registration endpoint is ready. Connect PostgreSQL persistence before production use.',
    token: `dev_${crypto.randomUUID()}`
  }, { status: 201 });
}
