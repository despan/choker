import test from 'ava'

import getPort from 'get-port'
import got from 'got'

import createServer from '../src/server'

/*
 * Settings
 */

const LIMIT = 5

/*
 * Hooks
 */

// setup
test.beforeEach(async t => {
  const app = createServer(LIMIT)

  // acquire an available port
  const port = await getPort()

  // run the server
  const server = await new Promise(resolve => {
    const server = app.listen(port, () => resolve(server))
  })

  // supply for later usage
  t.context = {
    server,
    url: `http://localhost:${port}`
  }
})

// tear down
test.afterEach(async t => {
  const { server } = t.context
  server.close()
})

/*
 * Tests
 */

test.serial('single request', async t => {
  const { url } = t.context

  const { statusCode } = await got(url)

  t.is(statusCode, 204)
})

test.serial('rate limiter', async t => {
  const { url } = t.context

  const exceed = () => {
    // deliberately run more
    const length = LIMIT + 10

    // make parallel requests
    const ps = Array
      .from({ length })
      .map(() => got(url))

    return Promise.all(ps)
  }

  const err = await t.throwsAsync(exceed, got.HTTPError)

  t.is(err.statusCode, 429)
})
