import AuthLoader from '@/components/auth/AuthLoader';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lista Fácil',
  description: 'Suas compras em tempo real',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <main className="flex flex-col min-h-dvh w-full border-0 md:border-x border-border shadow-2xl relative px-2 md:px-2">
          <AuthLoader />
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
