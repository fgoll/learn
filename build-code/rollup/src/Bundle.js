import path from 'path'
import { has } from './utils/object'
import { defaultResolver } from './utils/resolvePath'
import { readFile, Promise } from 'sander'
import Module from './Module'
import ExternalModule from './ExternalModule'

export default class Bundle {
  constructor( options ) {
    this.entryPath = path.resolve(options.entry).replace(/\.js$/, '') + '.js'
    this.base = path.dirname(this.entryPath)

    this.resolvePath = options.resolvePath || defaultResolver

    this.entryModule = null
    this.modulePromises = {}
    this.statements = []
    this.externalModules = []
    this.defaultExportName = null
    this.internalNamespaceModules = []

  } 

  fetchModule( importee, importer ) {
    // console.log(importee, importer)
    return Promise.resolve( importer === null ? importee : this.resolvePath(importee, importer))
      .then(path => {
        console.log(path)
        if (!path) {
          // external module
          if (!has(this.modulePromises, importee)) {
            const module = new ExternalModule(importee)
            this.externalModules.push(module)
            this.modulePromises[ importee ] = Promise.resolve(module)
          }
          return this.modulePromises[ importee ]
        }
        if (!has(this.modulePromises, path)) {
          this.modulePromises[ path ] = readFile(path, { encoding: "utf-8" }).then( code => {
            console.log('code', code)
            const module = new Module({
              path,
              code,
              bundle: this
            })
            // console.log(module)

            return module
          })
        }
        return this.modulePromises[ path ]
      })
  }

  build() {
    return this.fetchModule( this.entryPath, null )
      .then( entryModule => {
        // console.log(entryModule)
        this.entryModule = entryModule
      })
  }
}