/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'spin-steps': {
          from: {transform: 'rotate(0deg)'},
          to: {transform: 'rotate(360deg)'},
        },
      },
      animation: {
        'spin-steps': 'spin-steps 1s steps(8) infinite',
      },
    },
  },
};
