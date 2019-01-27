import path from 'path'
import fs from 'fs'
import getContentType from './contentTypeResolver'

export default ROOT => (req, res, next) => {
  const sendFile = sendFileToRes(res)

  // Resolve the path and file name, and query index.html if needed
  const rootPath = path.resolve(ROOT)
  let fileName = path.join(rootPath, req.url)
  const page404 = path.join(rootPath, '404.html')
  if (fileName.endsWith('/')) fileName += 'index.html'

  fs.stat(fileName, (err, stat) => {

    // There's no such file
    if (err) {
      res.statusCode = 404
      const { size } = fs.statSync(page404)
      res.setHeader('Content-Length', size)
      res.setHeader('Content-Type', 'text/html')
      return sendFile(page404)
    }

    // Permission check
    try {
      fs.accessSync(fileName, fs.constants.R_OK)
    } catch (err) {
      res.statusCode = 403
      return res.end()
    }

    // Support 304 Not modified
    const mtime = new Date(stat.mtimeMs).toUTCString()
    if (req.headers['if-modified-since'] === mtime){
      res.statusCode = 304
      return res.end()
    }

    // At this point, we know it's a valid request, so 200
    res.statusCode = 200
    res.setHeader('Last-Modified', mtime)
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', getContentType(fileName))
    sendFile(fileName)
  })
}

function sendFileToRes (res) {
  return fileName => fs.createReadStream(fileName).pipe(res)
}
