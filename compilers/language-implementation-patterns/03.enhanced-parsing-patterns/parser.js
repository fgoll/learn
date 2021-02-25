// ll(k)递归下降的语法解析器

const lexerM = require('../02.basic-parsing-patterns/lexer')


class Parser {

  constructor(input, k) {
    this.input = input
    this.k = k
    this.lookahead = []
    this.markers = []
    this.p = 0
  }

  match(x) {
    if (this.la(1) === x) this.consume()
    else throw new Error("expecting " + lexerM.tokenNames[x] + "; found" + this.lt(1).toString())
  }

  consume() {
    this.p ++

    if (this.p === this.lookahead.length && !this.isSpeculating()) {
      this.p = 0;
      this.lookahead = []
    }
    this.sync(1)
  }

  lt(i) {
    this.sync(i)
    return this.lookahead[(this.p + i - 1)]
  }

  la(i) {
    return this.lt(i).type
  }

  // 确保当前位置p之前有i个词法单元
  sync(i) {
    if (this.p + i - 1 > this.lookahead.length - 1) {
      let n = this.p + i - 1 - (this.lookahead.length - 1)
      this.fill(n)
    }
  }

  fill(n) {
    for (let i = 1; i <= n;  i ++) {
      this.lookahead.push(this.input.nextToken())
    }
  }

  mark() {
    this.markers.push(this.p)
    return this.p
  }

  release() {
    let marker = this.markers[this.markers.length - 1]
    this.markers.pop()
    this.seek(marker)
  }

  seek(index) { this.p = index }

  isSpeculating() { return this.markers.length > 0 }
}

class ListParser extends Parser {
  constructor(input, k) {
    super(input, k)
  }

  stat() {
    if (this.speculateStatAlt1()) {
      this.list()
      this.match(lexerM.EOF_TYPE)
    } else if (this.speculateStatAlt2()) {
      this.assign()
      this.match(lexerM.EOF_TYPE)
    } else throw new Error("expecting stat found " + this.lt(1).toString())
  }

  list() {
    this.match(lexerM.LBRACK);
    this.elements()
    this.match(lexerM.RBRACK)
  }

  assign() {
    this.list()
    this.match(lexerM.EQUALS)
    this.list()
  }

  elements() {
    this.element()
    while (this.la(1) === lexerM.COMMA) {
      this.match(lexerM.COMMA);
      this.element()
    }
  }

  element() {
    if (this.la(1) === lexerM.NAME && this.la(2) === lexerM.EQUALS) {
      this.match(lexerM.NAME)
      this.match(lexerM.EQUALS)
      this.match(lexerM.NAME)
    }
    else if (this.la(1) === lexerM.NAME) this.match(lexerM.NAME)
    else if (this.la(1)  === lexerM.LBRACK)  this.list()
    else throw new Error(`expecting name or list; found ${this.lt(1).toString()}`)
  }

  speculateStatAlt1() {
    let success = true
    this.mark()
    try {
      this.list() 
      this.match(lexerM.EOF_TYPE)
    } catch (e) {
      success = false
    }

    this.release()

    return success
  }

  speculateStatAlt2() {
    let success = true
    this.mark()
    try {
      this.assign()
      this.match(lexerM.EOF_TYPE)
    } catch(e) { success = false }
    this.release()

    return success
  }
}

let lexer = new lexerM.ListLexer('[d, e] = [a, c],')

let parser = new ListParser(lexer, 2)
parser.stat()
