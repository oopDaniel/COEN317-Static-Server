import http from 'http'
import server from './server/server.js'
import { PORT, ROOT } from './server/config.js'

http.createServer(server(ROOT))
  .listen(PORT, () => console.log(`Listening to ${PORT} for files on ${ROOT}.`))
