// comment1
import mul from './mul'
import {add} from './opr'

export  default function foo(a) { console.log(a) }
export default foo
export default 42

// comment2
export { foo as foo1, bar, baz } // comment3

export var foo = 42
export function foo() {}
export { foo } from './foo'

console.log(mul(8, 9))