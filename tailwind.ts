import typography from "npm:@tailwindcss/typography";

export const tWindConfig = {
  darkMode: 'class',
  plugins: [typography],
  content: [
    'index.njk',
    '404.njk',
    './_includes/**/*.{html,njk}',
  ],
  safelist: ['ml-2', 'ml-4', 'ml-6'],
  theme: {
    extend: {
      colors: {
        blue: {
          dark: '#09142a',
        },
      },
    },
  },
  variants: {
    extend: {
      textColor: ['group-focus'],
    },
  },
};
