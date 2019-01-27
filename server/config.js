let PORT = 8080
let ROOT = __dirname + '/static'
const args = process.argv.slice(2)

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-port') PORT = args[i++ + 1]
  if (args[i] === '-document_root') ROOT = args[i++ + 1]
}

export { PORT, ROOT }
