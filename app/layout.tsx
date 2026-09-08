import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'Smart Internship Allocation System | Algorithm-Based Platform',
  description:
    'A college AOA (Analysis and Optimization of Algorithms) project demonstrating intelligent, deterministic multi-criteria greedy optimization for fair and efficient internship allocation.',
  keywords: [
    'Internship Allocation',
    'Algorithm Optimization',
    'AOA Project',
    'Greedy Algorithm',
    'Multi-Criteria Scoring',
    'College Placement',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-indigo-500 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
