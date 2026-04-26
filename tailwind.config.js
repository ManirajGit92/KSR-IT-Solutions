/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'on-primary': 'var(--color-on-primary)',
        'surface-container': 'var(--color-surface-container)',
        'on-background': 'var(--color-on-background)',
        'tertiary-fixed': 'var(--color-tertiary-fixed)',
        'tertiary-fixed-dim': 'var(--color-tertiary-fixed-dim)',
        'secondary-container': 'var(--color-secondary-container)',
        'on-tertiary-fixed-variant': 'var(--color-on-tertiary-fixed-variant)',
        'error': 'var(--color-error)',
        'on-primary-fixed-variant': 'var(--color-on-primary-fixed-variant)',
        'surface-dim': 'var(--color-surface-dim)',
        'outline': 'var(--color-outline)',
        'secondary-fixed-dim': 'var(--color-secondary-fixed-dim)',
        'on-secondary-fixed-variant': 'var(--color-on-secondary-fixed-variant)',
        'on-surface': 'var(--color-on-surface)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'on-primary-fixed': 'var(--color-on-primary-fixed)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'on-error': 'var(--color-on-error)',
        'on-tertiary-fixed': 'var(--color-on-tertiary-fixed)',
        'on-tertiary': 'var(--color-on-tertiary)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'inverse-primary': 'var(--color-inverse-primary)',
        'on-secondary-fixed': 'var(--color-on-secondary-fixed)',
        'inverse-on-surface': 'var(--color-inverse-on-surface)',
        'outline-variant': 'var(--color-outline-variant)',
        'inverse-surface': 'var(--color-inverse-surface)',
        'on-error-container': 'var(--color-on-error-container)',
        'on-secondary-container': 'var(--color-on-secondary-container)',
        'on-secondary': 'var(--color-on-secondary)',
        'surface-variant': 'var(--color-surface-variant)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'primary-fixed': 'var(--color-primary-fixed)',
        'on-primary-container': 'var(--color-on-primary-container)',
        'surface-tint': 'var(--color-surface-tint)',
        'primary': 'var(--color-primary)',
        'primary-fixed-dim': 'var(--color-primary-fixed-dim)',
        'tertiary-container': 'var(--color-tertiary-container)',
        'background': 'var(--color-background)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'secondary-fixed': 'var(--color-secondary-fixed)',
        'primary-container': 'var(--color-primary-container)',
        'surface-bright': 'var(--color-surface-bright)',
        'surface': 'var(--color-surface)',
        'secondary': 'var(--color-secondary)',
        'error-container': 'var(--color-error-container)',
        'tertiary': 'var(--color-tertiary)',
        'on-tertiary-container': 'var(--color-on-tertiary-container)'
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
