import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { QueryProvider } from '@/lib/query';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SecureFlow - DevSecOps Platform',
    template: '%s | SecureFlow',
  },
  description: 'Automated DevSecOps platform for continuous vulnerability detection',
  keywords: ['DevSecOps', 'vulnerability scanning', 'security', 'GitHub', 'CI/CD'],
  authors: [{ name: 'SecureFlow Team' }],
  creator: 'SecureFlow',
  publisher: 'SecureFlow',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://secureflow.io',
    title: 'SecureFlow - DevSecOps Platform',
    description: 'Automated DevSecOps platform for continuous vulnerability detection',
    siteName: 'SecureFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecureFlow - DevSecOps Platform',
    description: 'Automated DevSecOps platform for continuous vulnerability detection',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full bg-canvas text-text-primary flex flex-col">
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}