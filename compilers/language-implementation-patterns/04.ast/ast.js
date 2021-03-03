
// 同形ast
class AST {
  constructor(token) {
    this.token = token
  }

  addChild(t) {
    if (!this.children) this.children = []
    children.push(t)
  }

  getNodeType()  {
    return this.token.type
  }

  isNil() {
    return !!this.token
  }

  toString() {
    return this.token ? this.token.toString() : "nil"
  }

  toStringTree() {
    if (!this.children || !this.children.length) return this.toString()

    let buf = ''
    if (!this.isNil()) {
      buf += "("
      buf += this.toString()
      buf += ' '
    }

    for (let i = 0; i < this.children.length; i ++) {
      let t = children[i]
      if (i > 0) buf += ' '
      buf += t.toStringTree()
    }
    if (!this.isNil()) buf += ')'
    return buf
  }
}
