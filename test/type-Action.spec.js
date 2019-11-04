import test from 'ava'

import { Action } from '../src/types'

// tests

test('Backoff', t => {
  const { Backoff } = Action

  const backoff = Backoff(10)

  // instance of
  t.true(Action.is(backoff))
  t.true(Backoff.is(backoff))

  // internals
  t.is(backoff.time, 10)

  // args
  t.throws(() => Backoff(), 'Expected 1 arguments, got 0')
  t.throws(() => Backoff(1, 2), 'Expected 1 arguments, got 2')
})

test('Run', t => {
  const { Run } = Action

  // instance of
  t.true(Action.is(Run))
  t.true(Run.is(Run))
})

test('fromTimeout', t => {
  const { fromTimeout } = Action

  t.true(Action.Run.is(fromTimeout(-1)))

  t.true(Action.Backoff.is(fromTimeout(0)))
  t.deepEqual(fromTimeout(0), Action.Backoff(0))

  t.true(Action.Backoff.is(fromTimeout(1)))
  t.deepEqual(fromTimeout(1), Action.Backoff(1))
})
