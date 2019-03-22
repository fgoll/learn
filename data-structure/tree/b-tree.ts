class Vector<T> {
  _elem: Array<T>;
  constructor(elem) {
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

}

class BTNode {
  parent: BTNode;
  key: Vector<number>;
  child: Vector<BTNode>;

  constructor(e?: number, lc?: BTNode, rc?: BTNode) {
    this.key = new Vector([])
    this.child = new Vector([])
    this.parent = null;
    if (e) {
      this.key._elem.push(e);
    }
    if (lc) {
      this.child._elem.push(lc);
      lc.parent = this;
    }
    if (rc) {
      this.child._elem.push(rc);
      rc.parent = this;
    }
  }
}

class BTree {
  protected _size: number;
  protected _order: number;
   _root: BTNode;
  protected _hot: BTNode;
  protected solveOverflow(v: BTNode) {
    if (v.child.length() <= this._order) return

    let s = Math.floor(this._order / 2)

    let u = new BTNode()
    let i
    for (i = 0; i < this._order - s - 1; i ++) {
      u.child.insert(i, v.child.remove(s + 1))
      u.key.insert(i, v.key.remove(s + 1))
    }
    u.child.insert(i, v.child.remove(s + 1))

    if (u.child[0]) {
      for (let j = 0; j < this._order - s; j ++) {
        u.child.get(j).parent = u
      }
    }

    let p = v.parent
    if (!p) {
      this._root = p = new BTNode()
      p.child.insert(0, v)
      v.parent = p
    }

    let r = p.key.search(v.key.get(0)) + 1
    p.key.insert(r, v.key.remove(s))
    p.child.insert(r + 1, u)
    u.parent = p
    this.solveOverflow(p)
  }
  protected solveUnderflow(v: BTNode) {
    if (v.child.length() >= Math.ceil(this._order / 2)) {
      return
    }

    let p = v.parent
    if (!p) { // 递归基 到达根
      if (v.key.length() === 0 && v.child.get(0)) { // 没有关键码了 却有一个唯一的孩子
        this._root = v.child.get(0)
        this._root.parent = null
      }
      return 
    }

    let r = 0;
    while(p.child.get(r) != v) {
      r ++
    }
    // 情况1 像左兄弟借关键码
    if (r > 0) { // v不是第一个孩子
      let ls = p.child.get(r - 1) // 左侧兄弟必定存在
      if (ls.child.length() > Math.ceil(this._order / 2)) { // 该兄弟足够胖
        v.key.insert(0, p.key.get(r - 1)) // 像父亲借一个关键码
        p.key.set(r - 1, ls.key.remove(ls.key.length() - 1)) // 将左侧兄弟最右端节点转给父亲
        v.child.insert(0, ls.child.remove(ls.child.length() - 1)) // 将左侧兄弟最后一个孩子节点交给v

        if (v.child.get(0)) {
          v.child.get(0).parent = v
        }
        return
      }
    }
    // 情况2 像右兄弟借关键码
    if (r < p.child.length() - 1) { // v不是最后一个孩子
      let rs = p.child.get(r + 1)
      if (rs.child.length() > Math.ceil(this._order / 2)) {
        v.key.insert(v.key.length(), p.key.get(r))
        p.key.set(r, rs.key.remove(0)) 
        v.child.insert(v.child.length(), rs.child.remove(0))

        if (v.child.get(v.child.length() - 1)) {
          v.child.get(v.child.length() - 1).parent = v
        }
        
        return 
      }
    }

    if (r > 0) {
      let ls = p.child.get(r - 1)
      ls.key.insert(ls.key.length(), p.key.remove(r - 1))
      p.child.remove(r)
      ls.child.insert(ls.child.length(), v.child.remove(0))
      if (ls.child.get(ls.child.length() - 1)) {
        ls.child.get(ls.child.length() - 1).parent = ls
      }
      while (v.key.length() > 0) {
        ls.key.insert(ls.key.length(), v.key.remove(0))
        ls.child.insert(ls.child.length(), v.child.remove(0))

        if (ls.child.get(ls.child.length() - 1)) {
          ls.child.get(ls.child.length() - 1).parent = ls
        }
      }
    }
    if (r < p.child.length() - 1 ) {
      let rs = p.child.get(r + 1)
      rs.key.insert(0, p.key.remove(r))
      p.child.remove(r)
      rs.child.insert(0, v.child.remove(v.child.length() - 1))
      if (rs.child.get(0)) {
        rs.child.get(0).parent = rs
      }
      while (v.key.length() > 0) {
        rs.key.insert(0, v.key.remove(v.key.length() - 1)) 
        rs.child.insert(0, v.child.remove(v.child.length() - 1)) 
        if (rs.child.get(0)) {
          rs.child.get(0).parent = rs
        }
      }
    }
    return this.solveUnderflow(p)
  }

  constructor(order = 3) {
    this._order = order
    this._size = 0
    this._root = new BTNode()
  }

  order(): number {
    return this._order
  }

  size(): number {
    return this._size
  }

  root(): BTNode {
    return this._root
  }

  empty(): boolean {
    return !this._root
  }

  search(e: number): BTNode {
    let v = this._root
    this._hot = null
    while (v) {
      let r = v.key.search(e)
      if ((0 <= r) && (e === v.key.get(r))) return v
      this._hot = v
      v = v.child.get(r + 1)
    }
    return null
  }

  insert(e: number): boolean {
    let v = this.search(e)
    if (v) return false
    let r = this._hot.key.search(e)
    this._hot.key.insert(r + 1, e)
    this._hot.child.insert(r + 2, null)
    this._size ++
    this.solveOverflow(this._hot)
    return true
  }

  remove(e: number): boolean {
    let v = this.search(e)
    if (!v) return false
    let r = v.key.search(e)
    
    if (v.child.get(0)) {
      let u = v.child.get(r + 1)
      while (u.child.get(0)) {
        u = u.child.get(0)
      }

      v.key.set(r, u.key.get(0))
      v = u;
      r = 0
    }

    v.key.remove(r)
    v.child.remove(r + 1)
    this.solveUnderflow(v)

    return true
  }
}

let tree = new BTree()

tree.insert(53);
tree.insert(36);
tree.insert(19)
tree.insert(77)
tree.insert(89)
tree.insert(41)
// console.log(tree);
console.log(tree._root.key)
console.log(tree._root.child._elem[0].key)
console.log(tree._root.child._elem[1].key)
console.log(tree._root.child._elem[2].key)

// function printTree(tree) {
//   let v = tree._root
//   while (v) {
//     let floor = v.key._elem.join(',')
//     console.log(floor)


//   }
// }