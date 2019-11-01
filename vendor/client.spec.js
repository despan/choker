import test from 'ava'

import Client from './client'

test('commands', t => {
  t.is(typeof Client.sendTo, 'function')
  t.is(typeof Client.getServerHistoryFrom, 'function')
})
