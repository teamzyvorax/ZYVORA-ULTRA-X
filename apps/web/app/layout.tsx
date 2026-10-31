import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'ZYVORA ULTRA X', description: 'AI OS • Cyber World • Metaverse • Cloud' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
