module.exports = class hitable_list {
  constructor(l) {
    this.list = l
  }

   hit(r, t_min, t_max, rec = {}) {
    let temp_rec = {}
    let hit_anything = false
    let closest_so_far = t_max
    for (let i = 0; i < this.list.length; i ++) {
      if (this.list[i].hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true
        closest_so_far = temp_rec.t
        Object.assign(rec, temp_rec)
      }
    }
    return hit_anything
   }
}
