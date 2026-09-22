/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#7892b8',
          500: '#5c7ba0',
          600: '#45607e',
          700: '#374b65',
          800: '#2a3a51',
          900: '#1d2a3d',
          950: '#131c2b',
        },
        teal: {
          50: '#effcf6',
          100: '#cbf5e6',
          200: '#99ead0',
          300: '#5fd9b8',
          400: '#34c19e',
          500: '#16a687',
          600: '#0d8470',
          700: '#0f6b5c',
          800: '#10554b',
          900: '#0f463e',
        },
        amber: {
          50: '#fffaeb',
          100: '#fef3c7',
          200: '#ffe9a8',
          300: '#ffd778',
          400: '#ffba37',
          500: '#fa9c12',
          600: '#de7c06',
          700: '#b85c07',
          800: '#95480c',
          900: '#783c0f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(29,42,61,0.08), 0 1px 2px -1px rgba(29,42,61,0.06)',
        'card-lg': '0 4px 16px -2px rgba(29,42,61,0.10), 0 2px 6px -2px rgba(29,42,61,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
