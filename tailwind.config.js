/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{handlebars,html,js}","./public/js/**/*.{handlebars,html,js}"],
    theme: {
      extend: {
        colors: {
        'vanilla': '#E9D8A6',
        'alloy-orange': '#CA6702',
        'midnight-green': '#005F73',
    },
  },
},
      
    plugins: [],
      };