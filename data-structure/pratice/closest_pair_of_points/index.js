function Point(x, y) {
  this.x = x;
  this.y = y;
}

function compareX(p1, p2) {
  return p1.x - p2.x
}

function compareY(p1, p2) {
  return p1.y - p2.y
}

function dist(p1, p2) {
  drawPoint()
  
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
}

function bruteForce(P, lo, hi) {
  let min = 99999999
  for (let i = lo; i < hi; i ++) {
    for (let j = i + 1; j < hi; j++) {
      // console.log('强行比对',P[i], P[j])
      if (dist(P[i], P[j]) < min) {

        min = dist(P[i], P[j])
      }
    }
  }
  return min
}

function closestSort(Px, Py, lo, hi) {
  if (hi - lo < 3) {
    // console.log(Px[lo], Px[hi])
    let min = bruteForce(Px, lo, hi)
    // console.log(min)
    return min
  }

  let mi = Math.floor((hi + lo) * 0.5)
  

  const midPoint = Px[mi]
  // console.log("分隔线", midPoint)

  // addLine(midPoint.x)
  const dl = closestSort(Px, Py, lo, mi)
  const dr = closestSort(Px, Py, mi, hi)

  const d = Math.min(dl, dr)

  const strip = []
  let j = 0 
  for (let i = lo; i < hi; i ++) {
    if (Math.abs(Py[i].x - midPoint.x) < d) {
      strip[j++] = Py[i]
    }
  }

  return Math.min(d, stripClosest(strip, j, d))
}

function stripClosest(strip, size, d) {
  let min = d
  for (let i = 0; i < size; i ++) {
    for (let j = i + 1; j < size && (strip[i].y - strip[i].y) < min; ++j) {
      if (dist(strip[i], strip[j]) < min) {

          min = dist(strip[i], strip[j])  

        
      }
    }
  }
  return min
}


function mergeSort(elem, lo, hi, compare) {
  if (hi - lo < 2) {
    return
  }

  let mi = Math.floor((hi + lo) / 2)
  mergeSort(elem, lo, mi, compare)
  mergeSort(elem, mi, hi, compare)

  merge(elem, lo, mi, hi, compare)
}

function merge(elem, lo, mi, hi, compare) {
  let lb = mi - lo
  let lc = hi - mi
  let A = elem
  let B = elem.slice(lo, mi)

  for (let i = 0, j = 0, k = 0; (j < lb) || (k < lc);) {
    if ((j < lb) && (!(k < lc) || compare(B[j], A[mi + k]) <= 0)) { A[lo + i] = B[j++]; i ++; }
    if ((k < lc) && (!(j < lb) || compare(A[mi + k], B[j]) < 0)) { A[lo + i] = A[mi + k]; i ++; k ++ }
  }
}

