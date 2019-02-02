/* global describe it */
/* eslint no-unused-expressions: 0 */

require('should')
const axios = require('axios')
const PORT = 8080

describe('Status 200', () => {
  it('should serve / as index.html', () => axios
    .get(`http://localhost:${PORT}`)
    .then(res => {
      res.headers['content-type'].includes('text/html').should.be.true
      res.status.should.equal(200)
    })
  )

  it('should serve jpg', () => axios
    .get(`http://localhost:${PORT}/404.jpg`)
    .then(res => {
      res.headers['content-type'].includes('image/jpeg').should.be.true
      res.status.should.equal(200)
    })
  )

  it('should serve gif', () => axios
    .get(`http://localhost:${PORT}/403.gif`)
    .then(res => {
      res.headers['content-type'].includes('image/gif').should.be.true
      res.status.should.equal(200)
    })
  )
})

describe('Status 404', () => {
  it('should handle non-existing path', () => axios
    .get(`http://localhost:${PORT}/zxcdsaqweasdczx`)
    .catch(err => {
      err.response.status.should.equal(404)
    })
  )
})

describe('Status 403', () => {
  it('should reject accessing files with no permission', () => axios
    .get(`http://localhost:${PORT}/private.html`)
    .catch(err => {
      err.response.status.should.equal(403)
    })
  )
})
