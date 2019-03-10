export type Index = { [id: string]: { [id: string]: number[] } };

export default class DictionArray<T> {
	private index: Index = {};
	private list: T[] = [];

	/**
	 * A Dictionarray is a neologism of the words Dictionary and Array
	 * This datastrucutre behaves like a list but can additionally keep
	 * track of an index structure, that uses an identifier has the index
	 * key. The identifier is extracted via a lambda function that is passed
	 * to the dictionarray structure during instantiation. this supercharges
	 * the regular array with faster index lookups
	 * @param indizesFunctions An object of index extraction functions.
	 * Each function must return a string that will be used as the index qualifier
	 * when looking up list positions.
	 * Example: If we want to index the boolean property  "depend" of  object T,
	 * the indexFunction would look like { "depend": (elem) => return elem.depend.toString() }
	 * All elements of equal depend value will be indexed together then
	 */
	public constructor(private indizesFunctions: { [id: string]: (elem: T) => string } = {}) {}

	//#region "Public Methods"

	/**
	 * Sets the list to the current values
	 * @param items A list of elements to set
	 * @param shouldReindex Should a reindex be triggered?
	 */
	public set(items: T[], shouldReindex: boolean = true): void {
		this.list = items;

		if (shouldReindex) {
			this.reindex();
		}
	}

	/***
	 * Add a new object to the structure
	 */
	public push(...item: T[]): number {
		// push to internal list structure
		const result = this.list.push(...item);

		this.reindex();

		return result;
	}

	/**
	 * Returns the length of the dictionarray structure
	 */
	public count(): number {
		return this.list.length;
	}

	/**
	 * Return all elements of the list structure
	 */
	public all(): T[] {
		return this.list;
	}

	/**
	 * Return a value from the list at a certain index
	 * @param index The index to return the element at
	 */
	public get(index: number): T {
		return this.list[index];
	}

	/**
	 * Clear the dictionarray of values
	 */
	public clear(): void {
		this.list = [];
		this.resetIndex();
	}

	/**
	 * The map() method creates a new array with the results of
	 * calling a provided function on every element in the calling
	 * array.
	 * @param callbackFn Function that produces an element of the new Array
	 */
	public map(callbackFn: (item: T, index: number) => any): any[] {
		return this.list.map(callbackFn);
	}

	/**
	 * The filter() method creates a new array with all elements that
	 * pass the test implemented by the provided function.
	 * @param callbackFn Function is a predicate, to test each element of the array.
	 * 					 Return true to keep the element, false otherwise
	 */
	public filter(callbackFn: (item: T, index?: number) => boolean): T[] {
		return this.list.filter(callbackFn);
	}

	/**
	 * The splice() method changes the contents of an array by removing or replacing
	 * existing elements and/or adding new elements.
	 * @param start Index at which to start changing the array (with origin 0).
	 * If greater than the length of the array, actual starting index
	 * will be set to the length of the array. If negative, will begin
	 * that many elements from the end of the array (with origin -1,
	 * meaning -n is the index of the nth last element and is therefore
	 * equivalent to the index of array.length - n) and will be set to 0
	 * if absolute value is greater than the length of the array.
	 * @param deleteCount An integer indicating the number of old array elements to remove.
	 * If deleteCount is omitted, or if its value is equal to or larger
	 * than array.length - start (that is, if it is equal to or greater
	 * than the number of elements left in the array, starting at start),
	 * then all of the elements from start through the end of the array
	 * will be deleted. If deleteCount is 0 or negative, no elements are
	 * removed. In this case, you should specify at least one new element.
	 * @param items The elements to add to the array, beginning at the start index. If
	 * you don't specify any elements, splice() will only remove elements
	 * from the array.
	 */
	public splice(start: number, deleteCount: number, items?: T[]): T[] {
		let result: T[];

		if (items) {
			result = this.list.splice(start, deleteCount, ...items);
		} else {
			result = this.list.splice(start, deleteCount);
		}

		// reindex after list has been altered
		this.reindex();

		return result;
	}

	/**
	 * Look up a number of array positions from an index of choice
	 * @param index The name of the index to use
	 * @param elem The element of T to look up from the index
	 */
	public lookupByElement(index: string, elem: T): number[] {
		if (!(index in this.indizesFunctions)) {
			return [];
		}

		// extract index qualifier
		const qualifier: string = this.indizesFunctions[index](elem);

		return this.lookup(index, qualifier);
	}

	/**
	 * Look up a number of array positions from an index of choice
	 * @param index The name of the index
	 * @param qualifier The qualifier key within the index
	 */
	public lookup(index: string, qualifier: string): number[] {
		// validate existance of index
		if (!(index in this.index)) {
			return [];
		}

		// nullcheck of index
		if (!this.index[index]) {
			return [];
		}

		// return value from index via name and qualifier
		return this.index[index][qualifier];
	}

	/**
	 * Returns the size of the index
	 */
	public numIndizes(): number {
		return Object.keys(this.index).length;
	}

	public reindex(): void {
		this.resetIndex();

		// loop all items in the list to update the indizes
		for (let i = 0; i < this.list.length; i++) {
			const obj: T = this.list[i];
			if (obj) {
				// run all index functions
				for (let indexName of Object.keys(this.indizesFunctions)) {
					// extracts a index value from object e.g. the id value
					const qualifier = this.indizesFunctions[indexName](obj);

					// if indexValue is not in index of name
					if (!(qualifier in this.index[indexName])) {
						this.index[indexName][qualifier] = [];
					}

					// check if the current position is already listed in this index name / value
					if (this.index[indexName][qualifier].indexOf(i) < 0) {
						this.index[indexName][qualifier].push(i);
					}
				}
			}
		}
	}

	//#endregion

	//#region "Private Methods"

	private resetIndex() {
		for (let indexName of Object.keys(this.indizesFunctions)) {
			this.index[indexName] = {};
		}
	}

	//#endregion
}
