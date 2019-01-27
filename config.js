let PORT = 8080
let ROOT = './static'

const args = process.argv.slice(2)
args.forEach(arg => {
  const [key, value] = arg.split('=')
  if (key === 'port') PORT = value
  if (key === 'document_root') ROOT = value
})

export { PORT, ROOT }
