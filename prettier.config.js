// https://prettier.io/docs/en/options.html
/** @type {import('prettier').RequiredOptions} */
module.exports = {
  trailingComma: 'none',
  bracketSpacing: true,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  printWidth: 125,
  overrides: [
    {
      files: 'Routes.*',
      options: {
        printWidth: 999
      }
    }
  ],
  tailwindConfig: './web/config/tailwind.config.js',
  plugins: [require('prettier-plugin-tailwindcss')],
}
