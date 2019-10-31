const getPort = require('get-port')

const createApp = require('./app')

/**
 * Create a HTTP server
 *
 * @param {Number} [interval]
 * @param {Number} [limit] - rate limit
 *
 * @returns {Koa}
 */

async function factory (opts) {
  // acquire an available port
  const port = await getPort()

  // run the server
  const server = await new Promise(resolve => {
    const app = createApp(opts)
    const server = app.listen(port, () => resolve(server))
  })

  //
  const baseUrl = `http://localhost:${port}`

  return {
    baseUrl,
    server
  }
}

//

module.exports = factory
