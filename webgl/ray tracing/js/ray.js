class ray {
  constructor(a, b) {
    this._A = a
    this._B = b
  }

  origin() {
    return this._A
  }

  direction() {
    return this._B
  }

  point_at_parameter(t) {
    return this._A + t * this._B
  }
}

module.exports = ray