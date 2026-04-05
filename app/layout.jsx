import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata = {
  title: {
    default: 'Rohan — Human-first Video Collaboration',
    template: '%s | Rohan',
  },
  description:
    'A human-first meeting experience powered by WebRTC and Claude AI. Natural conversations, live notes, and warm follow-up summaries.',
  keywords: ['video meetings', 'WebRTC', 'AI transcription', 'collaboration', 'Rohan'],
  authors: [{ name: 'Rohan Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Rohan',
    title: 'Rohan — Human-first Video Collaboration',
    description: 'Meetings that feel natural, helpful, and easy to use.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohan',
    description: 'Meetings that feel natural, helpful, and easy to use.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
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
