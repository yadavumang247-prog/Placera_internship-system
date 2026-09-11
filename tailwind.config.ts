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
        // Primary Brand Accent: Beige Yellow / Warm Amber Gold
        primary: {
          DEFAULT: '#E5BA73',
          hover: '#D4A253',
          dark: '#B88530',
          light: '#F7EEDB',
          navy: '#0A1128',
        },
        // Secondary Warm Beige
        secondary: {
          DEFAULT: '#EFE7DA',
          hover: '#DFD4C0',
          dark: '#C5BAA8',
        },
        // Beige Yellow Palette
        beige: {
          DEFAULT: '#E5BA73',
          hover: '#D4A253',
          dark: '#B88530',
          light: '#F7EEDB',
          lighter: '#FDF8EE',
          muted: '#D8CEBC',
          accent: '#F3CA68',
        },
        // Deep Navy Blue Palette
        navy: {
          950: '#060B1B',
          900: '#0A1128', // Deep background navy
          850: '#0D1633',
          800: '#0F1A36', // Surface / container navy
          750: '#122043',
          700: '#142247', // Card navy
          600: '#1A2C5B', // Elevated / interactive hover
          500: '#253D7A',
          400: '#395AA5',
          border: '#1E3466',
          borderLight: '#2C488F',
        },
        accent: {
          DEFAULT: '#F3CA68',
          hover: '#E5BA73',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 14px -2px rgba(0, 0, 0, 0.5), 0 2px 8px -1px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px -3px rgba(229, 186, 115, 0.35)',
        'glow-navy': '0 0 25px -3px rgba(10, 17, 40, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
