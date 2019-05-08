export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm

    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    window.target = undefined
    return value
  }
}

const bailRE = /[^\w.$]/
export function parsePath(path) {
  if (bailRE.test(path)) {
    return 
  }

  const segments = path.split(".")

  return function(obj) {
    for (let i = 0; i < segments.length; i ++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}