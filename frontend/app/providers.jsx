'use client';
import { AuthProvider } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <DashboardProvider>{children}</DashboardProvider>
    </AuthProvider>
  );
}
