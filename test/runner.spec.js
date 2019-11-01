import test from 'ava'

import R from 'ramda'

import fetch from 'node-fetch'

import Debug from './helpers/debug'
import { createServer } from './helpers/server'

import runner from '../src/runner'

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

const getHistoryFrom = baseUrl => {
  const url = `${baseUrl}/history`
  const recover = res => res.json()

  return fetch(url).then(recover)
}

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

  const res = await runner(baseUrl, RATE, numbers)

  t.deepEqual(R.pluck('key', res), numbers)
})

test.serial('stats', async t => {
  const { baseUrl } = t.context

  const numbers = numbersTo(50)
  const res = await runner(baseUrl, RATE, numbers)

  // acquire stats
  const history = await getHistoryFrom(baseUrl)

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

test.serial('perf', async t => {
  const { baseUrl } = t.context

  const total = 50

  debug('Run for rate %O total %d', RATE, total)
  debug('  ideally should take %d s', total / RATE.limit * RATE.interval)
  const startOk = process.hrtime()

  await runner(baseUrl, RATE, numbersTo(total))

  const endOk = process.hrtime(startOk)
  debug('  took %h', endOk)

  t.pass()
})

test.serial('limits', async t => {
  const { baseUrl } = t.context

  const run = (limit, total) => {
    const rate = {
      limit,
      interval: RATE.interval
    }
    return runner(baseUrl, rate, numbersTo(50))
  }

  const { limit } = RATE

  await t.notThrowsAsync(
    () => run(limit, limit),
    'eq limit eq total'
  )

  await t.notThrowsAsync(
    () => run(limit, limit * 4),
    'eq limit'
  )

  await t.throwsAsync(
    () => run(limit + 1, limit * 4),
    Error,
    'limit + 1'
  )

  await t.throwsAsync(
    () => run(limit * 2, limit * 4),
    Error,
    'limit x 2'
  )
})
