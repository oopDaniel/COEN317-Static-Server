import path from 'path'
import fs from 'fs'
import getContentType from './contentTypeResolver'

export default ROOT => (req, res) => {
  // Helper function to send file
  const sendFile = sendFileToRes(res)

  // Resolve the path and file name, and set query to index.html if needed
  // This will disable accessing directory as well
  const rootPath = path.resolve(ROOT)
  let fileName = path.join(rootPath, req.url)
  if (fileName.endsWith('/')) fileName += 'index.html'

  fs.stat(fileName, (err, stat) => {
    // There's no such file
    if (err) {
      res.statusCode = 404
      const page404 = path.join(rootPath, '404.html')
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
      const page403 = path.join(rootPath, '403.html')
      const { size } = fs.statSync(page403)
      res.setHeader('Content-Length', size)
      res.setHeader('Content-Type', 'text/html')
      return sendFile(page403)
    }

    // Support 304 Not Modified to enable browser cache
    const mtime = new Date(stat.mtimeMs).toUTCString()
    if (req.headers['if-modified-since'] === mtime) {
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
