/** @type {import('tailwindcss').Config} */
const NAV_DIMENSION = '4rem';

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
      },
    },
    extend: {
      spacing: {
        nav: NAV_DIMENSION,
        'custom-x-screen': `calc(100vw - ${NAV_DIMENSION})`,
        'custom-y-screen': `calc(100vh - ${NAV_DIMENSION})`,
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#359b09',
          secondary: '#58cc4b',
          accent: '#584ff2',
          neutral: '#1B1820',
          'base-100': '#36313A',
          info: '#8EBEF6',
          success: '#19E66B',
          warning: '#DA7C10',
          error: '#FA296B',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
