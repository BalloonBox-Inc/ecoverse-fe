/** @type {import('tailwindcss').Config} */
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
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#ce0a76',
          secondary: '#6d2caa',
          accent: '#c100fc',
          neutral: '#161D22',
          'base-100': '#2D345D',
          info: '#7ABBDC',
          success: '#60EBDD',
          warning: '#A5660D',
          error: '#F6517A',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
