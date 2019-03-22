// function convert(S, n, base) {
//   let digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
//   while (n > 0) {
//     S.push(digit[n % base]);
//     n = Math.floor( n / base );
//   }
// }

// var S = [];

// convert(S, 10, 2);

// let n = 0
// while(n = S.pop()) {
//   console.log(n);
// }



function convert(n, base) {
  let digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  let S = []
  while (n > 0) {
    S.push(digit[n % base])
    n = Math.floor(n / base)
  }
  return S
}

let S = convert(10, 2)

let n = 0
while(n = S.pop()) {
  console.log(n);
}