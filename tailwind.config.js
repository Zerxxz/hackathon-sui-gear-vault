/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: '#0a0a0f',
          darker: '#050508',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          gold: '#fbbf24',
          silver: '#94a3b8',
          bronze: '#cd7f32',
        },
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
}