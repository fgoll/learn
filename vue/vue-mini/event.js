var EventEmitter = function() {
  this._events = {}
}

EventEmitter.prototype.on = function(event, cb) {
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i ++) {
      this.on(event[i], cb)
    }
  } else {
    (this._events[event] || (this._events[event] = [])).push(cb)
  }

  return this
}

EventEmitter.prototype.off = function(event, cb) {
  if (!arguments.length) {
    this._events = Object.create(null)
    return this
  }

  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i ++) {
      this.off(event[i], cb)
    }
    return this
  }

  if (!cb) {
    this._events[event] = null
    return this
  }

  if (cb) {
    let cbs = this._events[event]
    let i = cbs.length

    while (i --) {
      if (cb === cbs[i] || cb === cbs[i].fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return this
  }
}

EventEmitter.prototype.emit = function(event) {
  let cbs = this._events[event]

  let args = Array.prototype.slice.call(arguments, 1)

  if (cbs) {
    for (let i = 0, l = cbs.length; i < l; i ++) {
      cbs[i].apply(this, args)
    }
  }

  return this
}

EventEmitter.prototype.once = function(event, cb) {
  function on() {
    this.off(event, cb)
    cb.apply(this, arguments)
  }
  on.fn = cb
  this.on(event, on)
  return this
}