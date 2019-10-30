import Debug from 'debug'

import prettyHrtime from 'pretty-hrtime'

Debug.formatters.h = v => prettyHrtime(v)

export default Debug
