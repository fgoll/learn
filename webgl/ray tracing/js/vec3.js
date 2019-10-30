class vec3 {

  constructor(e0, e1, e2) {
    this._e = [e0, e1, e2]
  }

  x() { return this._e[0] }
  y() { return this._e[1] }
  z() { return this._e[2] }
  r() { return this._e[0] }
  g() { return this._e[1] }
  b() { return this._e[2] }

  get(i) { return this._e[i] }
  positive() { return this }
  negative() { return new vec3(-this._e[0], -this._e[1], -this._e[2]) }

  add(v) {
    this._e[0] += v._e[0]
    this._e[1] += v._e[1]
    this._e[2] += v._e[2]
    return this
  }

  minus(v) {
    this._e[0] -= v._e[0]
    this._e[1] -= v._e[1]
    this._e[2] -= v._e[2]
    return this
  }

  multiply(v) {
    if (typeof v === 'number') {
      this._e[0] *= v
      this._e[1] *= v
      this._e[2] *= v
    }else {
      this._e[0] *= v._e[0]
      this._e[1] *= v._e[1]
      this._e[2] *= v._e[2]
    }
    return this
  } 

  divide(v) {
    if (typeof v === 'number') {
      this._e[0] /= v
      this._e[1] /= v
      this._e[2] /= v
    }else {
      this._e[0] /= v._e[0]
      this._e[1] /= v._e[1]
      this._e[2] /= v._e[2]
    }
    return this
  }

  length() {
    return Math.sqrt(this._e[0] * this._e[0] + this._e[1] * this._e[1] + this._e[2] * this._e[2])
  }

  squared_length() {
    return this._e[0] * this._e[0] + this._e[1] * this._e[1] + this._e[2] * this._e[2]
  }

  make_unit_vector() {
    let k = 1.0 / this.length()
    this._e[0] *= k
    this._e[1] *= k
    this._e[2] *= k
  }

  copy() {
    return new vec3(this.get(0), this.get(1), this.get(2))
  }
}

function unit_vector(v) {
  console.log(v)
  return v.divide(v.length())
}

module.exports = {
  vec3,
  unit_vector,
}