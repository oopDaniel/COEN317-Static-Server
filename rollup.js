const fs = require('fs')
const promisify = require('util').promisify
const writeFile = promisify(fs.writeFile)
const rollup = require('rollup')
const rollupOptions = require('./rollup.config')

rollup.rollup(rollupOptions)
  .then(bundle => bundle.generate(rollupOptions.output))
  .then(({ output: data }) => data[0].code)
  .then(code => code
    .replace(/[.]+\/static/g, 'static'))
  .then(code => writeFile('bundle.js', code, 'utf8'))
