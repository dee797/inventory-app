/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/index.ejs",
    "./views/**/*.{html,js,ejs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [{
    tailwindcss: {},
    autoprefixer: {}
  }],
}