cleanup()
const path = require('path')
const fs = require('fs')
const promisify = require('util').promisify
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const { spawn } = require('child_process')
const { exec } = require('pkg')
const bundle = require('./rollup')

// Parse args
let { PORT = 8080, ROOT = path.join('./static') } = parseArgs()

// Generate the config json since pkg doesn't support CLI args :(
const pkgConfig = {
  scripts: 'bundle.tmp.js',
  assets: getAllValidAssets(ROOT)
}
const json = JSON.stringify(pkgConfig)

bundle
  .then(() => readFile('bundle.js', 'utf8'))
  .then(replaceArgsInCode) // Override the configs if any passed from CLI
  .then(code => writeFile('bundle.tmp.js', code, 'utf8'))
  .then(writeFile('stupid-pkg.json', json, 'utf8'))
  .then(() => exec(['-t', 'linux', '-c', 'stupid-pkg.json', 'bundle.tmp.js']))
  .then(() => {
    const proc = spawn('./bundle.tmp')
    proc.stdout.on('data', data => console.log('stdout: ' + data.toString()))
    proc.stderr.on('data', data => console.log('stderr: ' + data.toString()))
  })
  .catch(err => {
    console.log('err', err)
    cleanup()
  })

function cleanup () {
  try {
    fs.unlinkSync('stupid-pkg.json')
    fs.unlinkSync('bundle.tmp.js')
    fs.unlinkSync('bundle.tmp')
  } catch (e) {}
}

function getAllValidAssets (root) {
  const valid = []
  try {
    const names = fs.readdirSync(root)
    names.forEach(fileName => {
      const fullName = `${root}/${fileName}`
      try {
        fs.accessSync(fullName, fs.constants.R_OK) // Permission check
        if (fs.statSync(fullName).isDirectory()) {
          valid.push(...getAllValidAssets(fullName))
        } else {
          valid.push(fullName)
        }
      } catch (e) {}
    })
  } catch (e) {}
  return valid
}

function parseArgs () {
  const args = process.argv.slice(2)
  let root
  let port
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-port') port = args[i++ + 1]
    if (args[i] === '-document_root') root = args[i++ + 1]
  }
  return { ROOT: root, PORT: port }
}

function replaceArgsInCode (code) {
  return code
    .replace(/PORT = 8080/g, `PORT = ${PORT}`)
    .replace(/ROOT = path\.join\(__dirname, 'static'\)/g, `ROOT = "${ROOT}"`)
}
