import test from 'ava'

import R from 'ramda'

import delay from 'delay'
import random from 'random-normal'

import { runServer } from './server'
import { sendTo } from './client'

import choker from '..'

/*
 * Settings
 */

const RATE = {
  limit: 20,
  interval: 250
}

/*
 * Helpers
 */

const numbersTo = max => R.range(1, max + 1)

/*
 * Hooks
 */

// setup
test.beforeEach(async t => {
  // run a test server on available port
  t.context = await runServer(RATE) // { baseUrl, server }
})

// tear down
test.afterEach(async t => {
  t.context.server.close()
})

/*
 * Tests
 */

test.serial('limits', async t => {
  const { baseUrl } = t.context

  const run = (limit, total, latency = 200) => {
    const send = async key => {
      // emulate latency
      const params = {
        mean: latency,
        dev: latency / 10
      }
      await delay(random({ params }))

      return sendTo(baseUrl, key)
    }

    const rate = {
      limit,
      interval: RATE.interval
    }

    return choker(rate, send, numbersTo(50))
  }

  const { limit, interval } = RATE

  await t.notThrowsAsync(
    () => run(limit, limit),
    'eq limit eq total'
  )

  await delay(interval)

  await t.notThrowsAsync(
    () => run(limit, limit * 4),
    'eq limit'
  )

  await delay(interval)

  await t.throwsAsync(
    () => run(limit + 1, limit * 4),
    Error,
    'limit + 1'
  )

  await delay(interval)

  await t.throwsAsync(
    () => run(limit * 2, limit * 4),
    Error,
    'limit x 2'
  )
})
