import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

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
import { ExperienceBootstrap } from '@/components/layout/ExperienceBootstrap';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" />
      </head>
      <body>
        <div style={{ position: 'fixed', inset: 0, zIndex: -20, backgroundColor: 'var(--bg-base)' }} />
        <GhostFibersBackground />
        <ExperienceBootstrap />
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
