import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#38BDF8',
          hover: '#0EA5E9',
          dark: '#0284C7',
          navy: '#1E3A5F',
        },
        secondary: {
          DEFAULT: '#818CF8',
          hover: '#6366F1',
        },
        accent: {
          DEFAULT: '#34D399',
          hover: '#10B981',
        },
        portal: {
          bg: '#0B1120',
          surface: '#0F172A',
          card: '#1E293B',
          cardHover: '#243248',
          border: '#334155',
          borderSubtle: '#1E293B',
          text: '#F8FAFC',
          textSecondary: '#CBD5E1',
          muted: '#94A3B8',
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#F87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        glow: '0 0 15px -3px rgba(56, 189, 248, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
