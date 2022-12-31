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
      screens: {
        xs: '480px',
      },
      spacing: {
        nav: NAV_DIMENSION,
        'custom-x-screen-2': `calc(100vw - ${NAV_DIMENSION} - 4rem)`,
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
      minHeight: {
        'custom-y-screen': `calc(100vh - ${NAV_DIMENSION})`,
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
      },
      gridTemplateColumns: {
        main: '1fr 3fr',
      },
      colors: {
        loader: '#FEFEFE',
      },
      boxShadow: {
        neumorphic: '-20px 20px 40px #cfcdcf,20px -20px 40px #ffffff;',
        'neumorphic-inset':
          'inset -5px 5px 10px #cfcdcf,inset 5px -5px 10px #ffffff;',
      },
      animation: {
        loader: 'fade 1s ease-out 2s 1 normal forwards',
      },
      keyframes: {
        fade: {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
            zIndex: '0',
          },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#0f706e',
          secondary: '#aff7a5',
          accent: '#ea5460',
          neutral: '#20252D',
          'base-100': '#F3F1F4',
          info: '#9FC7F4',
          success: '#128C4D',
          warning: '#996D05',
          error: '#F9535B',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
