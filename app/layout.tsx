import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'SMARTINTERN | Smart Internship Allocation & Placement System',
  description:
    'A centralized platform for managing internship opportunities, student preferences, eligibility and internship allocation.',
  keywords: [
    'SMARTINTERN',
    'Smart Internship Allocation',
    'Placement Management System',
    'Campus Placements',
    'Internship Allocation',
    'Student Career Services',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0B1120] text-[#F8FAFC] antialiased font-sans selection:bg-[#0284C7] selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
