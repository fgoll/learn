function goAlongLeftBranch(x, S) {
	while (x) {
		S.push(x);
		x = x.lChild;
	}
}

function travIn(x, visit) {
	var S = [];

	while (true) {
		goAlongLeftBranch(x, S);

		if (S.length === 0) {
			break;
		}

		x = S.pop();
		visit(x.data);

		x = x.rChild;
	}
}