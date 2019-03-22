function ListNode(e, p, s) {
  this.data = e
  this.pred = p
  this.succ = s
}

ListNode.prototype.insertAsPred = function(e) {
  let node = new ListNode(e, this.pred, this)
  this.pred.succ = node
  this.pred = node
  return node
}

ListNode.prototype.insertAsSucc = function(e) {
  let node = new ListNode(e, this, this.succ)
  this.succ.pred = node
  this.succ = node
  return node
}


function List() {
  this._init()
}

List.prototype._init = function() {
  this.header = new ListNode()
  this.trailer = new ListNode()
  this.header.succ = this.trailer 
  this.trailer.pred = this.header
  this._size = 0
}

List.prototype.first = function() {
  return this.header.succ
}

List.prototype.last = function() {
  return this.trailer.pred
}

List.prototype.get = function(r) {
  let p = this.first()
  while (0 < r--) {
    p = p.succ
  }
  return p.data
}

List.prototype.find = function(e, n, p) {
  while (0 < n--) {
    if (e == (p = p.pred).data) return p
  }
  return null
}

List.prototype.insertAsFirst = function(e) {
  this._size ++
  return this.header.insertAsSucc(e)
}

List.prototype.insertAsLast = function(e) {
  this._size ++
  return this.trailer.insertAsPred(e)
}

List.prototype.insertA = function(p, e) {
  this._size ++
  return p.insertAsSucc(e)
}

List.prototype.insertB = function(p, e) {
  this._size ++
  return p.insertAsPred(e)
}

List.prototype.remove = function(p) {
  let e = p.data
  p.pred.succ = p.succ
  p.succ.pred = p.pred
  this._size --
  return e
}

List.prototype.traverse = function(visit) {
  for (let p = this.header.succ; p != this.trailer; p = p.succ) {
    visit(p.data)
  }
}

List.prototype.deduplicate = function() {
  if (this._size < 2) return 0
  let oldSize = this._size
  let p = this.header
  let r = 0
  while(this.trailer != (p = p.succ)) {
    let q = this.find(p.data, r, p) 
    q ? this.remove(q) : r++
  } 
  return oldSize - this._size
}

List.prototype.uniquify = function() {
  let oldSize = this._size
  let p = this.first()
  let q
  while (this.trailer != (q = p.succ)) {
    if (q.data == p.data) {
      this.remove(q)
    }else {
      p = q
    }
  }
  return oldSize - this._size
}

List.prototype.search = function(e, n, p) {
  while (0 <= n--) {
    if (e >= (p = p.pred).data) break
  }
  return p
}

List.prototype.insertionSort = function(p, n) {
  for (let r = 0; r < n; r++) {
    this.insertA(this.search(p.data, r, p), p.data)
    p = p.succ
    this.remove(p.pred)
  }
}

List.prototype.selectMax = function(p, n) {
  let max = p
  for(let cur = p; 1 < n; n --) {
    if ((cur = cur.succ).data > max.data) { max = cur }
  }
  return max
}

List.prototype.selectionSort = function(p, n) {
  let tail = p
  for(let i = 0; i < n; i++ ) {
    tail = tail.succ
  }
  let header = p.pred
  while (n > 1) {
    let max = this.selectMax(header.succ, n)
    this.insertB(tail, this.remove(max))
    tail = tail.pred
    n --
  }
}

List.prototype.mergeSort = function(p, n) {
  if (n < 2) return
  let m = Math.floor(n / 2)
  let q = p
  for (let i = 0; i < m; i ++) {
    q = q.succ
  }
  this.mergeSort(p, m)
  this.mergeSort(q, n - m)
  this.merge(p, m, q, n - m)
}

List.prototype.merge = function(p, n, q, m) {
  
}

var list = new List()

let first = list.insertAsFirst(10)
let n = list.insertA(first, 42)
n = list.insertA(n, 42)
n = list.insertA(n, 45)
n = list.insertA(n, 46)
n = list.insertA(n, 46)
n = list.insertA(n, 56)

n = list.insertA(n, 46)
n = list.insertA(n, 46)
n = list.insertA(n, 47)
// list.remove(n)

list.traverse(function(data) {
  console.log(data)
})
// console.log(list.search(9, list._size, list.trailer))
// list.uniquify()
// list.insertionSort(list.first(), list._size)
list.selectionSort(list.first(), list._size)

list.traverse(function(data) {
  console.log(data)
})