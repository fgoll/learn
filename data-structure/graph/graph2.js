const VStatus = {
  UNDISCOVERED: 'undiscoverd',
  DISCOVERED: 'discovered',
  VISITED: 'visited'
}

const EType = {
  UNDETERMINDED: 'undetermined',
  TREE: 'tree',
  CROSS: 'cross',
  FORWARD: 'forward',
  BACKWARD: 'backward'
}

function Vertex(d) {
  this.data = d
  this.inDegree = 0
  this.outDegree = 0
  this.status = VStatus.UNDISCOVERED
  this.dTime = -1
  this.fTime = -1
  this.parent = -1
  this.priority = 999
}

function Edge(d, w) {
  this.data = d
  this.weight = w 
  this.type = EType.UNDETERMINDED
}

function GraphMatrix() {
  this.V = []
  this.E = []
  this.n = 0
  this.e = 0
}

GraphMatrix.prototype.vertex = function(i) {
  return this.V[i].data
}

GraphMatrix.prototype.inDegree = function(i) {
  return this.V[i].inDegree
}

GraphMatrix.prototype.outDegree = function(i) {
  return this.V[i].outDegree
}

GraphMatrix.prototype.exists = function(i, j) {
  return (i >= 0) && (i < this.n) && (j >= 0) && (j < this.n) && this.E[i][j] != null
}

GraphMatrix.prototype.nextNbr = function(i, j) {
  while (j >= 0 && !this.exists(i, --j));

  return j
}

GraphMatrix.prototype.firstNbr = function(i) {
  return this.nextNbr(i, this.n)
}

GraphMatrix.prototype.status = function(i) {
  return this.V[i].status
}
GraphMatrix.prototype.dTime = function(i) {
  return this.V[i].dTime
}

GraphMatrix.prototype.fTime = function(i) {
  return this.V[i].fTime
}

GraphMatrix.prototype.parent = function(i) {
  return this.V[i].parent
}

GraphMatrix.prototype.priority = function(i) {
  return this.V[i].priority
}

GraphMatrix.prototype.insertVertex = function(vertex) {
  for (let i = 0; i < this.n; i ++) {
    this.E[i].push(null)
  }
  this.n++
  let E = []
  for (let i = 0; i < this.n; i ++) {
    E.push(null)
  }
  this.E.push(E)

  let vert = new Vertex(vertex)
  this.V.push(vert)
  return vert
}

GraphMatrix.prototype.removeVertex = function(i) {
  let vBak = this.V.splice(i, 1)

  for (let j = 0; j < this.n; j ++) {
    if (this.exists(i, j)) {
      this.V[j].inDegree --
    }
  }

  this.E.splice(i, 1)

  for (let j = 0; j < this.n; j ++) {
    this.E[j].splice(i, 1)
    this.V[j].outDegree --
  }

  return vBak
}

GraphMatrix.prototype.type = function(i, j) { 
  return this.E[i][j].type
}

GraphMatrix.prototype.edge = function(i, j) {
  return this.E[i][j].data
}

GraphMatrix.prototype.weight = function(i, j) {
  return this.E[i][j].weight
}

GraphMatrix.prototype.insertEdge = function(edge, w, i, j) {
  if (this.exists(i, j)) return
  this.E[i][j] = new Edge(edge, w)
  this.e ++
  this.V[i].outDegree ++
  this.V[j].inDegree ++
}

GraphMatrix.prototype.removeEdge = function(i, j) {
  let eBak = this.edge(i, j)
  this.E[i][j] = null
  this.e --
  this.V[i].outDegree --
  this.V[j].inDegree --

  return eBak
}
const Queue = require('../queue/queue')

GraphMatrix.prototype.BFS = function(v, clock) {
  let queue = new Queue()

  queue.enqueue(v)
  this.V[v].status = VStatus.DISCOVERED

  while(!queue.empty()) {
    let v = queue.dequeue()
    this.V[v].clock = ++clock
    for (let u = this.firstNbr(v); u > -1; u = this.nextNbr(v, u)) {
      if (VStatus.UNDISCOVERED === this.status(u)) {
        this.V[u].status = VStatus.DISCOVERED
        queue.enqueue(u)
        this.E[v][u].type = EType.TREE
        this.V[u].parent = v
      }else {
        this.E[v][u].type = EType.CROSS
      }
    }
    console.log(this.V[v].data)
    this.V[v].status = VStatus.VISITED
  }
  return clock
}

GraphMatrix.prototype.bfs = function(s) {
  let clock = 0
  let v = s

  do {
    if (VStatus.UNDISCOVERED === this.V[v].status) {
      clock = this.BFS(v, clock)
    }
  }while (s !== (v = (++v % this.n)))
}

GraphMatrix.prototype.DFS = function(v, clock) {
  this.V[v].status = VStatus.DISCOVERED
  this.V[v].dTime = ++clock
  console.log(this.V[v].data)
  for (let u = this.firstNbr(v); u > -1; u = this.nextNbr(v, u)) {
    switch(this.V[u].status) {
      case VStatus.UNDISCOVERED:
        this.E[v][u].type = EType.TREE
        this.V[u].parent = v
        this.DFS(u, clock)
      case VStatus.DISCOVERED:
        this.E[v][u].type = EType.BACKWARD
      case VStatus.VISITED:
        this.E[v][u].type = (this.V[v].dTime < this.V[u].dTime) ? EType.FORWARD : EType.CROSS
    }
  }
  this.V[v].status = VStatus.VISITED
  this.fTime = ++clock
  return clock
}

GraphMatrix.prototype.dfs = function(s) {
  let v = s
  let clock = 0

  do {
    if (VStatus.UNDISCOVERED === this.V[v].status) {
      clock = this.DFS(v, clock)
    }
  } while(s !== (v = (++v) % this.n))
}

let g = new GraphMatrix();

g.insertVertex('A'); // 0
g.insertVertex('S');	// 1
g.insertVertex('E');	// 2
g.insertVertex('D');	// 3
g.insertVertex('C');	// 4
g.insertVertex('F');	// 5
g.insertVertex('B');	// 6
g.insertVertex('G');	// 7


g.insertEdge(1, null, 0, 2);
g.insertEdge(1, null, 0, 4);
g.insertEdge(1, null, 1, 0);
g.insertEdge(1, null, 1, 4);
g.insertEdge(1, null, 1, 3);
g.insertEdge(1, null, 2, 5);
g.insertEdge(1, null, 2, 7);
g.insertEdge(1, null, 3, 6);
g.insertEdge(1, null, 4, 6);
g.insertEdge(1, null, 7, 5);


g.DFS(1)

// console.log(g)