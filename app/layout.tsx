import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://growcabulary.com'),
  title: {
    default: 'Growcabulary — Cultivate Your Lexicon & Explore Word Roots',
    template: '%s | Growcabulary',
  },
  description:
    'An educational vocabulary-building game and botanical etymology platform featuring Seed Sprout, Field Notes, In Your Own Words, Spaced-Repetition Watering, and an interactive Word Network in your Garden.',
  keywords: [
    'vocabulary',
    'etymology',
    'word roots',
    'spaced repetition',
    'vocabulary builder',
    'word game',
    'english lexicon',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Growcabulary — Cultivate Your Lexicon & Explore Word Roots',
    description:
      'Learn expressive English vocabulary through active recall, spaced repetition, and an interactive etymology word network.',
    url: 'https://growcabulary.com',
    siteName: 'Growcabulary',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growcabulary — Cultivate Your Lexicon & Explore Word Roots',
    description:
      'Cultivate your lexicon with Seed Sprout rounds, spaced-repetition flashcards, and an interactive word-root explorer.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
