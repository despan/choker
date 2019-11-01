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

const LIMIT = 10
const TOTAL = 50

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
  t.context = await createServer({ limit: LIMIT }) // { baseUrl, server }
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

  const numbers = numbersTo(TOTAL)

  const res = await runner({ baseUrl, limit: LIMIT }, numbers)

  t.deepEqual(R.pluck('key', res), numbers)
})

test.serial('stats', async t => {
  const { baseUrl } = t.context

  const numbers = numbersTo(TOTAL)
  const res = await runner({ baseUrl, limit: LIMIT }, numbers)

  // acquire stats
  const history = await getHistoryFrom(baseUrl)

  t.is(history.length, TOTAL, 'no missing hits')

  // segment by seconds
  const byTime = row => Math.floor(row.time / 1000) % 100
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

  debug('Run for %O', { TOTAL, LIMIT })
  debug('  ideally should take %d s', TOTAL / LIMIT)
  const startOk = process.hrtime()

  await runner({ baseUrl, limit: LIMIT }, numbersTo(TOTAL))

  const endOk = process.hrtime(startOk)
  debug('  took %h', endOk)

  t.pass()
})

test.serial('limits', async t => {
  const { baseUrl } = t.context

  const run = (limit, total) => {
    return runner({ baseUrl, limit }, numbersTo(TOTAL))
  }

  await t.notThrowsAsync(() => run(LIMIT, LIMIT), 'eq limit eq total')
  await t.notThrowsAsync(() => run(LIMIT, TOTAL), 'eq limit')
  await t.throwsAsync(() => run(LIMIT * 4, TOTAL * 4))
})
