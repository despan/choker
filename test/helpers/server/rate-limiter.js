const { RateLimit } = require('koa2-ratelimit')

/*
 * Settings
 */

const INTERVAL = 1000

/**
 * Create rate limiter middleware
 *
 * @param {number} [limit=Infinity]
 *
 * @returns {Function} - middleware
 */

function main (limit) {
  const options = {
    interval: INTERVAL,
    max: limit
  }

  return RateLimit.middleware(options)
}

//

module.exports = main
