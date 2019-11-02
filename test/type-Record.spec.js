import test from 'ava'

import { Record } from '../src/types'

// tests

test('Pending', t => {
  const { Pending } = Record

  // instance of
  t.true(Record.is(Pending))
  t.true(Pending.is(Pending))
})

test('Complete', t => {
  const { Complete } = Record

  const rec = Complete(100, 'ok')

  // instance of
  t.true(Record.is(rec))
  t.true(Complete.is(rec))

  // internals
  t.is(rec.time, 100)
  t.is(rec.result, 'ok')

  // args
  t.throws(() => Complete(2), 'Expected 2 arguments, got 1')
  t.throws(() => Complete(2, 3, 4), 'Expected 2 arguments, got 3')
})

test('lte', t => {
  const { lte, Pending, Complete } = Record

  t.true(lte(Complete(1, 'ok'), Complete(2, 'ok')), 'Complete < Pending')
  t.true(lte(Complete(1, 'ok'), Pending), 'Complete < Pending')
  t.true(lte(Pending, Pending), 'Pending === Pending')
})

test('timeOf', t => {
  const { timeOf } = Record

  t.is(timeOf(Record.Complete(1, 'ok')), 1)

  t.throws(() => timeOf(Record.Pending), TypeError)
})

test('isActiveSince', t => {
  const { isActiveSince } = Record

  t.true(isActiveSince(4, Record.Pending))

  const endedAt4 = Record.Complete(4, 'ok')
  t.true(isActiveSince(3, endedAt4))
  t.true(isActiveSince(4, endedAt4), 'include exact match')
  t.false(isActiveSince(5, endedAt4))
})
