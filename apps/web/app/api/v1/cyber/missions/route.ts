import { NextResponse } from 'next/server';
import { getUserFromToken } from '@zyvora/auth';

const missions = [
  { id: 'signal-01', title: 'Recover the Signal', zone: 'Neon District', difficulty: 'EASY', xp: 50 },
  { id: 'vault-02', title: 'Break the Vault', zone: 'Black Sector', difficulty: 'MEDIUM', xp: 120 },
  { id: 'core-03', title: 'Defend the Core', zone: 'Core Tower', difficulty: 'HARD', xp: 250 },
  { id: 'ghost-04', title: 'Find the Ghost Node', zone: 'Zero City', difficulty: 'EPIC', xp: 500 }
];

function tokenFrom(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? request.headers.get('cookie')?.match(/zyvora_session=([^;]+)/)?.[1];
}

export async function GET(request: Request) {
  const user = await getUserFromToken(tokenFrom(request));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ missions, player: { username: user.username, level: user.level, xp: user.xp } });
}
