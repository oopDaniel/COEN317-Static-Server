const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

module.exports = {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
