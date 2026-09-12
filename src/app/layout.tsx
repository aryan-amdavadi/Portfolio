import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Aryan Amdavadi | Software Engineer',
  description: 'I am a developer who solves real-world problems. Full-stack engineer moving toward AI engineering.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetBrainsMono.variable} ${playfair.variable}`}>
      <body>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
