const VSTATUS = require('./graph.js').VSTATUS,
		ESTATUS = require('./graph.js').ESTATUS,
		Graph = require('./graph.js').Graph;


let g = new Graph();

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



// g.bfs(1)

g.DFS(1)


