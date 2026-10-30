import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TasteBrief — Understand Your Guests',
  description:
    'Discover what international visitors enjoy and make better decisions about your venue, menu and atmosphere.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#252D26] antialiased">
        {children}
      </body>
    </html>
  );
}