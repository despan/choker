import test from 'ava'

import { Request } from '../src/types'

// tests

test('Pending', t => {
  const { Pending } = Request

  // instance of
  t.true(Request.is(Pending))
  t.true(Pending.is(Pending))
})

test('Ended', t => {
  const { Ended } = Request

  const req = Ended(100, 'ok')

  // instance of
  t.true(Request.is(req))
  t.true(Ended.is(req))

  // internals
  t.is(req.time, 100)
  t.is(req.result, 'ok')

  // args
  t.throws(() => Ended(2), 'Expected 2 arguments, got 1')
  t.throws(() => Ended(2, 3, 4), 'Expected 2 arguments, got 3')
})

test('timeOf', t => {
  const { timeOf } = Request

  t.is(timeOf(Request.Ended(1, 'ok')), 1)

  t.throws(() => timeOf(Request.Pending), TypeError)
})

test('isActiveSince', t => {
  const { isActiveSince } = Request

  t.true(isActiveSince(4, Request.Pending))

  const endedAt4 = Request.Ended(4, 'ok')
  t.true(isActiveSince(3, endedAt4))
  t.true(isActiveSince(4, endedAt4), 'include exact match')
  t.false(isActiveSince(5, endedAt4))
})
