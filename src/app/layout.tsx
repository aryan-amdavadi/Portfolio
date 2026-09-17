import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aryanamdavadi.com'),
  title: {
    default: 'Aryan Amdavadi | Software Engineer',
    template: '%s | Aryan Amdavadi'
  },
  description: 'I build software around real-world problems. Full-stack engineer moving toward AI engineering.',
  openGraph: {
    title: 'Aryan Amdavadi | Software Engineer',
    description: 'I build software around real-world problems. Full-stack engineer moving toward AI engineering.',
    url: '/',
    siteName: 'Aryan Amdavadi Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aryan Amdavadi | Software Engineer',
    description: 'Full-stack engineer moving toward AI engineering.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

import { GhostFibersBackground } from '@/components/backgrounds/GhostFibersBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetBrainsMono.variable} ${playfair.variable}`}>
      <body>
        <GhostFibersBackground />
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
