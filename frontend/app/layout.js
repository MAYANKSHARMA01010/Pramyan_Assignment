import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Pramyan HR Management System',
  description: 'Enterprise Workforce Management & Attendance Telemetry Console',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
