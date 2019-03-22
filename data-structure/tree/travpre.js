function visitAlongLeftBranch(x, visit, S) {
	while (x) {
		visit(x.data);
		S.push(x.rChild);
		console.log(S)
		x = x.lChild;
	}
}


function travPrev(x, visit) {
	var S = [];
	while (true) {
		visitAlongLeftBranch(x, visit, S);
		if (S.length === 0) break;
		x = S.pop();
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

travPrev(root, function(x) {
	console.warn(x + '-->')
})

