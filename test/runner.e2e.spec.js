import test from 'ava'

import R from 'ramda'

import delay from 'delay'
import random from 'random-normal'

import Debug from './helpers/debug'

import { createServer } from '../vendor/server'
import { sendTo, getServerHistoryFrom } from '../vendor/client'

import Runner from '../src/Runner'

// debug

const debug = Debug('sfc:runner:test')

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
  t.context = await createServer(RATE) // { baseUrl, server }
})

// tear down
test.afterEach(async t => {
  t.context.server.close()
})

/*
 * Tests
 */

test.serial('results', async t => {
  const { baseUrl } = t.context

  const numbers = numbersTo(25)

  const res = await Runner(RATE, sendTo(baseUrl), numbers)

  t.deepEqual(res.length, 25)
})

test.serial('stats', async t => {
  const { baseUrl } = t.context

  const numbers = numbersTo(50)
  const res = await Runner(RATE, sendTo(baseUrl), numbers)

  // acquire stats
  const history = await getServerHistoryFrom(baseUrl)

  t.is(history.length, 50, 'no missing hits')

  // segment by seconds
  const byTime = row => Math.floor(row.time / 1000)
  // stat spec to list of keys
  const keys = R.pluck('key')

  const aggregate = R.compose(
    R.map(keys),
    R.groupBy(byTime)
  )

  debug('Aggregated results: %O', aggregate(res))
  debug('Aggregated server stats: %O', aggregate(history))
})

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

    return Runner(rate, send, numbersTo(50))
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
