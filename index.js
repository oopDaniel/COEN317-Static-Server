import http from 'http'
import server from './serve/server.js'
import { PORT, ROOT } from './serve/config.js'

http.createServer(server(ROOT))
  .listen(PORT, () => console.log(`Listening to ${PORT} for files on ${ROOT}.`))
