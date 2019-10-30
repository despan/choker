const getPort = require('get-port')

const createApp = require('./app')

/**
 * Create a HTTP server
 *
 * @param {Number} [limit] - rate limit
 *
 * @returns {Koa}
 */

async function factory ({ limit = Infinity } = {}) {
  // acquire an available port
  const port = await getPort()

  // run the server
  const server = await new Promise(resolve => {
    const app = createApp({ limit })
    const server = app.listen(port, () => resolve(server))
  })

  //
  const url = `http://localhost:${port}`

  return {
    url,
    server
  }
}

//

module.exports = factory
