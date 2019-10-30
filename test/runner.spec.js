import test from 'ava'

import getPort from 'get-port'

import R from 'ramda'

import { HTTPError } from 'got'

import createServer from '../src/server'

import runner from '../src/runner'

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

test.serial('limits', async t => {
  const { url } = t.context

  const rangeTo = R.range(1)
  const run = limit => runner({ url, limit }, rangeTo(40))

  await t.notThrowsAsync(() => run(LIMIT), 'below limit')
  await t.throwsAsync(() => run(LIMIT + 10), HTTPError, 'above limit')
})
