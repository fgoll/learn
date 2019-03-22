class Vector<T> {
  _elem: any
  constructor(elem?) {
    elem = elem || []
    this._elem = elem.slice()
  }

  length() {
    return this._elem.length
  }

  uniquify() {
    let i = 0, j = 0
    while (++j < this._elem.length) {
      if (this._elem[i] != this._elem[j]) {
        this._elem[++i] = this._elem[j]
      }
    }
    i++

    this._elem.length = i
    return j - i
  }

  set(r, e) {
    this._elem[r] = e
  }
  get(r)  {
    return this._elem[r]
  }

  find(e, lo, hi) {
    while ((lo < hi--) && (e < this._elem[hi]));
    return hi
  }

  search(e) {
    return this.find(e, 0, this._elem.length)
  }

  insert(r, e) {
    for (let i = this.length(); i > r; i --) {
      this._elem[i] = this._elem[i - 1]
    }
    this._elem[r] = e
    
    return r
  }

  removeIn(lo, hi) {
    if (lo == hi) return 0
    while (hi < this.length()) this._elem[lo++] = this._elem[hi++]
    this._elem.length = lo

    return hi - lo
  }

  remove(r) {
    let e = this._elem[r]
    this.removeIn(r, r + 1)
    return e
  }

  deduplicate() {
    let elem = this._elem.slice()
    this.mergeSort(0, this.length())
    let count = this.uniquify()
    // let arr = []
    // let v = new Vector(elem)
    // for (let i = 0; i < elem.length; i ++) {

    //   let val = elem[i]
    //   let fidx = this.binSearch(val, 0, this.length())

    //   if (fidx != -1) {
    //     this.remove(fidx, fidx+1)
    //     arr.push(val)
    //   }
    // }
    // this._elem = arr
    return count
  }

  deduplicate2() {
    let i = 1

    while (i < this.length()) {
      this.find(this._elem[i], 0, i) == -1 ? i++ : this.removeIn(i, i + 1)
    }
  }



  binSearch(e, lo, hi) {
    while (lo < hi) {
      var mi = Math.floor((hi + lo) / 2)
      if (e < this._elem[mi]) {
        hi = mi
      } else if (e > this._elem[mi]) {
        lo = mi + 1
      } else {
        return mi
      }
    }
    return -1
  }

  bubbleSort(lo, hi) {
    while (!this.bubble(lo, hi));
  }

  bubble(lo, hi) {
    var sorted = true
    while (++lo < hi) {
      if (this._elem[lo - 1] > this._elem[lo]) {
        sorted = false
        var temp = this._elem[lo - 1]
        this._elem[lo - 1] = this._elem[lo]
        this._elem[lo] = temp
      }
    }

    return sorted
  }

  mergeSort(lo, hi) {
    if (hi - lo < 2) return
    var mi = Math.floor((lo + hi) / 2)
    this.mergeSort(lo, mi)
    this.mergeSort(mi, hi)
    // console.log('先merge:', lo, mi, hi)
    this.merge(lo, mi, hi)
  }

  merge(lo, mi, hi) {
    var lb = mi - lo;
    var A = this._elem
    var B = this._elem.slice(lo, mi)
    var lc = hi - mi;
    // console.log(lo, mi, hi)
    // console.log(A)
    // console.log(B)
    // console.log(A[mi])
    for (var i = 0, j = 0, k = 0; (j < lb) || (k < lc);) {
      if ((j < lb) && (!(k < lc) || B[j] <= A[mi + k])) { A[lo + i] = B[j++]; i++ }
      if ((k < lc) && (!(j < lb) || A[mi + k] < B[j])) { A[lo + i] = A[mi + k]; i++; k++ }
    }
  }

  heapSort() {
    let size = this.length()
    let H = new PQ_ComplHeap(this._elem, size)
    
    while (!H.empty()) {
      console.log(H)
      this._elem[--size] = H.delMax()
    }
  }

}

function inHeap(n, i) {
  return i >= 0 && i < n
}

function parentVaild(i) {
  return i > 0
}

function parent(i) {
  return (i - 1) >> 1
}

function lastInternal(n) {
  return parent(n - 1)
}

function bigger(PQ, i, j) {
  return PQ[i] > PQ[j] ? i : j
}

function lChild(i) {
  return 1 + (i << 1)
}

function rChild(i) {
  return (i + 1) << 1
}

function rChildValid(n, i) {
  return inHeap(n, rChild(i))
}

function lChildValid(n, i) {
  return inHeap(n, lChild(i))
}

function properParent(PQ, n, i) {
  return rChildValid(n, i) ? bigger(PQ, bigger(PQ, i, lChild(i)), rChild(i)) :
         lChildValid(n, i) ? bigger(PQ, i, lChild(i)) : i 
}

interface PQ<T> {
  insertH(e: T): void
  getMax(): T
  delMax(): T
}

class PQ_ComplHeap<T> extends Vector<T> implements PQ<T> {
  protected percolateDown(n: number, i: number) {
    let j
    
    while (i != (j = properParent(this._elem, n, i))) {

      [this._elem[i], this._elem[j]] = [this._elem[j], this._elem[i]]
      i = j
    }

    return i
  }
  protected percolateUp(i: number) {
    while (parentVaild(i)) {
      console.log(i)
      let j = parent(i)
      
      if (this._elem[i] <= this._elem[j]) break
      [this._elem[i], this._elem[j]] = [this._elem[j], this._elem[i]]
      i = j
    }
  }
  protected heapify(n: number) {
    for (let i = lastInternal(n); inHeap(n, i); i --) {
      this.percolateDown(n, i)
    }
  }

  constructor(A?: T, n?: number) {
    super(A)
    if (n) {
      this.heapify(n)
    }
  }

  public empty() {
    return this._elem.length === 0
  }

  public insertH(e: T) {
    this.insert(this.length(), e)
    this.percolateUp(this.length() - 1)
  }

  public getMax() {
    return this._elem[0]
  }

  public delMax() {
    let maxElem = this._elem[0]
    if (this._elem.length > 1) {
      this._elem[0] = this._elem.pop()
      this.percolateDown(this.length(), 0) 
    }else {
      this._elem.pop()
    }
    return maxElem
  }
}

let pq = new PQ_ComplHeap()
pq.insertH(10)
pq.insertH(12)
pq.insertH(24)
pq.insertH(5)
pq.insertH(54)

let pq2 = new PQ_ComplHeap([10,12,24,5,54], 5)

// console.log(pq.delMax())
// console.log(pq.delMax())
console.log(pq)
console.log(pq2)
let v = new Vector([10,12,24,5,54])
v.heapSort()
console.log(v)