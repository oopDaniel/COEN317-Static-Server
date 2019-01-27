// Get 'content-type' by file name

export default fileName => {
  const fileExt = fileName.split('.').pop()

  switch (fileExt) {
    case 'html':
      return 'text/html'
    case 'js':
      return 'text/javascript'
    case 'css':
      return 'text/css'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    default:
      return 'text/plain'
  }
}
