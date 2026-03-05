import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Cineo AI — Understand Movie Audiences Through AI',
  description: 'Enter an IMDb movie ID to get AI-powered audience sentiment analysis, cast details, and reviews.',
  keywords: ['movie sentiment', 'IMDb AI', 'audience reviews', 'Cineo AI'],
  openGraph: {
    title: 'Cineo AI',
    description: 'Understand movie audiences through AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        {children}
      </body>
    </html>
  );
}
