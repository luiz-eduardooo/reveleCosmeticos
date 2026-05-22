import type { Config } from 'tailwindcss'

/**
 * Tokens espelhados 1:1 do Design System v1.0 da Revele Cosméticos.
 * Não alterar valores sem atualizar o design system de referência.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#FBF5F6',
          100: '#F4E3E6',
          200: '#E6BFC5',
          300: '#D4969F',
          400: '#B96974',
          500: '#9C4250',
          600: '#7A1F2B', // brand
          700: '#651822',
          800: '#4E121A',
          900: '#350C12',
        },
        ink: {
          50: '#F7F5F1',
          100: '#EFEDE8',
          200: '#E4E1DC',
          300: '#C7C3BD',
          400: '#A39E97',
          500: '#7E7972',
          600: '#5C5852',
          700: '#3E3B38',
          800: '#2A2826',
          900: '#1A1A1A',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFAF7',
        },
        success: { DEFAULT: '#3F7D58', soft: '#E8F0EB' },
        danger: { DEFAULT: '#B43A3A', soft: '#F8E8E8' },
        warning: { DEFAULT: '#B07A1F', soft: '#F6EEDB' },
        info: { DEFAULT: '#3B5A82', soft: '#E6ECF3' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Times New Roman"', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      fontSize: {
        micro: ['0.75rem', { lineHeight: '1.4' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        body: ['1rem', { lineHeight: '1.55' }],
        h4: ['1.25rem', { lineHeight: '1.3' }],
        h3: ['1.75rem', { lineHeight: '1.2' }],
        h2: ['2.5rem', { lineHeight: '1.1' }],
        h1: ['3.5rem', { lineHeight: '1' }],
        display: ['4.5rem', { lineHeight: '1' }],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        pill: '999px',
      },
      boxShadow: {
        'e1': '0 1px 2px rgba(26,26,26,.04), 0 1px 1px rgba(26,26,26,.03)',
        'e2': '0 2px 6px rgba(26,26,26,.05), 0 4px 12px rgba(26,26,26,.04)',
        'e3': '0 8px 24px rgba(26,26,26,.06), 0 2px 6px rgba(26,26,26,.04)',
        'e4': '0 24px 48px rgba(26,26,26,.10), 0 6px 16px rgba(26,26,26,.06)',
      },
      spacing: {
        // escala base 4px do design system
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '32px',
        '8': '40px',
        '9': '48px',
        '10': '64px',
        '11': '80px',
        '12': '96px',
        '13': '128px',
      },
      letterSpacing: {
        eyebrow: '0.18em',
        wide2: '0.12em',
      },
      maxWidth: {
        container: '1280px',
        'container-narrow': '1100px',
        prose60: '60ch',
      },
    },
  },
  plugins: [],
}

export default config
