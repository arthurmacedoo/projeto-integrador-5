/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Paleta principal FinEdu
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // azul principal
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          DEFAULT: '#22c55e',
          light:   '#dcfce7',
        },
        danger: {
          DEFAULT: '#ef4444',
          light:   '#fee2e2',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light:   '#fef3c7',
        },
        // Níveis de gamificação
        level: {
          1: '#78716c', // marrom — Iniciante
          2: '#22c55e', // verde  — Aprendiz
          3: '#3b82f6', // azul   — Consciente
          4: '#a855f7', // roxo   — Estrategista
          5: '#f59e0b', // dourado — Guardião Financeiro
        },
      },
      fontFamily: {
        sans:  ['System'],
      },
    },
  },
  plugins: [],
};
