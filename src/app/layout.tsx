import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

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
    <html lang="en" data-theme="dark">
      <body>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
