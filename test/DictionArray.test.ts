import { expect } from "chai";
import DictionArray from "../src/DictionArray";

type TestType = { id: number; name: string; depend?: boolean };

describe("DictionArray", () => {
	it("should instantiate like an array", () => {
		const a = new DictionArray<string>();

		expect(typeof a).to.equal("object");
	});

	it("should push a value", () => {
		const a = new DictionArray<string>();
		a.push("hi");

		expect(a.count()).to.equal(1);
	});

	it("should push multiple values", () => {
		const a = new DictionArray<string>();
		a.push(...["hi", "there", "you!"]);

		expect(a.count()).to.equal(3);
	});

	it("should set the initial values of the structure", () => {
		const a = new DictionArray<string>();
		a.set(["Is", "there", "anybody", "out", "there?"]);

		expect(a.count()).to.equal(5);
	});

	it("should instantiate with an optional id extraction lambda", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		expect(typeof a).to.equal("object");
	});

	it("should push an object and track an identifier index", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 123,
			name: "test"
		});

		expect(a.get(0).id).to.equal(123);
		expect(a.numIndizes()).to.equal(1);
	});

	it("should clear the values", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 2,
			name: "test"
		});

		expect(a.count()).to.equal(1);
		expect(a.numIndizes()).to.equal(1);

		a.clear();

		expect(a.count()).to.equal(0);
		expect(a.numIndizes()).to.equal(1);
	});

	it("should map the values of the list", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 2,
			name: "test"
		});

		a.push({
			id: 3,
			name: "test2"
		});

		a.push({
			id: 4,
			name: "test4"
		});

		const result = a.map((item) => {
			return {
				test: item.name
			};
		});

		expect(result.length).to.equal(a.count());
		expect(result[0].test).to.equal(a.get(0).name);
	});

	it("should filter out specific items from the list", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 2,
			name: "test"
		});

		a.push({
			id: 3,
			name: "test2"
		});

		a.push({
			id: 4,
			name: "test4"
		});

		const result = a.filter((item: TestType) => {
			return item.id === 2;
		});

		expect(result.length).to.equal(1);
		expect(result[0].id).to.equal(2);
	});

	it("should remove a single element", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 2,
			name: "test"
		});

		a.push({
			id: 3,
			name: "test2"
		});

		a.push({
			id: 4,
			name: "test4"
		});

		const countBefore = a.count();

		a.splice(1, 1);

		const countAfter = a.count();

		expect(countAfter).to.equal(countBefore - 1);
		expect(a.get(0).id).to.equal(2);
	});

	it("should remove a single element but add two new", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 2,
			name: "test"
		});

		a.push({
			id: 3,
			name: "test2"
		});

		a.push({
			id: 4,
			name: "test4"
		});

		const countBefore = a.count();

		const newItem1 = { id: 5, name: "test5" };
		const newItem2 = { id: 6, name: "test6" };

		a.splice(1, 1, [newItem1, newItem2]);

		const countAfter = a.count();

		expect(countAfter).to.equal(countBefore + 1);

		expect(a.get(0).id).to.equal(2);
	});

	it("should find the position of an element within the index", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		a.push({
			id: 2,
			name: "test"
		});

		a.push({
			id: 3,
			name: "test2"
		});

		a.push({
			id: 4,
			name: "test4"
		});

		const positions: number[] = a.lookupByElement("id", {
			id: 4,
			name: "test4"
		});

		expect(positions.length).to.equal(1);
		expect(positions[0]).to.equal(2);
	});

	it("should NOT find a position, since the element is not in the index", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			}
		});

		const positions: number[] = a.lookupByElement("id", {
			id: 4,
			name: "test4"
		});

		expect(positions.length).to.equal(0);
	});

	it("should NOT find a position, since no identifier extraction lambda is given", () => {
		const a = new DictionArray<TestType>();

		const result = a.lookupByElement("id", {
			id: 4,
			name: "test4"
		});

		expect(result.length).to.equal(0);
	});

	it("should find the position of an element within a second index", () => {
		const a = new DictionArray<TestType>({
			id: (obj) => {
				return obj.id.toString();
			},
			depend: (obj) => {
				return obj.depend.toString();
			}
		});

		a.push({
			id: 2,
			name: "test",
			depend: true
		});

		a.push({
			id: 3,
			name: "test2",
			depend: false
		});

		a.push({
			id: 4,
			name: "test4",
			depend: true
		});

		const positions: number[] = a.lookup("depend", true.toString());

		expect(positions.length).to.equal(2);
		expect(positions[0]).to.equal(0);
		expect(positions[1]).to.equal(2);
	});
});
