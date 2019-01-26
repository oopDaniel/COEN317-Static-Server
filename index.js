import http from 'http'

const PORT = 80

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World')
  res.end()
}).listen(PORT, () => console.log('Server started.'))
