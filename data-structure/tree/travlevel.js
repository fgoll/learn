var Queue = require('../queue/queue.js');

function travLevel(x, visit) {

	var queue = new Queue();

	queue.enqueue(x);

	while (!queue.empty()) {
		x = queue.dequeue();
		visit(x.data);
		if (x.lChild) queue.enqueue(x.lChild);
		if (x.rChild) queue.enqueue(x.rChild);
	}
}



var node = {
	lChild: null,
	rChild: null,
	data: null
}


var n2 = {
	lChild: null,
	data: 2,
	rChild: null
}

var n3 = {
	lChild: null,
	data: 3,
	rChild: null
}

var n1 = {
	lChild: n2,
	rChild: n3,
	data: 1,	
}

var n4 = {
	lChild: null,
	data: 4,
	rChild: null
}

var root = {
	lChild: n1,
	rChild: n4,
	data: 0
}

travLevel(root, function(x) {
	console.warn(x + '-->')
})

