<img src="logo.png" align="right" height="100px"/>
<img align="right" width="0" height="100px" hspace="10"/>

# choker :construction:

[![Build Status](https://travis-ci.org/despan/suffocative.svg?branch=master)](https://travis-ci.org/despan/suffocative)
[![Coverage Status](https://coveralls.io/repos/github/despan/suffocative/badge.svg?branch=master)](https://coveralls.io/github/despan/suffocative?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

> throttle on limited rate

### Installation

```sh
npm install choker
```

### Usage

```js
const Runner = require('suffocative')

const rate = {
  limit: 20,
  interval: 1000 // ms
}

async function sendSMS (data) {
  // ...
}

const smsList = [
  { to: 777888, msg: 'hi' }
  // ...
]

await Runner(rate, sendSMS, smsList)

// [
//   [ data, { time, result } ],
//   ...
// ]
```

### Development

```sh
# clone repo
git clone https://github.com/despan/choker

#
cd suffocative

# install dependencies
npm install
```

### Test

```sh
# run quick tests
npm run test

# test watching file changes
npm run test:watch
```

### Contributing

Check [Contributing Guide](/CONTRIBUTING.md).
