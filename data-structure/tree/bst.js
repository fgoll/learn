const {BinTree, BinNode} = require('./tree')


function BST() {
  this._hot = null
}

module.exports = BST

BST.prototype = new BinTree()

BST.prototype.searchIn = function(v, e) {
  if (!v || v.data === e) {
    return v
  }
  this._hot = v
  return this.searchIn((e < v.data) ? v.lChild : v.rChild, e)
}

BST.prototype.search = function(e) {

  return this.searchIn(this._root, e)
}

BST.prototype.insert = function(e) {
  let v = this.searchIn(this._root, e)
  if (v) return v
  
  if (this._hot) {
    v = new BinNode(e, this._hot)
    if (this._hot.data > e) {
      this._hot.lChild = v
    }else {
      this._hot.rChild = v
    }
  }else {
    this._root = new BinNode(e)
  }
  this._size ++
  this.updateHeightAbove(v)

  return v
}

function swap(a, b) {
  let t = a.data
  a.data = b.data
  b.data = t
}

BST.prototype.removeAt = function(v) {
  let succ = null

  if (!v.lChild) {
    succ = v.rChild
    // console.log(v)
    // console.log(v.parent.lChild)
    if (v == v.parent.lChild) {
      v.parent.lChild = succ
    }else {
      v.parent.rChild = succ 
    }
  }else if (!v.rChild) {
    succ = v.lChild

    if (v == v.parent.lChild) {
      v.parent.lChild = succ
    }else {
      v.parent.rChild = succ 
    }
  }else {
    let s = v.succ()
    // console.log(s)
    swap(s, v)

    let u = s.parent
    succ = s.rChild

    if (u === v) {
      u.rChild = succ
    }else {
      u.lChild = succ
    }
  }
  // console.log(succ)

  this._hot = v.parent
  if (succ) succ.parent = this._hot

 
}

BST.prototype.remove = function(e) {
  let v = this.search(e)
  if (!v) return false

  this.removeAt(v) 

  this._size --
  this.updateHeightAbove(this._hot)
}

let bst = new BST()

bst.insert(10)
bst.insert(2)
bst.insert(12)
bst.insert(14)
bst.insert(24)
bst.insert(5)
bst.insert(11)
// console.log('删除')
// // bst.remove(2)

// // console.log(bst)
console.log(bst._root)