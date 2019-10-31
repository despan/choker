import test from 'ava'

import R from 'ramda'

import got from 'got'

import Debug from './helpers/debug'
import { createServer } from './helpers/server'

import runner from '../src/runner'

//

const { HTTPError } = got

/*
 * Settings
 */

const LIMIT = 10
const TOTAL = 50

/*
 * Helpers
 */

const debug = Debug('sfc:runner:test')

const runWith = (baseUrl, limit, numbers) => {
  return runner({ url: baseUrl, limit }, numbers)
}

/*
 * Hooks
 */

// setup
test.beforeEach(async t => {
  // run a test server on available port
  t.context = await createServer({ limit: LIMIT }) // > { url, server }
})

// tear down
test.afterEach(async t => {
  t.context.server.close()
})

/*
 * Tests
 */

test.serial('results', async t => {
  const baseUrl = t.context.url
  const limit = LIMIT
  const numbers = R.range(1, TOTAL)

  debug('Run for %O', { TOTAL, LIMIT })
  const res = await runner({ url: baseUrl, limit }, numbers)

  t.deepEqual(res, numbers)

  debug('Results: %O', res)
})

test.serial('stats', async t => {
  const baseUrl = t.context.url
  const numbers = R.range(1, TOTAL)

  await runWith(baseUrl, LIMIT, numbers)

  const stats = await got(baseUrl)
    .then(res => JSON.parse(res.body))

  t.is(stats.length, TOTAL - 1, 'no missing hits')

  // segment by seconds
  const byTime = row => Math.floor(row.time / 1000) % 100
  // stat spec to list of keys
  const keys = R.pluck('key')

  const aggregate = R.compose(
    R.map(keys),
    R.groupBy(byTime)
  )

  debug('Server stats: %O', aggregate(stats))
})

test.serial('perf', async t => {
  const baseUrl = t.context.url

  const numbers = R.range(1, TOTAL)
  const run = limit => runWith(baseUrl, limit, numbers)

  debug('Run %d with limit of %d', TOTAL, LIMIT)
  debug('  ideally should take %d s', TOTAL / LIMIT)
  const startOk = process.hrtime()

  await run(LIMIT)

  const endOk = process.hrtime(startOk)
  debug('  took %h', endOk)

  t.pass()
})

test.serial('limits', async t => {
  const baseUrl = t.context.url

  const run = (limit, total) => {
    const numbers = R.range(1, total)
    return runWith(baseUrl, limit, numbers)
  }

  await t.notThrowsAsync(() => run(LIMIT, TOTAL), 'eq limit')
  await t.throwsAsync(() => run(LIMIT * 4, TOTAL * 4), HTTPError, 'above limit')
})
