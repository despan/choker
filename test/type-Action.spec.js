import test from 'ava'

import { Action, Request } from '../src/types'

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

test('Send', t => {
  const { Send } = Action

  // instance of
  t.true(Action.is(Send))
  t.true(Send.is(Send))
})

test('actionForBy', t => {
  t.is(typeof Action.actionForBy, 'function')

  const list = [
    Request.Pending(1),
    Request.Ended(2, 2, 'ok'),
    Request.Ended(3, 3, 'ok'),
    Request.Ended(4, 4, 'ok'),
    Request.Pending(5)
  ]

  const get = (now, limit, interval) =>
    Action.actionForBy(now, { limit, interval }, list)

  t.is(get(6, 6, 3), Action.Send, 'available')

  t.is(get(6, 3, 3), Action.Send, 'some ended long ago')
  t.is(get(6, 3, 4), Action.Send, 'some ended enough ago')

  t.deepEqual(get(6, 3, 5), Action.Backoff(1))
})
