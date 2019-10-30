import test from 'ava'

import R from 'ramda'

import { HTTPError } from 'got'

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

  await t.notThrowsAsync(() => run(LIMIT), 'below limit')
  await t.throwsAsync(() => run(x3(LIMIT)), HTTPError, 'above limit')
})
