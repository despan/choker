const Koa = require('koa')

const Router = require('koa-router')

const getPort = require('get-port')
const R = require('ramda')

const delay = require('delay')
const randomNormal = require('random-normal')

/*
 * Settings
 */

const LATENCY_OPTIONS = {
  mean: 50,
  dev: 5
}

/*
 * Helpers
 */

const checkCapacity = (opts, history) => {
  const { limit, interval } = opts

  const t0 = Date.now() - interval
  const tail = R.takeLastWhile(time => time > t0, history)

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
 * Create a Koa app with rate limiter
 *
 * @param {Object} rate
 * @param {number} rate.limit
 * @param {number} rate.interval
 *
 * @returns {Koa}
 */

function createApp (rate) {
  const app = new Koa()
  const router = new Router()

  const history = []

  const hasCapacity = () => checkCapacity(rate, history)

  router
    .use(latency())
    .use('/hit/:key', (ctx, next) => {
      if (!hasCapacity()) {
        ctx.status = 429
        return null // short circuit
      }

      // insert new record
      history.push(Date.now())

      return next()
    })
    .get('/hit/:key', (ctx, next) => {
      ctx.status = 204
    })

  app.use(router.routes())

  return app
}

async function runServer (opts) {
  // acquire an available port
  const port = await getPort()

  // run the server
  const server = await new Promise(resolve => {
    const app = createApp(opts)
    const server = app.listen(port, () => resolve(server))
  })

  return {
    server,
    baseUrl: `http://localhost:${port}`
  }
}

// expose factory

module.exports = {
  createApp,
  runServer
}
