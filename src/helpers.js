const R = require('ramda')

function pending (key) {
  return {
    key,
    status: 'pending'
  }
}

function resolved (key, time) {
  return {
    key,
    time,
    status: 'resolved'
  }
}

function rejected (key, time) {
  return {
    key,
    time,
    status: 'rejected'
  }
}

function isActiveSince (time, item) {
  switch (item.status) {
    case 'pending':
      return true
    default:
      return item.time >= time
  }
}

function earliestDoneAt (list) {
  const times = list
    .filter(item => item.status !== 'pending')
    .map(item => item.time)

  return Math.min(...times)
}

module.exports = {
  pending,
  resolved,
  rejected
}

module.exports.isActiveSince = R.curry(isActiveSince)
module.exports.earliestDoneAt = R.curry(earliestDoneAt)
