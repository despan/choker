import test from 'ava'

import got from 'got'

import R from 'ramda'

import { createServer } from './helpers/server'

/*
 * Settings
 */

const LIMIT = 20

/*
 * Helpers
 */

const moreThan = x => x * 3

/*
 * Hooks
 */

// setup
test.beforeEach(async t => {
  // supply for later usage
  t.context = await createServer({ limit: LIMIT })
})

// tear down
test.afterEach(async t => {
  t.context.server.close()
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

  const send = x => got(`${url}/${x}`)

  const run = n => {
    // deliberately run more
    const numbers = R.range(1, n)
    // make parallel requests
    return Promise.all(numbers.map(send))
  }

  await t.notThrowsAsync(run(LIMIT), 'below limit')

  await t.throwsAsync(run(moreThan(LIMIT)), got.HTTPError, 'above limit')
    .then(err => t.is(err.statusCode, 429, 'rate error'))
})
