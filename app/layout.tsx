// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';
import AuthNotification from '@/components/AuthNotification';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <AuthErrorBoundary>
              <Header />
              <main>{children}</main>
              <AuthNotification />
            </AuthErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}