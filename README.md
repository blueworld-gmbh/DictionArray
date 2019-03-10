<h1 align="center">📒 DictionArray</h1>
<p align="center">An indexed array for fast data access</p>

## Installation

Simply install the module via NPM:

`npm i @blueworld/dictionarray -S`

## Usage

Import the TypeScript module into your project files:

```typescript
import DictionArray from "@blueworld/dictionarray";
```

### Constructor

The constructor of the generic _DictionArray_ class receives a type and an object of index functions that we want to build up.

Let's consider the following example:

```typescript
interface Test {
	id: number;
	text: string;
}

const d = new DictionArray<Test>({
	identifier: (elem: Test) => {
		return elem.id.toString();
	}
});
```

We instantiate a new _DictionArray_ of type `Test`. We also specify an index with the name `identifier`. The index function extracts the property `id` of the element of type `Test`. Everytime a new element is added or removed to and from the _DictionArray_, the index for `identifier` is updated by running the index function across all elements of the _DictionArray_.

**Note:** The index function only accepts strings as return values. If you want your numeric `id` property to be indexed, you have to cast it into a string first, as seen in the example above.
This is due to the fact that the extracted property per element of object `T` will become a key in an ECMAScript object internally.

### push(...item: T[]): number

The push method works analogous to the standard ECMAScript [Array.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method. It takes n-many objects of type `T` and returns the new length of the array.

Example:

```typescript
d.push({
	id: 123,
	text: "Test"
});
```

**Triggers reindex**: ✅

### lookup(index: string, qualifier: string): number[]

This is where the magic of the _DictionArray_ happens. We can push objects onto the array-part of the _DictionArray_, but what if we want to find a single element in the data structure without looping the whole array? Glad you're asking! Since we declared an index of name `identifier` in the Constructor-section above, we can use this index to lookup elements O(1) runtime.

```typescript
const pos: number[] = d.lookup("identifier", "123");
```

The contant `pos` will now contain the positions of the objects of type `T` with the _identifier_ of value `123` within the dictionarray.

**Triggers reindex**: ❌

### get(index: number): T

To read an object at a certain position within the _DictionArray_, use the `get()` method.

Example:

```typescript
const obj: Test = d.get(0);
```

Will return the first object within the _DictionArray_.

**Triggers reindex**: ❌

### count(): number

`count()` returns the length of the array within the _DictionArray_.

Example:

```typescript
const length: number = d.count();
```

**Triggers reindex**: ❌

### all(): T[]

The retrieve all elements of the _DictionArray_ in array form, use the `all()` function:

```typescript
const elements: Test[] = d.all();
```

**Triggers reindex**: ❌

### clear(): void

To remove all elements from the _DictionArray_ use the `clear()` method:

```typescript
d.clear();
```

**Triggers reindex**: ❌ (well, the index is completely cleared)

### map(callbackFn: (item: T, index: number) => any): any[]

Proxy function for the `map()` function of the underlaying array within the _DictionArray_.

Example:

```typescript
const result = d.map((item) => {
	return item.text;
});
```

**Triggers reindex**: ❌

### filter(callbackFn: (item: T, index?: number) => boolean): T[]

Proxy function for the `filter()` function of the underlaying array within the _DictionArray_.

Example:

```typescript
const result: Test[] = d.filter((item) => {
	return item.text.length > 2;
});
```

**Triggers reindex**: ❌

### splice(start: number, deleteCount: number, items?: T[]): T[]

The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements.

Works analogous to the ECMAScript [splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) function.

Example:

```typescript
d.splice(0, 1);
```

This removes the first item from the array.

**Triggers reindex**: ✅
