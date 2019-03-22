/*!
 * ███╗   ██╗██████╗ 
 * ████╗  ██║██╔══██╗
 * ██╔██╗ ██║██████╔╝
 * ██║╚██╗██║██╔══██╗
 * ██║ ╚████║██████╔╝
 *   ╚═══╝╚═════╝ 
 */
var BST = require('./bst')
const {BinNode} = require('./tree')

function stature(p) {
  return p ? p.height : -1
}

function IsLChild(x) {
  return x.parent != null && x.parent.lChild == x
}

function IsRChild(x) {
  return x.parent != null && x.parent.rChild == x
}

function balanced(x) {
  return stature(x.lChild) === stature(x.rChild)
}

function balFac(x) {
  return stature(x.lChild) - stature(x.rChild)
}

function avlBalanced(x) {
  return (balFac(x) > -2) && (balFac(x) < 2)
}

function tallerChild(x) {
  return stature(x.lChild) > stature(x.rChild) ? x.lChild : (
         stature(x.lChild) < stature(x.rChild) ? x.rChild : (
         IsLChild(x) ? x.lChild : x.rChild
    )
  )
}

function AVL() {

}

AVL.prototype = new BST()

AVL.prototype.insert = function(e) {
  
  let x = this.search(e)

  if (x) return x

  x = new BinNode(e, this._hot)
  this._size ++

  if (this._hot) {
    if (this._hot.data < e) {
      this._hot.rChild = x
    }else {
      this._hot.lChild = x
    }

    for (let g = this._hot; g; g = g.parent) {
   
      if (!avlBalanced(g)) {
        if (IsLChild(g)) {
          g.parent.lChild = this.rotateAt(tallerChild(tallerChild(g)))
        }else if (IsRChild(g)) {
          g.parent.rChild = this.rotateAt(tallerChild(tallerChild(g)))
        }else {
          this._root = this.rotateAt(tallerChild(tallerChild(g)))
        }
        break
      }else {
        this.updateHeight(g)
      }
    }
  }else {
    this._root = x 
  }
  return x
}

AVL.prototype.remove = function(e) {
  let x = this.search(e) 
  if (!x) return false
  this.removeAt(x)
  this._size --

  for (let g = this._hot; g; g = g.parent) {
    if (!avlBalanced(g)) {
      if (IsLChild(g)) {
        g.parent.lChild = this.rotateAt(tallerChild(tallerChild(g)))
      }else if (IsRChild(g)) {
        g.parent.rChild = this.rotateAt(tallerChild(tallerChild(g)))
      }else {
        this._root = this.rotateAt(tallerChild(tallerChild(g)))
      }
    }
    this.updateHeight(g)
  }
}

AVL.prototype.connect34 = function(a, b, c, t0, t1, t2, t3) {
  a.lChild = t0
  if (t0) t0.parent = a
  a.rChild = t1
  if (t1) t1.parent = a
  this.updateHeight(a)
  c.lChild = t2
  if (t2) t2.parent = c
  c.rChild = t3
  if (t3) t3.parent = c
  b.lChild = a
  a.parent = b
  b.rChild = c
  c.parent = b
  this.updateHeight(b)
  return b
}

AVL.prototype.rotateAt = function(v) {
  let p = v.parent
  let g = p.parent
  if (IsLChild(p)) {  // zig
    if (IsLChild(v)) {  // zig zig
      console.log('zig zig')
      p.parent = g.parent
      return this.connect34(v, p, g, v.lChild, v.rChild, p.rChild, g.rChild)
    } else {  // zig zag
      console.log('zig zag')
      v.parent = g.parent
      return this.connect34(p, v, g, p.lChild, v.lChild, v.rChild, g.rChild)
    }
  }else { // zag
    if (IsRChild(v)) { // zag zag
      console.log('zag zag')
      p.parent = g.parent
      return this.connect34(g, p, v, g.lChild, p.lChild, v.lChild, v.rChild)
    }else { // zag zig
      console.log('zag zig')
      v.parent = g.parent
      return this.connect34(g, v, p, g.lChild, v.lChild, v.rChild, p.rChild)
    }
  }
}


let bst = new AVL()

bst.insert(10)
bst.insert(2)
bst.insert(11)
bst.insert(14)
bst.insert(24)
// bst.insert(5)

bst.remove(2)

// bst.insert(10)
console.log('==================')
console.log(bst._root)