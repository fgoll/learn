function kmp(t, p) {
  let next = buildNext2(p)
  console.log(next)
  let i = j = 0
  while (i < t.length && j < p.length) {
    if (j < 0 || t[i] === p[j]) {
      i ++
      j ++
    }else {
      j = next[j]
    }
  }
  return i - j
}

function buildNext(p) {
  let next = []
  
  let t = next[0] = -1
  let j = 0
  while (j < p.length - 1) {
    if (t < 0 || p[j] === p[t]) {
      j ++
      t ++
      next[j] = t
    }else {
      t = next[t]
    }
  }
  return next
}

function buildNext2(p) {
  let next = []
  
  let t = next[0] = -1
  let j = 0
  while (j < p.length - 1) {
    if (t < 0 || p[j] === p[t]) {
      j ++
      t ++
      next[j] = p[j] !== p[t] ? t : next[t]
    }else {
      t = next[t]
    }
  }
  return next
}


console.log(kmp('app', 'ad'))