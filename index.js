import c from 'kleur';
import * as superjson from 'superjson';
import { uneval, stringify, parse } from 'devalue';
import ARSON from 'arson';
import { createTson, tsonDate, tsonRegExp } from 'tupleson';

const obj = {
	date: new Date(),
	array: [{ foo: 1 }, { bar: 2 }, { baz: 3 }],
	regex: /the quick brown fox/,
	number: 42,
	xss: '</script><script>alert("XSS")</script>'
};

// circular references are not supported by tupleson
// obj.self = obj;

const tson = createTson({
	types: [tsonDate, tsonRegExp]
})

const superjson_serialized = superjson.stringify(obj);
const devalue_unevaled = uneval(obj);
const devalue_stringified = stringify(obj);
const arson_stringified = ARSON.stringify(obj);
const tson_serialized = tson.stringify(obj);

console.log(
	`superjson output: ${c.bold().cyan(superjson_serialized.length)} bytes`
);

console.log(
	`tson output: ${c.bold().cyan(tson_serialized.length)} bytes`
);
// console.log(superjson_serialized);
console.log(
	`devalue.uneval output: ${c.bold().cyan(devalue_unevaled.length)} bytes`
);
// console.log(devalue_unevaled);
console.log(
	`devalue.stringify output: ${c
		.bold()
		.cyan(devalue_stringified.length)} bytes`
);
// console.log(devalue_stringified);
console.log(`arson output: ${c.bold().cyan(arson_stringified.length)} bytes`);
// console.log(arson_stringified);

// const superjson_deserialized = superjson.parse(superjson_serialized);
// const devalue_deserialized = eval(`(${devalue_unevaled})`);

const iterations = 1e6;

function test(fn, label = fn.toString()) {
	const start = Date.now();
	console.log();
	console.log(c.bold(label));
	let i = iterations;
	while (i--) {
		fn();
	}
	console.log(
		`${iterations} iterations in ${c.bold().cyan(Date.now() - start)}ms`
	);
}

// serialization
test(() => superjson.stringify(obj));
test(() => tson.stringify(obj));
test(() => uneval(obj));
test(() => stringify(obj));
test(() => ARSON.stringify(obj));

// deserialization
test(() => superjson.parse(superjson_serialized));
test(() => tson.parse(tson_serialized));
test(() => eval(`(${devalue_unevaled})`));
test(() => ARSON.parse(arson_stringified));
test(() => parse(devalue_stringified));

console.log();
