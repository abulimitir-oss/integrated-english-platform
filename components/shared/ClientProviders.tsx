'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from './AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}