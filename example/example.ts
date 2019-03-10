import DictionArray from "../dist/DictionArray";

interface Test {
	id: number;
	text: string;
}

const d = new DictionArray<Test>({
	id: (elem: Test) => {
		return elem.id.toString();
	}
});

d.push({
	id: 123,
	text: "Test"
});

d.push({
	id: 321,
	text: "Test2"
});

console.log(d.all());

console.log(d.lookup("id", "123"));
