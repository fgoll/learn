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
    let _A = this._A.copy()
    let _B = this._B.copy()

    return _A.add(_B.multiply(t))
  }
}

module.exports = ray