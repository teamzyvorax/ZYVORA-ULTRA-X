import { NextResponse } from 'next/server';
import { revokeSession } from '@zyvora/auth';

export async function POST(request: Request) {
  const token = request.headers.get('cookie')?.match(/(?:^|;\s*)zyvora_session=([^;]+)/)?.[1];
  await revokeSession(token ? decodeURIComponent(token) : undefined);

  const response = NextResponse.json({ message: 'You have been signed out.' });
  response.cookies.set('zyvora_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
  return response;
}
