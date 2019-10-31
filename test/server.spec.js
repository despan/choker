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

const x3 = x => x * 3

const sendMultiTo = (url, limit) => {
  const send = x => got(`${url}/${x}`)
  const numbers = R.range(1, limit)
  // make parallel requests
  return Promise.all(numbers.map(send))
}

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

test.serial('stats on requests', async t => {
  const { url } = t.context

  const limit = 9

  await got(url)
    .then(res => {
      t.is(res.body, '[]', 'ok initial stats')
    })

  // activity
  await sendMultiTo(url, limit)

  await got(url)
    .then(res => JSON.parse(res.body))
    .then(R.pluck('key'))
    .then(stats => {
      const expected = R.range(1, limit).map(String)
      t.deepEqual(stats.sort(), expected, 'ok final stats')
    })
})

test.serial('rate limiter', async t => {
  const run = limit => () =>
    sendMultiTo(t.context.url, limit)

  await t.notThrowsAsync(run(LIMIT), 'limit')

  // await t.throwsAsync(run(x2(LIMIT)), got.HTTPError, 'limit x2')

  await t.throwsAsync(run(x3(LIMIT)), got.HTTPError, 'limit x3')
    .then(err => t.is(err.statusCode, 429, 'rate error'))
})
