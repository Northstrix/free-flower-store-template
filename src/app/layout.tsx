import type {Metadata} from 'next';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Flower Store',
  description: 'A free, open-source flower store template distributed under the MIT License.',
  icons: {
    icon: '/logo.webp',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500&family=Gloria+Hallelujah&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        <Suspense fallback={null}>
          <AppProvider>
            {children}
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
