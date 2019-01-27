import http from 'http'
import server from './server'
import { PORT, ROOT } from './config'

http.createServer(server(ROOT))
  .listen(PORT, () => console.log(`Listening to ${PORT} for files on ${ROOT}.`))
