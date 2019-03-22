
Queue = require('../queue/queue.js');

const VSTATUS = {
	UNDISCOVERED: 'UNDISCOVERED',
	DISCOVERED: 'DISCOVERED',
	VISITED: 'VISITED'
}

const ESTATUS = {
	UNDETERMINED: 'UNDETERMINED',
	TREE: 'TREE',
	CROSS: 'CROSS',
	FOWARD: 'FOWARD',
	BACKWARD: 'BACKWARD'
}

const INT_MAX = 999999

class Vertex {

	// data;
	// inDegree;
	// outDegree;
	// status;
	// dTime;
	// fTime;
	// parent;
	// priority;
	
	constructor(data) {
		this.data = data;
		this.inDegree = 0;
		this.outDegree = 0;
		this.status = VSTATUS.UNDISCOVERED;
		this.dTime = -1;
		this.fTime = -1;
		this.parent = -1;
		this.priority = INT_MAX;
	}
}

class Edge {
	// data;
	// weight;
	// status;

	constructor(data, weight) {
		this.data = data;
		this.weight = weight;
		this.status = ESTATUS.UNDETERMINED;
	}
}

class Graph {
	// V;
	// E;
	// n;
	// e;

	constructor() {
		this.n = 0;
		this.e = 0;
		this.V = [];
		this.E = []
	}

	reset() {
		for (let i = 0; i < this.n; i ++) {
			this.V[i].status = VSTATUS.UNDISCOVERED; this.V[i].dTime = -1;
			this.V[i].parent = -1; this.V[i].priority = 999999;
			for (let j = 0; j < this.n; j ++) {
				if (this.exists(i, j)) {
					this.E[i][j].status = ESTATUS.UNDETERMINED;

				}
			}
		}
	}

 	exists(i, j) {
 		return (i >= 0) && (i < this.n) && (j >= 0) && (j < this.n) && (this.E[i][j] !== null);
	}

	nextNbr(i, j) {
		while ((-1 < j) && !this.exists(i, --j));
		return j;
	}

	firstNbr(i) {
		return this.nextNbr(i, this.n);
	}

	insertEdge(data, weight, i, j) {
		if (this.exists(i, j)) return;

		var edge = new Edge(data, weight);

		this.e ++;
		if (this.E[i] === undefined) {
			this.E[i] = []
		}

		this.E[i][j] = edge;
		this.V[i].outDegree ++;
		this.V[j].inDegree ++;
	}

	removeEdge(i, j) {
		var edge = this.E[i][j];

		this.E[i][j] = null;

		this.e --;

		this.V[i].outDegree --;
		this.V[j].inDegree --;

		return edge;
	}

	insertVertex(data) {
		for (let i = 0; i < this.n; i ++) {
			if (this.E[i] === undefined) {
				this.E[i] = []
			}
			this.E[i].push(null);
		}
		this.n ++;
		let row = []
		for (let i = 0; i < this.n; i ++) {
			row.push(null);
		}
		this.E.push(row);
		return this.V.push(new Vertex(data));
	}

	removeVertex(i) {
		for (let j = 0; j < this.n; j ++) {
			if (this.exists(i, j)) {
				this.V[j].inDegree--;
			}
		}
		this.E.splice(i, 1);

		let vBak = this.V[i].data;
		this.V.splice(i, 1);

		for (let j = 0; j < this.n; j ++) {
			if (this.E[j][i]) {
				this.V[j].outDegree --;	
			}
			this.E[j].splice(i, 1);
		}
		return vBak;
	}


	bfs(start) {
		this.reset();
		let clock = 0, v = start;
		do {
			if (this.V[v].status === VSTATUS.UNDISCOVERED)
				this.BFS(v, clock);
		}while (start != (v = (++v % this.n)))
	}

	BFS(start, clock) {
		let q = new Queue();
		this.V[start].status = VSTATUS.DISCOVERED;
		q.enqueue(start);

		while (!q.empty()) {
			let v = q.dequeue();
			this.V[v].dTime = ++clock;
			for (let i = this.firstNbr(v); i > -1; i = this.nextNbr(v, i)) {

				if (this.V[i].status === VSTATUS.UNDISCOVERED) {
					this.V[i].status = VSTATUS.DISCOVERED;
					this.E[v][i].status = ESTATUS.TREE;
					this.V[i].parent = v;
					q.enqueue(i);
				}else {
					this.E[v][i].status = ESTATUS.CROSS;
				}
			}


			this.V[v].status = VSTATUS.VISITED;
			console.log(this.V[v].data);
		}
	}

	DFS(start, clock) {

		this.V[start].dTime = ++clock;
		this.V[start].status = VSTATUS.DISCOVERED;

		console.log(this.V[start].data);

		for (let i = this.firstNbr(start); i > -1; i = this.nextNbr(start, i)) {
			if (this.V[i].status === VSTATUS.UNDISCOVERED) {
				this.E[start][i].status = VSTATUS.TREE;
				this.V[i].parent = start;
				this.DFS(i, clock);
			}else if (this.V[i].status === VSTATUS.DISCOVERED) {
				this.E[start][i].status = VSTATUS.BACKWARD;
			}else {
				this.E[start][i].status = this.V[start].dTime < this.V[i].dTime ?  VSTATUS.FOWARD : VSTATUS.CROSS;
			}
		}

		this.V[start].status = VSTATUS.VISITED; 

		this.V[start].fTime = ++clock;
	}

}

module.exports = {
	VSTATUS: VSTATUS,
	ESTATUS: ESTATUS,
	Graph: Graph
}


