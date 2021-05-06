import { relative } from 'path'
import { parse } from 'acorn'

export default class Module {
  constructor({ path, code, bundle }) {
    this.bundle = bundle
    this.path = path
    this.relativePath = relative(bundle.base, path).slice(0, -3) // 删除 .js

    this.code = new MagicString(code, {
      filename: path
    })

    this.suggestedNames = {}
    this.comments = []

    try {
      this.ast = parse( code, {
        ecmaVersion: 6,
        sourceType: "module",
        onComment: (block, text, start, end) => this.comments.push({ block, text, start, end })
      })
    } catch(e) {
      e.file = path
      throw e
    }

    this.analyse()
  }

  analyse() {
    this.imports = {}
    this.exports = {}

    console.log(this.ast)

    this.ast.body.forEach( node => {
      let source
      // if (node.type === 'ImportDeclaration') {}
    })
  }
}