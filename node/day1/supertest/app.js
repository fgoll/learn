var express = require('express');

var fibonacci = function (n) {
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('n should be a Number');
  }

  if (n < 0) {
    throw new Error('n should >= 0');
  }

  if (n === 0) return 0;

  var res = [1, 1]
  for (var i = 2; i < n; i ++) {
    res[i] = res[i-1] + res[i-2];
  }
  return res[n-1]
}

var app = express();

app.get('/fib', function(req, res) {
  // http 传来的东西默认都是没有类型的，都是 String，所以我们要手动转换类型
  var n = Number(req.query.n);
  try {
    // 如果你直接给个数字给 res.send 的话，
    // 它会当成是你给了它一个 http 状态码，所以我们明确给 String
    res.send(String(fibonacci(n)));
  }catch(e) {
    // 如果 fibonacci 抛错的话，错误信息会记录在 err 对象的 .message 属性中。
    // 拓展阅读：https://www.joyent.com/developers/node/design/errors
    res.status(500).send(e.message);
  }
})

module.exports = app;

app.listen(3000, function() {
  console.log('app is listening at port 3000')
})