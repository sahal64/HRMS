/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        canvas: {
          DEFAULT: '#f6f5f0',
          card: '#ffffff',
          subtle: '#eeece5',
          border: '#e5e2d9',
        },
        terracotta: {
          50: '#fdf4f3',
          100: '#fbe8e5',
          200: '#f7d4ce',
          300: '#f1b3a8',
          400: '#e88775',
          500: '#e05842', // Main Design 3 accent
          600: '#cc422d',
          700: '#ab3322',
          800: '#8c2c1e',
          900: '#73291e',
        },
        primary: {
          DEFAULT: '#e05842',
          foreground: '#ffffff',
          50: '#fdf4f3',
          100: '#fbe8e5',
          200: '#f7d4ce',
          300: '#f1b3a8',
          400: '#e88775',
          500: '#e05842',
          600: '#cc422d',
          700: '#ab3322',
          800: '#8c2c1e',
          900: '#73291e',
        },
        sidebar: {
          DEFAULT: '#eeece6',
          foreground: '#44403c',
          active: '#e05842',
          'active-bg': '#fbe8e5',
          border: '#e2dfd6',
          muted: '#8c867a',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        }
      },
      borderRadius: {
        xl: '14px',
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
