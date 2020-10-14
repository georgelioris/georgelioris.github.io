const mode = process.env.NODE_ENV;
const dev = mode === 'development';

module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.js'),
    require('postcss-import'),
    require('postcss-preset-env'),
    require('postcss-nested'),
    require('autoprefixer'),

    // Minify css in prod
    !dev &&
      require('cssnano')({
        preset: ['default', { discardComments: { removeAll: true } }]
      })
  ]
};
