const exp = '(())()()((())'

function paren(exp, lo, hi) {
  let S = []
  for (let i = lo; i < hi; i ++) {
    if (exp[i] === '(') S.push(exp[i])
    else if (S.length !== 0) S.pop()
    else { return false}
  }
  return S.length === 0
}

console.log(paren(exp, 0, exp.length))