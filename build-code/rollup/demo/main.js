import mul from './mul'
import {add, add} from './opr'

export  default function foo() {}
export default foo
export default 42

export { foo as foo1, bar, baz }
export var foo = 42
export function foo() {}
export { foo } from './foo'

console.log(mul(8, 9))