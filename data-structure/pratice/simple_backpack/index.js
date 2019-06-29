
var maxLoad = 15;
var loads = [5, 6, 2, 1, 9, 3, 5]
var prices = [4, 2, 5, 3, 2, 6, 7]

function max() {
  
  let worths = []
  for (let i = 0; i < loads.length; i ++) {
    worths.push({
      i: i,
      worth: prices[i] / loads[i],
    })
  }

  let val = 0

  worths.sort((a, b) => b.worth - a.worth)

  for (let i = 0; i < worths.length; i ++) {
    let index = worths[i].i
    let price = prices[index]
    let load = loads[index]
    if (maxLoad <= 0) break
    if (load <= maxLoad) {
      val += price
      maxLoad -= load
    }
  }

  return val
}

console.log(max())