import test from 'ava'

import { Request } from '../src/types'

// tests

test('Pending', t => {
  const { Pending } = Request

  const req = Pending(1)

  // instance of
  t.true(Request.is(req))
  t.true(Pending.is(req))

  // internals
  t.is(req.key, 1)

  // args
  t.throws(() => Pending(), 'Expected 1 arguments, got 0')
  t.throws(() => Pending(1, 2), 'Expected 1 arguments, got 2')
})

test('Ended', t => {
  const { Ended } = Request

  const req = Ended('a', 100, 'ok')

  // instance of
  t.true(Request.is(req))
  t.true(Ended.is(req))

  // internals
  t.is(req.key, 'a')
  t.is(req.time, 100)
  t.is(req.result, 'ok')

  // args
  t.throws(() => Ended('a', 2), 'Expected 3 arguments, got 2')
  t.throws(() => Ended('a', 2, 3, 4), 'Expected 3 arguments, got 4')
})

test('keyOf', t => {
  const { keyOf } = Request

  t.is(keyOf(Request.Pending('a')), 'a')
  t.is(keyOf(Request.Ended('b', 1, 'ok')), 'b')
})

test('timeOf', t => {
  const { timeOf } = Request

  t.is(timeOf(Request.Ended('a', 1, 'ok')), 1)

  t.throws(() => timeOf(Request.Pending('a')), TypeError)
})

test('isActiveSince', t => {
  const { isActiveSince } = Request

  const pending = Request.Pending('a')
  t.true(isActiveSince(4, pending))

  const endedAt4 = Request.Ended('a', 4, 'ok')
  t.true(isActiveSince(3, endedAt4))
  t.true(isActiveSince(4, endedAt4), 'include exact match')
  t.false(isActiveSince(5, endedAt4))
})
