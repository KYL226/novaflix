// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
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
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}