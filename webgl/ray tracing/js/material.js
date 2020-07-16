let ray = require('./ray')
let { vec3, dot, unit_vector } = require('./vec3')

function random_in_unit_sphere() {
  let p 
  do {
    p = new vec3(Math.random(), Math.random(), Math.random())
  } while (p.squared_length() >= 1.0)

  return p;
}

function reflect(v, n) {
  return v.copy().minus(n.copy().multiply(dot(v, n) * 2))
}

class lambertian {
  constructor(a) {
    // 强度衰减改为三元组，分别对应rgb三分量的衰减度，且用参数自由确定
    this.albedo = a;
  }

  scatter(r_in, rec) {
    return {
      scattered: new ray(rec.p, rec.normal.copy().add(random_in_unit_sphere())),
      attenuation: this.albedo,
      res: true
    }
  }
}

class metal {
  constructor(a, f) {
    this.albedo = a;
    if (f < 1 && f >= 0) this.fuzz = f;
    else this.fuzz = 1
  }

  scatter(r_in, rec) {
    let reflected = reflect(unit_vector(r_in.direction()), rec.normal)
    // 镜面模糊其实就是 镜面 + 模糊系数*漫反射
    // 漫反射实现原理是根据随机化s点，所以模糊镜面实现公式即为：
    // 模糊镜面反射 = 镜面反射 + 模糊系数 * 单位球随机点漫反射
    let scattered = new ray(rec.p, reflected.add(random_in_unit_sphere().multiply(this.fuzz)))
    return {
      scattered, 
      attenuation: this.albedo,
      res: (dot(scattered.direction(), rec.normal) > 0)
    }
  }
}

module.exports = {
  lambertian,
  metal
}