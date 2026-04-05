import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata = {
  title: {
    default: 'ANTIGRAVITY — Real-time Video Collaboration',
    template: '%s | ANTIGRAVITY',
  },
  description:
    'Production-grade real-time video collaboration powered by WebRTC and Claude AI. HD meetings, live transcription, smart summaries.',
  keywords: ['video meetings', 'WebRTC', 'AI transcription', 'collaboration', 'ANTIGRAVITY'],
  authors: [{ name: 'ANTIGRAVITY Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'ANTIGRAVITY',
    title: 'ANTIGRAVITY — Real-time Video Collaboration',
    description: 'HD video meetings with AI superpowers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANTIGRAVITY',
    description: 'HD video meetings with AI superpowers.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'hsl(222 35% 12%)',
                  border: '1px solid hsl(222 28% 20%)',
                  color: 'hsl(210 40% 98%)',
                },
              }}
            />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
