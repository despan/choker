const Koa = require('koa')

const random = require('random-normal')
const delay = require('delay')

const rateLimiter = require('./rate-limiter')

/**
 * Resolve requests successfully w/ 204
 *
 * @returns {Function}
 */

async function resolve (ctx, next) {
  // emulate computation load
  const systemLoad = random({ mean: 100, dev: 10 })
  await delay(systemLoad)

  // respond
  ctx.status = 204
  return next()
}

/**
 * Create a Koa app with rate limiter
 *
 * @param {Number} [limit]
 *
 * @returns {Koa}
 */

function factory (params = {}) {
  const app = new Koa()

  const limit = params.limit || Infinity
  app.use(rateLimiter(limit))

  app.use(resolve)

  return app
}

// expose factory

module.exports = factory
