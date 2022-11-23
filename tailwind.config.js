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
        'custom-y-screen-2': `calc(100vh - ${NAV_DIMENSION} - 1rem)`,
      },
      backgroundImage: {
        404: "url('../assets/images/forest.webp')",
      },
      minWidth: {
        80: '80%',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#6242d6',
          secondary: '#316991',
          accent: '#7c3ea8',
          neutral: '#1F2529',
          'base-100': '#2E4056',
          info: '#A7D0E7',
          success: '#146C38',
          warning: '#E1A605',
          error: '#E9779D',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
