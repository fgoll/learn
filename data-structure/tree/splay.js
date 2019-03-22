var BST = require('./bst')
const {BinNode} = require('./tree')

function attachAsLChild(p, lc) {
  p.lChild = lc
  if (lc) {
    lc.parent = p
  }
}

function attachAsRChild(p, rc) {
  p.rChild = rc
  if (rc) {
    rc.parent = p
  }
} 

function IsLChild(x) {
  return x.parent != null && x.parent.lChild == x
}

function IsRChild(x) {
  return x.parent != null && x.parent.rChild == x
}

function Splay() {

}

Splay.prototype = new BST()

Splay.prototype.splay = function(v) {
  let g, p
  while ((p = v.parent) && (g = p.parent)) {
    let gg = g.parent

    if (IsLChild(v)) {
      if (IsLChild(p)) { // zig zig 
        attachAsLChild(g, p.rChild)
        attachAsRChild(p, g)
        attachAsLChild(p, v.rChild)
        attachAsRChild(v, p)
      }else { // zig zag
        attachAsLChild(p, v.rChild)
        attachAsRChild(g, v.lChild)
        attachAsLChild(v, g)
        attachAsRChild(v, p)
      }
    }else {
      if (IsRChild(p)) { // zag zag
        attachAsRChild(g, p.lChild)
        attachAsRChild(p, v.lChild)
        attachAsLChild(p, g)
        attachAsRChild(v, p)
      }else { // zag zig
        attachAsRChild(p, v.lChild)
        attachAsLChild(g, v.rChild)
        attachAsLChild(v, p)
        attachAsRChild(v, g)
      }
    }
    if (!gg) {
      v.parent = null
    }else {
      v.parent = gg
      if (g == gg.lChild) {
        gg.lChild = v
      }else {
        gg.rChild = v
      }
    }
    this.updateHeight(g)
    this.updateHeight(p)
    this.updateHeight(v)
  }

  p = v.parent
  if (p) {
    if (IsLChild(v)) {
      attachAsLChild(p, v.rChild)
      attachAsRChild(v, p)
    }else {
      attachAsRChild(p, v.lChild) 
      attachAsLChild(v, p)
    }
    this.updateHeight(p)
    this.updateHeight(v)
    v.parent = null

  }

  return v
}

Splay.prototype.search = function(e) {
  let v = this.searchIn(this._root, e)

  this._root = this.splay((v ? v : this._hot))
  // console.log(this._root)
  return this._root 
}

Splay.prototype.insert = function(e) {
  if (!this._root) {
    this._size ++
    return (this._root = new BinNode(e))
  }

  let v = this.search(e)
  if (v && v.data === e) return this._root

  this._size ++
  let t = this._root
  this._root = new BinNode(e)
  if (t.data < e) {

    this._root.rChild = t.rChild
    this._root.lChild = t
    t.parent = this._root
    if (t.rChild) {
      t.rChild.parent = this._root
      t.rChild = null
    }
  }else {
    this._root.lChild = t.lChild
    this._root.rChild = t
    t.parent = this._root
    if (t.lChild) {
      t.lChild.parent = this._root
      t.lChild = null
    }
  }
  this.updateHeightAbove(t)
  return this._root
}

Splay.prototype.remove = function(e) {

  if (!this._root || (e !== this.search(e).data)) return false

  if (!this._root.lChild) {
    this._root = this._root.rChild
    if (this._root.rChild) {
      this._root.rChild.parent = null
    }
  }else if (!this._root.rChild) {
    this._root = this._root.lChild
    if (this._root.lChild) {
      this._root.lChild.parent = null
    }
  }else {
    let lChild = this._root.lChild
    this._root.lChild = null
    this._root = this._root.rChild

    this.search(e)
    this._root.lChild = lChild
    this._root.parent = null
    lChild.parent = this._root
  }
  this._size --
  if (this._root) {
    this.updateHeight(this._root)
  }
  return true
  
}


let bst = new Splay()

// bst.insert(10)
bst.insert(2)
bst.insert(11)
bst.insert(14)
bst.insert(24)
bst.insert(5)

// // bst.search(2)
bst.remove(11)

// console.log(bst)
console.log(bst._root)