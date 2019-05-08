import Dep from './dep'
import {isObject, hasOwn, def} from './util'
import { arrayMethods } from './array'

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()

    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment

      augment(value, arrayMethods, arrayKeys)

      this.observeArray(value)
    }else {
      this.walk(vlaue)
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i ++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i ++) {
      observe(items[i])
    }
  }
}

export function observe(value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob 
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  }else {
    ob = new Observer(value)
  }
  return ob
}

function defineReactive(data, key, val) {
  if (typeof val === 'object') {
    new Observer(val)
  }
  let childOb = observe(val)
  // let dep = []
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      // dep.push(window.target)
      dep.depend()

      if (childOb) {
        childOb.dep.depend()
      }
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return 
      }
      // for (let i = 0; i < dep.length; i ++) {
      //   dep[i](newVal, val)
      // }
      dep.notify()
      val = newVal
    }
  })
}

function protoAugment(target, src, keys) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i ++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}