const fs = require('fs')
const promisify = require('util').promisify
const writeFile = promisify(fs.writeFile)
const rollup = require('rollup')
const rollupOptions = require('./rollup.config')

module.exports = rollup.rollup(rollupOptions)
  .then(bundle => bundle.generate(rollupOptions.output))
  // Extract the code
  .then(({ output: data }) => data[0].code)
  // Fixed incorrect folder reference with single file at root level
  .then(code => code
    .replace(/[.]+\/static/g, 'static'))
  // To `bundle.js`
  .then(code => writeFile('bundle.js', code, 'utf8'))
