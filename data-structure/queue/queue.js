
module.exports = class Queue {
	constructor() {
		this.items = [];
	}

	enqueue(elm) {
		this.items.push(elm);
	}

	dequeue() {
		return this.items.shift();
	}

	front() {
		return this.items[0];
	}

	empty() {
		return this.items.length === 0;
	}

	clear() {
		this.items = [];
	}

	size() {
		return this.items.length;
	}
}