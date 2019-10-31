const Koa = require('koa')

const Router = require('koa-router')

const R = require('ramda')

const delay = require('delay')
const randomNormal = require('random-normal')

/*
 * Settings
 */

const LIMIT = Infinity
const INTERVAL = 1000

const LATENCY_OPTIONS = {
  mean: 50,
  dev: 5
}

/*
 * Helpers
 */

const checkCapacity = (opts = {}, history) => {
  const limit = opts.limit || LIMIT
  const interval = opts.interval || INTERVAL

  const time = Date.now() - interval
  const tail = R.takeLastWhile(row => row.time > time, history)

  return tail.length < limit
}

/**
 *
 */

function latency () {
  const opts = LATENCY_OPTIONS

  return async (ctx, next) => {
    const dt = randomNormal(opts)
    await delay(dt)

    return next()
  }
}

/**
 *
 */

function routes (opts) {
  const router = new Router()

  const history = []
  const hasCapacity = () => checkCapacity(opts, history)

  router.get('/history', ctx => {
    ctx.body = history
  })

  router
    .use('/hit/:key', (ctx, next) => {
      if (!hasCapacity()) {
        ctx.status = 429
        return null // short circuit
      }

      const { params } = ctx

      // insert new record
      history.push({
        key: params.key,
        time: Date.now()
      })

      return next()
    })
    .use(latency())
    .get('/hit/:key', (ctx, next) => {
      ctx.status = 204
    })

  return router.routes()
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

  app.use(routes(params))

  return app
}

// expose factory

module.exports = factory
