const Koa = require('koa')

const rateLimiter = require('./rate-limiter')

/**
 * Resolve requests successfully w/ 204
 *
 * @returns {Function}
 */

function resolve (ctx, next) {
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
