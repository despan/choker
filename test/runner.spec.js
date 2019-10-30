import test from 'ava'

import R from 'ramda'

import { HTTPError } from 'got'

import Debug from './helpers/debug'
import { createServer } from './helpers/server'

import runner from '../src/runner'

/*
 * Settings
 */

const LIMIT = 10
const TOTAL = 50

/*
 * Helpers
 */

const debug = Debug('sfc:runner:test')

const x3 = x => x * 3

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

test.serial('limits', async t => {
  const { url } = t.context

  const numbers = R.range(1, TOTAL)

  const run = limit => runner({ url, limit }, numbers)

  // ok case
  debug('Run %d with limit of %d', TOTAL, LIMIT)
  debug('  ideally should take %d s', TOTAL / LIMIT)
  const startOk = process.hrtime()

  await t.notThrowsAsync(() => run(LIMIT), 'below limit')

  const endOk = process.hrtime(startOk)
  debug('  took %h', endOk)

  // err case

  await t.throwsAsync(() => run(x3(LIMIT)), HTTPError, 'above limit')
})
