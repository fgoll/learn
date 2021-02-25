// ll(1)递归下降的词法解析器

const EOF = '-1'
const EOF_TYPE = 1;
const NAME = 2;
const COMMA = 3;
const LBRACK = 4;
const RBRACK = 5;
const EQUALS = 6;
const tokenNames = ["n/a", "<EOF>", "NAME", "COMMA", "LBRACK", "RBRACK", "EQUALS"]

class Token {

  constructor(type, text) {
    this.type = type
    this.text = text
  }

  toString() {
    let tname = tokenNames[this.type]
    return `<'${this.text}', ${tname}>`
  }
}

class Lexer {

  constructor(input) {
    this.input = input
    this.p = 0

    this.c = input.charAt(this.p)
  }

  // 向前移动一个字符, 检测输入是否结束
  consume() {
    this.p++
    if (this.p >= this.input.length) this.c = EOF
    else this.c = this.input.charAt(this.p)
  }

  match(x) {
    if (this.c === x) this.consume()
    else throw new Error("expecting " + x + "; found " + this.c)
  }
}

const code = (c) => c.charCodeAt(0)

class ListLexer extends Lexer {
  constructor(input) {
    super(input)
  }

  isLetter() { return code(this.c) >= code('a') && code(this.c) <= code('z') || code(this.c) >= code('A') && code(this.c) <= code('Z') }

  nextToken() {
    while (this.c !== EOF) {
      switch(this.c) {
        case ' ': 
        case '\t':
        case '\n':
        case '\r': this.ws(); continue

        case ',':
          this.consume();
          return new Token(COMMA, ",")

        case '[':
          this.consume();
          return new Token(LBRACK, '[');
        
        case ']':
          this.consume();
          return new Token(RBRACK, ']')

        case '=':
          this.consume();
          return new Token(EQUALS, '=')
        
        default: 
          if (this.isLetter()) return this.name()
          throw new Error("invalid character: " + this.c)
      }
    }

    return new Token(EOF_TYPE, '<EOF>')
  }

  name() {
    let s = ''
    do {
      s += this.c
      this.consume()
    } while (this.isLetter())

    return new Token(NAME, s)
  }

  ws() {
    while (this.c === ' '|| this.c === '\t' || this.c === '\n' || this.c === '\r' ) this.consume()
  }
}

// let lexer = new ListLexer('[a, b]')
// let t = lexer.nextToken()
// while (t.type !== EOF_TYPE) {
//   console.log(t.toString())
//   t = lexer.nextToken()
// }

// console.log(t.toString())

module.exports = {
  EOF,
  EOF_TYPE,
  NAME,
  COMMA,
  LBRACK,
  RBRACK,
  EQUALS,
  tokenNames: ["n/a", "<EOF>", "NAME", "COMMA", "LBRACK", "RBRACK"],
  Lexer, 
  ListLexer,
  Token
}