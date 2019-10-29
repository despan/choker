const Koa = require('koa')

const { RateLimit } = require('koa2-ratelimit')

/**
 * Create a Koa app with rate limiter
 *
 * @param {Number} [limit]
 *
 * @returns {Koa}
 */

function main (limit = Infinity) {
  const app = new Koa()

  const limiter = RateLimit.middleware({
    interval: 1000, // 1s
    max: limit
  })

  app.use(limiter)

  app.use(ctx => {
    ctx.status = 204
  })

  return app
}

// expose factory

module.exports = main
