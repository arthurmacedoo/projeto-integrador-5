/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Paleta principal FinEdu (UI/UX PDF Design Tokens)
        cream: {
          DEFAULT: '#FAF8F5',
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F3EFE6',
          300: '#EFECE6',
          400: '#E5E0D5',
          500: '#D6D0C4',
        },
        sand: {
          DEFAULT: '#F3EFE6',
          light: '#FAF8F5',
          muted: '#EFECE6',
          border: '#E5E0D5',
          dark: '#D6D0C4',
        },
        forest: {
          DEFAULT: '#1E4631',
          dark: '#1B4332',
          deeper: '#132E20',
          medium: '#2D6A4F',
          light: '#E6F0EC',
          accent: '#A7F3D0',
        },
        mint: {
          DEFAULT: '#E6F0EC',
          border: '#B7E4C7',
        },
        amber: {
          bg: '#FEF3C7',
          border: '#FDE68A',
          text: '#B45309',
          dark: '#92400E',
          fill: '#D97706',
        },
        ink: {
          DEFAULT: '#1C1917',
          muted: '#57534E',
          subtle: '#78716C',
        },
        brand: {
          50:  '#E6F0EC',
          100: '#D1E7DD',
          200: '#B7E4C7',
          300: '#95D5B2',
          400: '#52B788',
          500: '#1E4631',  // verde escuro principal
          600: '#1B4332',
          700: '#163525',
          800: '#132E20',
          900: '#0D2016',
        },
        success: {
          DEFAULT: '#1E4631',
          light:   '#E6F0EC',
        },
        danger: {
          DEFAULT: '#DC2626',
          light:   '#FEE2E2',
        },
        warning: {
          DEFAULT: '#B45309',
          light:   '#FEF3C7',
        },
        // Níveis de gamificação
        level: {
          1: '#78716c', // Iniciante
          2: '#1E4631', // Aprendiz
          3: '#2D6A4F', // Consciente
          4: '#0F766E', // Estrategista
          5: '#B45309', // Guardião Financeiro
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
