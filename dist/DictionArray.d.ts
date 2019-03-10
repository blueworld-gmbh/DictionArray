export declare type Index = {
    [id: string]: {
        [id: string]: number[];
    };
};
export default class DictionArray<T> {
    private indizesFunctions;
    private index;
    private list;
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
    constructor(indizesFunctions?: {
        [id: string]: (elem: T) => string;
    });
    /**
     * Sets the list to the current values
     * @param items A list of elements to set
     * @param shouldReindex Should a reindex be triggered?
     */
    set(items: T[], shouldReindex?: boolean): void;
    /***
     * Add a new object to the structure
     */
    push(...item: T[]): void;
    /**
     * Returns the length of the dictionarray structure
     */
    count(): number;
    /**
     * Return all elements of the list structure
     */
    all(): T[];
    /**
     * Return a value from the list at a certain index
     * @param index The index to return the element at
     */
    get(index: number): T;
    /**
     * Clear the dictionarray of values
     */
    clear(): void;
    /**
     * The map() method creates a new array with the results of
     * calling a provided function on every element in the calling
     * array.
     * @param callbackFn Function that produces an element of the new Array
     */
    map(callbackFn: (item: T, index: number) => any): any[];
    /**
     * The filter() method creates a new array with all elements that
     * pass the test implemented by the provided function.
     * @param callbackFn Function is a predicate, to test each element of the array.
     * 					 Return true to keep the element, false otherwise
     */
    filter(callbackFn: (item: T, index?: number) => boolean): T[];
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
    splice(start: number, deleteCount: number, items?: T[]): T[];
    /**
     * Look up a number of array positions from an index of choice
     * @param index The name of the index to use
     * @param elem The element of T to look up from the index
     */
    lookupByElement(index: string, elem: T): number[];
    /**
     * Look up a number of array positions from an index of choice
     * @param index The name of the index
     * @param qualifier The qualifier key within the index
     */
    lookup(index: string, qualifier: string): number[];
    /**
     * Returns the size of the index
     */
    numIndizes(): number;
    reindex(): void;
    private resetIndex;
}
