import test from 'ava'

import delay from 'delay'

import runner from '../src/runner'

// debug

/*
 * Settings
 */

/*
 * Helpers
 */

/*
 * Hooks
 */

/*
 * Tests
 */

test.only('execution', async t => {
  const limit = 5
  const interval = 20
  const timeout = 5
  const length = 100

  //

  const t0 = Date.now()
  const timeline = []

  const fn = item => {
    timeline.push(Date.now() - t0)
    return delay(timeout)
      .then(() => 'ok')
  }

  const items = Array
    .from({ length })
    .map((_, key) => ({ id: String(key) }))

  const res = await runner(fn, { limit, interval }, items)

  t.is(timeline.length, length)
  t.is(res.length, length)
})
