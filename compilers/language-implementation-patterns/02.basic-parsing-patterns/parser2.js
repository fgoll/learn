// ll(k)递归下降的语法解析器


const lexerM = require('./lexer')


class Parser {

  constructor(input, k) {
    this.input = input
    this.k = k
    this.lookahead = []
    this.p = 0
    for (let i = 1; i <= k ; i ++) {
      this.consume()
    }
  }

  match(x) {
    if (this.la(1) === x) this.consume()
    else throw new Error("expecting " + lexerM.tokenNames[x] + "; found" + this.lt(1).toString())
  }

  consume() {
    this.lookahead[this.p] = this.input.nextToken()
    this.p = (this.p + 1) % this.k 
  }

  lt(i) {
    return this.lookahead[(this.p + i - 1) % this.k]
  }

  la(i) {
    return this.lt(i).type
  }
}

class ListParser extends Parser {
  constructor(input, k) {
    super(input, k)
  }

  list() {
    this.match(lexerM.LBRACK);
    this.elements()
    this.match(lexerM.RBRACK)
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
}

let lexer = new lexerM.ListLexer('[a, b=c, [d, e] ]')

let parser = new ListParser(lexer, 2)
parser.list()

lexer = new lexerM.ListLexer('[a, b=c,, [d, e] ]')

parser = new ListParser(lexer, 2)
parser.list()