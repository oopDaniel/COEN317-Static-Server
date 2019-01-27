require('./rollup')
const path = require('path')
const fs = require('fs')

// Parse args
let PORT = 8080
let ROOT = path.resolve(__dirname, 'static')
const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-port') PORT = args[i++ + 1]
  if (args[i] === '-document_root') ROOT = args[i++ + 1]
}

// Generate the config json since pkg doesn't support command line args...
const pkgConfig = {
  scripts: 'bundle.tmp.js',
  assets: getAllFiles(ROOT)
}
const json = JSON.stringify(pkgConfig)
try {
  const data = fs.readFileSync('bundle.js', 'utf8')
  // Override the configs if there's any passed from command line
  const result = data
    .replace(/PORT = 8080/g, `PORT = ${PORT}`)
    .replace(/ROOT = path\.resolve\(__dirname, 'static'\)/g, `ROOT = "${ROOT}"`)
  fs.writeFileSync('bundle.tmp.js', result, 'utf8')
  fs.writeFileSync('stupid-pkg.json', json, 'utf8')
} catch (err) {
  console.log('err', err)
  cleanup()
}

const { exec } = require('pkg')
exec(['-t', 'macos', '-c', 'stupid-pkg.json', 'bundle.tmp.js'])
  .then(() => {
    const { spawn } = require('child_process')
    const proc = spawn('./bundle.tmp')
    proc.stdout.on('data', data => console.log('stdout: ' + data.toString()))
    proc.stderr.on('data', data => {
      console.log('stderr: ' + data.toString())
      cleanup()
    })
  })
  .catch(cleanup)

function cleanup () {
  try {
    fs.unlinkSync('stupid-pkg.json')
    fs.unlinkSync('bundle.tmp.js')
    fs.unlinkSync('bundle.tmp')
  } catch (e) {}
}

function getAllFiles (root) {
  const valid = []
  try {
    const names = fs.readdirSync(root)
    names.forEach(fileName => {
      const fullName = `${root}/${fileName}`
      try {
        fs.accessSync(fullName, fs.constants.R_OK)
        if (fs.statSync(fullName).isDirectory()) {
          valid.push(...getAllFiles(fullName))
        } else {
          valid.push(fullName)
        }
      } catch (e) {}
    })
  } catch (e) {}
  return valid
}
