var app = require('../app');
var supertest = require('supertest');

var request = supertest(app);

var should = require('should');

describe('test/app.test.js', function() {
  it('should return 55 when n is 10', function(done) {
    // .query 方法用来传 querystring，.send 方法用来传 body。
    // 它们都可以传 Object 对象进去。
    // 在这里，我们等于访问的是 /fib?n=10
    request.get('/fib').query({n : 10}).end(function(err, res) {
      should.not.exist(err);
      res.text.should.equal('55');
      done();
    })
  });

  var testFib = function(n, statusCode, expect, done) {
    request.get('/fib').query({n: n}).expect(statusCode).end(function(err, res) {
      res.text.should.equal(expect);
      done(err);
    })
  }

  it('should return 0 when n === 0', function(done) {
    testFib(0, 200, '0', done);
  })

  it('should equal 1 when n === 1', function(done) {
    testFib(1, 200, '1', done);
  })

  it('should throw when n < 0', function(done) {
    testFib(-1, 500, 'n should >= 0', done);
  })

  it('should throw when n is not Number', function(done) {
    testFib('good', 500, 'n should be a Number', done);
  })

 
})
