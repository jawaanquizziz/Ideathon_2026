/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // Strict SaaS Green
        'primary-hover': '#16a34a',
        'primary-light': '#dcfce7',
        'primary-dark': '#15803d',
        surface: '#f9fafb',
        'surface-card': '#ffffff',
        'surface-hover': '#f3f4f6',
        'surface-border': '#e5e7eb',
        background: '#f3f4f6',
        'on-surface': '#111827',
        'on-surface-variant': '#4b5563',
        'on-surface-light': '#6b7280',
        error: '#ef4444',
        'error-bg': '#fee2e2',
        warning: '#f59e0b',
        'warning-bg': '#fef3c7',
        info: '#3b82f6',
        'info-bg': '#dbeafe',
      },
      borderRadius: {
        DEFAULT: '12px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Professional sans
        headline: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
