/**
 * @auth wangyun
 * @date 2021/2/5-20:18
 */

export class LinkedListNode<T> {
	private _list: LinkedList<T>;
	public get list(): LinkedList<T> {
		return this._list;
	}
	public set list(list: LinkedList<T>) {
		this._list = list;
	}

	private _next: LinkedListNode<T>;
	public get next(): LinkedListNode<T> {
		return this._next == null || this._next === this._list.first ? null : this._next;
	}
	public set next(node: LinkedListNode<T>) {
		this._next = node;
	}

	private _prev: LinkedListNode<T>;
	public get prev(): LinkedListNode<T> {
		return this._prev == null || this === this._list.first ? null : this._prev;
	}
	public set prev(node: LinkedListNode<T>) {
		this._prev = node;
	}

	private _item: T;
	public get value(): T {
		return this._item;
	}
	public set value(item: T) {
		this._item = item;
	}

	constructor(list: LinkedList<T>, value: T) {
		this._list = list;
		this._item = value;
	}

	public invalidate() {
		delete this._item;
		delete this._next;
		delete this._prev;
	}
}

export class LinkedList<T> implements Iterable<T> {
	public * [Symbol.iterator](): Iterator<T> {
		let node = this._head;
		if (node != null) {
			do {
				yield node.value;
				node = node["_next"];
			} while (node != this._head);
		}
	}

	constructor(collection: Iterable<T>) {
		if (collection) {
			for (let element of collection) {
				this.addLast(element);
			}
		}
	}

	private _size = 0;
	public get size(): number {
		return this._size;
	}

	private _head: LinkedListNode<T>;
	public get first(): LinkedListNode<T> {
		return this._head;
	}
	public get last(): LinkedListNode<T> {
		return this._head && this._head["_prev"];
	}

	public addAfter(node: LinkedListNode<T>, value: T): LinkedListNode<T> {
		let result = new LinkedListNode<T>(node.list, value);
		this.$insertBefore(node["_next"], result);
		return result;
	}

	public addBefore(node: LinkedListNode<T>, value: T): LinkedListNode<T> {
		let result = new LinkedListNode<T>(node.list, value);
		this.$insertBefore(node, result);
		node === this._head && (this._head = result);
		return result;
	}

	public addFirst(value: T): LinkedListNode<T> {
		let result = new LinkedListNode<T>(this, value);
		if (this._head == null) {
			this.$insertToEmptyList(result);
		} else {
			this.$insertBefore(this._head, result);
			this._head = result;
		}
		return result;
	}

	public addLast(value: T): LinkedListNode<T> {
		let result = new LinkedListNode<T>(this, value);
		if (this._head == null) {
			this.$insertToEmptyList(result);
		} else {
			this.$insertBefore(this._head, result);
		}
		return result;
	}

	public clear(): void {
		let node = this._head;
		if (node != null) {
			do {
				let temp = node;
				node = node["_next"];
				temp.invalidate();
			} while (node != this._head);
		}
		this._head = null;
		this._size = 0;
	}

	public contains(value: T): boolean {
		return this.find(value) != null;
	}

	public find(value: T): LinkedListNode<T> {
		let node = this._head;
		if (node != null) {
			if (value != null) {
				do {
					if (node.value === value) {
						return node;
					}
					node = node["_next"];
				} while (node !== this._head)
			} else {
				do {
					if (node.value == null) {
						return node;
					}
					node = node["_next"];
				} while (node !== this._head)
			}
		}
		return null;
	}

	public findLast(value: T): LinkedListNode<T> {
		let last = this._head && this._head["_prev"];
		if (last != null) {
			let node = last;
			if (value != null) {
				do {
					if (node.value === value) {
						return node;
					}
					node = node["_prev"];
				} while (node !== last)
			} else {
				do {
					if (node.value == null) {
						return node;
					}
					node = node["_prev"];
				} while (node !== last)
			}
		}
		return null;
	}

	public remove(value: T): boolean {
		return this.removeFirst(value);
	}

	public removeFirst(value?: T): boolean {
		if (arguments.length > 0) {
			let node = this.find(value);
			if (node != null) {
				this.$remove(node);
				return true;
			}
			return false;
		} else {
			if (this._head != null) {
				this.$remove(this._head);
				return true;
			}
			return false;
		}
	}

	public removeLast(value?: T): boolean {
		if (arguments.length > 0) {
			let node = this.findLast(value);
			if (node != null) {
				this.$remove(node);
				return true;
			}
			return false;
		} else {
			if (this._head != null) {
				this.$remove(this._head["_prev"]);
				return true;
			}
			return false;
		}
	}

	public toArray(): T[] {
		let array: T[] = [];
		let node = this._head;
		let index = 0;
		if (node != null) {
			do {
				array[index++] = node.value;
				node = node["_next"];
			} while (node != this._head);
		}
		return array;
	}

	private $insertBefore(node: LinkedListNode<T>, newNode: LinkedListNode<T>): void {
		newNode["_next"] = node;
		newNode["_prev"] = node["_prev"];
		node["_prev"]["_next"] = newNode;
		node["_prev"] = newNode;
		this._size++;
	}

	private $insertToEmptyList(newNode: LinkedListNode<T>): void {
		if (this._size !== 0) {
			console.error("LinkedList must be empty when this method is called!");
		}
		newNode["_next"] = newNode;
		newNode["_prev"] = newNode;
		this._head = newNode;
		this._size++;
	}

	private $remove(node: LinkedListNode<T>): void {
		if (node.list !== this) {
			console.error("Deleting the node from another list!");
		}
		if (this._head == null) {
			console.error("This method shouldn't be called on empty list!");
		}
		if (node["_next"] == node) {
			if (this._size !== 1 || this._head !== node) {
				console.error("This should only be true for a list with only one node");
			}
			this._head  = null;
		} else {
			node["_next"]["_prev"] = node["_prev"];
			node["_prev"]["_next"] = node["_next"];
			if (this._head === node) {
				this._head = node["_next"];
			}
		}
		node.invalidate();
		this._size--;
	}
}