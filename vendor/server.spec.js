import test from 'ava'

import createError from 'http-errors'

import R from 'ramda'

import { sendTo } from '../vendor/client'
import { runServer } from '../vendor/server'

/*
 * Settings
 */

const LIMIT = 20
const INTERVAL = 100

/*
 * Helpers
 */

const sendMultiTo = (baseUrl, limit) => {
  const numbers = R.range(1, limit)
  // make parallel requests
  return Promise.all(numbers.map(sendTo(baseUrl)))
}

/*
 * Hooks
 */

// setup
test.beforeEach(async t => {
  const rate = {
    limit: LIMIT,
    interval: INTERVAL
  }

  t.context = await runServer(rate)
})

// tear down
test.afterEach(async t => {
  t.context.server.close()
})

/*
 * Tests
 */

test.serial('rate limiter', async t => {
  const { baseUrl } = t.context

  const run = limit => sendMultiTo(baseUrl, limit)

  await t.notThrowsAsync(run(LIMIT), 'limit')

  await t.throwsAsync(run(LIMIT + 1), createError[429], 'limit + 1')
})
