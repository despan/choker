import test from 'ava'

import fetch from 'node-fetch'
import createError from 'http-errors'

import R from 'ramda'

import { createServer } from '../vendor/server'

/*
 * Settings
 */

const LIMIT = 20
const INTERVAL = 100

/*
 * Helpers
 */

const parseFetch = res => {
  if (res.ok) return res

  const err = createError(res.status)
  return Promise.reject(err)
}

const sendHit = (baseUrl, key) => {
  const url = `${baseUrl}/hit/${key}`
  return fetch(url)
    .then(parseFetch)
    .then(() => key)
}

const sendMultiTo = (baseUrl, limit) => {
  const send = key => sendHit(baseUrl, key)
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

  const run = limit => async () => {
    const ps = R.range(1, limit + 1)
      .map(key => sendHit(baseUrl, key))

    return Promise.all(ps)
  }

  await t.notThrowsAsync(run(LIMIT), 'limit')

  await t.throwsAsync(run(LIMIT + 1), createError[429], 'limit + 1')
})
