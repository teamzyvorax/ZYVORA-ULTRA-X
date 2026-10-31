import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.email || !body.password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }
  return NextResponse.json({
    message: 'Login endpoint is ready. Connect PostgreSQL + secure session storage before production use.',
    token: `dev_${crypto.randomUUID()}`
  });
}
