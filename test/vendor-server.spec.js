import test from 'ava'

import fetch from 'node-fetch'
import createError from 'http-errors'

import R from 'ramda'

import { sendTo } from '../vendor/client'
import { createServer } from '../vendor/server'

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
  // supply for later usage
  t.context = await createServer({
    limit: LIMIT,
    interval: INTERVAL
  })
})

// tear down
test.afterEach(async t => {
  t.context.server.close()
})

/*
 * Tests
 */

test.serial('stats on requests', async t => {
  const { baseUrl } = t.context

  const limit = 9

  const urlHistory = `${baseUrl}/history`

  await fetch(urlHistory)
    .then(res => res.json())
    .then(body => {
      t.deepEqual(body, [], 'ok initial stats')
    })

  // activity
  await sendMultiTo(baseUrl, limit)

  await fetch(urlHistory)
    .then(res => res.json())
    .then(R.pluck('key'))
    .then(stats => {
      const expected = R.range(1, limit).map(String)
      t.deepEqual(stats.sort(), expected, 'ok final stats')
    })
})

test.serial('rate limiter', async t => {
  const { baseUrl } = t.context

  const run = limit => sendMultiTo(baseUrl, limit)

  await t.notThrowsAsync(run(LIMIT), 'limit')

  await t.throwsAsync(run(LIMIT + 1), createError[429], 'limit + 1')
})
