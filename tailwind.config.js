module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'hero-pattern': "url('./src/assets/imgBg.jpg')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
