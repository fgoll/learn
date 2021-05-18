import { writeFile } from 'sander'
import Bundle from './Bundle'

function rollup(entry, options = {}) {
  const bundle = new Bundle({
    entry,
    resolvePath: options.resolvePath
  })

  return bundle.build().then(() => {
    return {
      generate: options => bundle.generate(options),
      write: (dest, options = {}) => {
        let { code, map } = bundle.generate({
          dest,
          format: options.format,
          globalName: options.globalName
        })

        return Promise.all([
          writeFile(dest, code),
          writeFile(dest + '.map', map.toString())
        ])
      }
    }
  })
}

module.exports = rollup