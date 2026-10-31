import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getUserFromToken } from '@zyvora/auth';

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

export async function POST(request: Request) {
  const user = await getUserFromToken(tokenFrom(request));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? 'ZYVORA API Key').trim().slice(0, 80);
  const secret = `zx_live_${crypto.randomBytes(24).toString('hex')}`;
  return NextResponse.json({ name, key: secret, warning: 'This foundation endpoint returns the key once. Persist hashed keys in the Core database before production use.' }, { status: 201 });
}
