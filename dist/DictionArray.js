"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DictionArray = /** @class */ (function () {
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
    function DictionArray(indizesFunctions) {
        if (indizesFunctions === void 0) { indizesFunctions = {}; }
        this.indizesFunctions = indizesFunctions;
        this.index = {};
        this.list = [];
    }
    //#region "Public Methods"
    /**
     * Sets the list to the current values
     * @param items A list of elements to set
     * @param shouldReindex Should a reindex be triggered?
     */
    DictionArray.prototype.set = function (items, shouldReindex) {
        if (shouldReindex === void 0) { shouldReindex = true; }
        this.list = items;
        if (shouldReindex) {
            this.reindex();
        }
    };
    /***
     * Add a new object to the structure
     */
    DictionArray.prototype.push = function () {
        var item = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            item[_i] = arguments[_i];
        }
        var _a;
        // push to internal list structure
        (_a = this.list).push.apply(_a, item);
        this.reindex();
    };
    /**
     * Returns the length of the dictionarray structure
     */
    DictionArray.prototype.count = function () {
        return this.list.length;
    };
    /**
     * Return all elements of the list structure
     */
    DictionArray.prototype.all = function () {
        return this.list;
    };
    /**
     * Return a value from the list at a certain index
     * @param index The index to return the element at
     */
    DictionArray.prototype.get = function (index) {
        return this.list[index];
    };
    /**
     * Clear the dictionarray of values
     */
    DictionArray.prototype.clear = function () {
        this.list = [];
        this.resetIndex();
    };
    /**
     * The map() method creates a new array with the results of
     * calling a provided function on every element in the calling
     * array.
     * @param callbackFn Function that produces an element of the new Array
     */
    DictionArray.prototype.map = function (callbackFn) {
        return this.list.map(callbackFn);
    };
    /**
     * The filter() method creates a new array with all elements that
     * pass the test implemented by the provided function.
     * @param callbackFn Function is a predicate, to test each element of the array.
     * 					 Return true to keep the element, false otherwise
     */
    DictionArray.prototype.filter = function (callbackFn) {
        return this.list.filter(callbackFn);
    };
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
    DictionArray.prototype.splice = function (start, deleteCount, items) {
        var _a;
        var result;
        if (items) {
            result = (_a = this.list).splice.apply(_a, [start, deleteCount].concat(items));
        }
        else {
            result = this.list.splice(start, deleteCount);
        }
        // reindex after list has been altered
        this.reindex();
        return result;
    };
    /**
     * Look up a number of array positions from an index of choice
     * @param index The name of the index to use
     * @param elem The element of T to look up from the index
     */
    DictionArray.prototype.lookupByElement = function (index, elem) {
        if (!(index in this.indizesFunctions)) {
            return [];
        }
        // extract index qualifier
        var qualifier = this.indizesFunctions[index](elem);
        return this.lookup(index, qualifier);
    };
    /**
     * Look up a number of array positions from an index of choice
     * @param index The name of the index
     * @param qualifier The qualifier key within the index
     */
    DictionArray.prototype.lookup = function (index, qualifier) {
        // validate existance of index
        if (!(index in this.index)) {
            console.log(index + " not in " + this.index);
            return [];
        }
        // nullcheck of index
        if (!this.index[index]) {
            return [];
        }
        // return value from index via name and qualifier
        return this.index[index][qualifier];
    };
    /**
     * Returns the size of the index
     */
    DictionArray.prototype.numIndizes = function () {
        return Object.keys(this.index).length;
    };
    DictionArray.prototype.reindex = function () {
        this.resetIndex();
        // loop all items in the list to update the indizes
        for (var i = 0; i < this.list.length; i++) {
            var obj = this.list[i];
            if (obj) {
                // run all index functions
                for (var _i = 0, _a = Object.keys(this.indizesFunctions); _i < _a.length; _i++) {
                    var indexName = _a[_i];
                    // extracts a index value from object e.g. the id value
                    var qualifier = this.indizesFunctions[indexName](obj);
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
    };
    //#endregion
    //#region "Private Methods"
    DictionArray.prototype.resetIndex = function () {
        for (var _i = 0, _a = Object.keys(this.indizesFunctions); _i < _a.length; _i++) {
            var indexName = _a[_i];
            this.index[indexName] = {};
        }
    };
    return DictionArray;
}());
exports.default = DictionArray;
