import test from 'ava'

import { isNil } from './helpers/util'

import Index from '..'

test('exists', t => {
  t.false(isNil(Index))
})
