
import path from 'path'

export function defaultResolver( importee, importer ) {

  if (path.isAbsolute(importee)) return importee

  if (importee[0] !== '.') return false

  return path.resolve(path.dirname(importer), importee).replace(/\.js$/, '') + '.js'
}