// ll(1)递归下降的语法解析器

const lexerM = require('./lexer')


class Parser {

  constructor(input) {
    this.input = input
    this.lookahead = input.nextToken()
  }

  match(x) {
    if (this.lookahead.type === x) this.consume()
    else throw new Error("expecting " + lexerM.tokenNames[x] + "; found" + this.lookahead.toString())
  }

  consume() {
    this.lookahead = this.input.nextToken()
  }
}

class ListParser extends Parser {
  constructor(input) {
    super(input)
  }

  list() {
    this.match(lexerM.LBRACK);
    this.elements()
    this.match(lexerM.RBRACK)
  }

  elements() {
    this.element()
    while (this.lookahead.type === lexerM.COMMA) {
      this.match(lexerM.COMMA);
      this.element()
    }
  }

  element() {
    if (this.lookahead.type === lexerM.NAME) this.match(lexerM.NAME)
    else if (this.lookahead.type  === lexerM.LBRACK)  this.list()
    else throw new Error(`expecting name or list; found ${this.lookahead.toString()}`)
  }
}

let lexer = new lexerM.ListLexer('[a, ]')
let parser = new ListParser(lexer)
parser.list()