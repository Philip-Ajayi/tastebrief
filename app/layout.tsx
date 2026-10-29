import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TasteBrief — Cross-Border Inbound Taste Intelligence',
  description:
    'Transforms Qloo v2 cultural taste graph data into actionable venue programming memos for independent hospitality operators.',
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-gray-100">
        {children}
      </body>
    </html>
  );
}
