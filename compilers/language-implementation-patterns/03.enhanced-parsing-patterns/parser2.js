// 记忆解析器


const lexerM = require('../02.basic-parsing-patterns/lexer')

let FAILED = -1 // 表示上一次解析失败


class Parser {

  constructor(input, k) {
    this.input = input
    this.k = k
    this.lookahead = []
    this.markers = []
    this.listMemo = {}
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
      this.listMemo = {}
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

  /**
    在当前输入位置上解析过这个规则吗
    如果查不到相关的记录, 那么没解析过
    返回值failed 那么上次解析失败
    返回值大于等于0, 这是词法单元缓冲区的下标, 表示上次解析成功
    副作用:
    如果不用重新解析, 则它会自动将缓冲区的下标向前移, 避免重新解析
   */
  alreadyParsedRule(memoization) {
    let memoI = memoization[this.index()]
    if (memoI === undefined) return false

    console.log("parsed list before at index " + this.index() + "; skip ahead to token index " + memoI + ": " + this.lookahead[+memoI].text)

    this.seek(+memoI)

    return true
  }

  memoize(memoization, startTokenIndex, failed) {
    let stopTokenIndex = failed ? FAILED : this.index() 
    memoization[startTokenIndex] = stopTokenIndex
  }


  index() {
    return this.p
  }
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
      console.log('attempt alertnative 2')
      this.assign()
      this.match(lexerM.EOF_TYPE)
    } else throw new Error("expecting stat found " + this.lt(1).toString())
  }

  _list() {
    console.log('parse list rule at token index: ' + this.index(), this.lt(1).toString())
    this.match(lexerM.LBRACK);
    this.elements()
    this.match(lexerM.RBRACK)
  }

  list() {
    let failed = false

    let startTokenIndex = this.index()

    if (this.isSpeculating() && this.alreadyParsedRule(this.listMemo)) return

    try {
      this._list()
    } catch(e) {
      failed = true
      throw e
    } finally {
      if (this.isSpeculating()) {
        this.memoize(this.listMemo, startTokenIndex, failed)
      }
    }
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
    console.log('attempt alertnative 1')

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
    console.log('attempt alertnative 2')

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

let lexer = new lexerM.ListLexer('[d,e]=[a,c]')

let parser = new ListParser(lexer)
parser.stat()
