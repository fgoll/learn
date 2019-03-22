function BinNode(data, parent) {
  this.parent = parent
  this.lChild = null
  this.rChild = null
  this.data = data
  this.height = 0
}

BinNode.prototype.size = function() {
  let s = 1
  if (this.lChild) s += this.lChild.size()
  if (this.rChild) s += this.rChild.size()
  return s 
}

BinNode.prototype.succ = function() {
  let s = this
  if (this.rChild) {
    s = this.rChild
    while (s.lChild) {
      s = s.lChild
    }
  }else {
    while (this.parent.rChild === s) {
      s = s.parent
    }

    s = s.parent
  }
  return s
}

BinNode.prototype.insertAsLC = function(e) {
  return this.lChild = new BinNode(e, this)
}

BinNode.prototype.insertAsRC = function(e) {
  return this.rChild = new BinNode(e, this)
}

function stature(p) {
  return p ? p.height : -1
}

function BinTree() {
  this._size = 0
  this._root = null
}

BinTree.prototype.size = function() {
  return this._size
}

BinTree.prototype.empty = function() {
  return !this._root
}

BinTree.prototype.root = function() {
  return this._root
}

BinTree.prototype.updateHeight = function(x) {
  return x.height = Math.max(stature(x.lChild), stature(x.rChild)) + 1
}

BinTree.prototype.updateHeightAbove = function(x) {
  while(x) {
    this.updateHeight(x)
    x = x.parent
  }
}

BinTree.prototype.insertAsRoot = function(e) {
  this._size = 1;
  return this._root = new BinNode(e)
}

BinTree.prototype.insertAsRC = function(x, e) {
  this._size++
  x.insertAsRC(e)
  this.updateHeightAbove(x)
  return x.rChild
}

BinTree.prototype.insertAsLC = function(x, e) {
  this._size++
  x.insertAsLC(e)
  this.updateHeightAbove(x)
  return x.lChild
}

BinTree.prototype.attachAsLC = function(x, S) {
  if (x.lChild = S._root) {
    x.lChild.parent = x
  }
  this._size += S._size
  this.updateHeightAbove(x) 
  return x
}

BinTree.prototype.attachAsRC = function(x, S) {
  if (x.rChild = S._root) {
    x.rChild.parent = x
  }
  this._size += S._size
  this.updateHeightAbove(x)
  return x
}

BinTree.prototype.travPre_0 = function(x, visit) {
  if (!x) return

  visit(x.data)
  this.travPre_0(x.lChild, visit)
  this.travPre_0(x.rChild, visit)
}

BinTree.prototype.travPre_1 = function(x, visit) {
 let S = []
 S.push(x)
 let c 
 while(S.length != 0) {
   if (c = S.pop()) {
    visit(c.data)

    S.push(c.rChild)
    S.push(c.lChild)
   }
 }
}

function visitAlongLeftBranch(x, visit, S) {
  while(x) {
    visit(x.data)
    S.push(x.rChild)
    x = x.lChild
  }
}

BinTree.prototype.travPre_2 = function(x, visit) {
  let S = []

  while (true) {
    visitAlongLeftBranch(x, visit, S)
    if (S.length === 0) break
    x = S.pop()
  }
}

BinTree.prototype.travIn_0 = function(x, visit) {
  if (!x) return

  this.travIn_0(x.lChild, visit)
  visit(x.data)
  this.travIn_0(x.rChild, visit)
}

function goAlongLeftBranch(x, S) {
  while(x) {
    S.push(x)
    x = x.lChild
  }
}

BinTree.prototype.travIn_1 = function(x, visit) {
  const S = []
  while (true) {
    goAlongLeftBranch(x, S)
    if (S.length === 0) break
    x = S.pop()
    visit(x.data)
    x = x.rChild
  }
}

module.exports = {
  BinTree,
  BinNode
}

// let tree = new BinTree()

// let root = tree.insertAsRoot(20)
// let lc = tree.insertAsLC(root, 10)
// tree.insertAsRC(root, 499)

// let tree2 = new BinTree()
// let root2 = tree2.insertAsRoot(8)
// tree2.insertAsLC(root2, 9)
// tree2.insertAsRC(root2, 19)

// tree.attachAsLC(lc, tree2)

// console.log(root)

// // tree.travPre_0(root, function(data) {
// //   console.log(data)
// // })

// // tree.travPre_2(root, function(data) {
// //   console.log(data)
// // })

// tree.travIn_0(root, function(data) {
//   console.log(data)
// })

// console.log()

// tree.travIn_1(root, function(data) {
//   console.log(data)
// })
