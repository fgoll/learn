// css-loader 的作用是处理css中的 @import 和 url 这样的外部资源

// 为什么要有css-loader?
// 1. style-loader 中调用了 require 去加载css文件，如果我们不用一个 css-loader，那么这里会直接报错 “没有css文件对应的loader"
// 2. style-loader 只负责插入CSS，那么CSS中的 @import 和 url 语句还是需要 css-loader 去解析的

// 1. 调用 postcss 对 css 源码进行解析，然后遍历其中的 declaration 并抽离出 url 和 import 这两种依赖
// 2. 调用 postcss，根据它已经分析出的 url 和 import 依赖关系，在对应的代码中替换成 require，并拼接成段最终的JS返回
// 3. 另外，modules 等也是在 css-loader 上实现的


var postcss = require("postcss");
var loaderUtils = require("loader-utils");
var Tokenizer = require("css-selector-tokenizer");
var icssUtils = require('icss-utils');
var localByDefault = require("postcss-modules-local-by-default");
var modulesScope = require("postcss-modules-scope");


var parserPlugin = postcss.plugin("css-loader-parser", function(options) {
  return function(css) {
    var importItems = [];
    var urlItems = [];

    // 收集 import 依赖
    css.walkAtRules(/^import$/i, function(rule) {
      // console.log(rule)
      var values  = Tokenizer.parseValues(rule.params);
      // console.log(values)
      var url = values.nodes[0].nodes[0];
      // console.log(url)
      if (url && url.type === 'url') {
        url = url.url;
      } else if (url && url.type === 'string') {
        url = url.value;
      }
      importItems.push({
        url: url
      });
    });

    // 处理每一条样式声明
    function processNode(item) {
      switch (item.type) {
        case "value":
          item.nodes.forEach(processNode);
          break;
        case "nested-item":
          item.nodes.forEach(processNode);
          break;
        case "url":
          if (loaderUtils.isUrlRequest(item.url)) {
            var url = item.url;
            item.url = "___CSS_LOADER_URL___" + urlItems.length + "___";
            urlItems.push({
              url: url
            })
          }
          break;
      }
    }

    var icss = icssUtils.extractICSS(css);
    exports = icss.icssExports;

    // 遍历所有的样式声明，比如 `color: red` 就是一个 decl
    css.walkDecls(function (decl) {
      // console.log(decl)
      var values = Tokenizer.parseValues(decl.value);
      // console.log(values)
      values.nodes.forEach(function (value) {
        // console.log(value)
        value.nodes.forEach(processNode)
      });
      decl.value = Tokenizer.stringifyValues(values);
    })

    options.importItems = importItems;
    options.urlItems = urlItems;
    options.exports = exports;
  };
})

module.exports = function(inputSource) {
  if (this.cacheable) this.cacheable();
  var callback = this.async();
  var options = {
    model: 'local'
  }
  var pipeline = postcss([
    localByDefault({mode: options.model}), 
    modulesScope(),
    parserPlugin(options)
  ])

  pipeline.process(inputSource).then(function (result) {
    var alreadyImported = {};
    var importJs = options.importItems.filter(function(imp) {
      if (alreadyImported[imp.url]) return false;
      alreadyImported[imp.url] = true
      return true;
    }).map(function(imp) {
      return "exports.i(require(" + loaderUtils.stringifyRequest(this, imp.url) + "))";
    }, this);

    var cssAsString = JSON.stringify(result.css);

    var URLREG_G = /___CSS_LOADER_URL___(\d+)___/g;
    var URLREG = /___CSS_LOADER_URL___(\d+)___/;

    cssAsString = cssAsString.replace(URLREG_G, function(item) {
      var match = URLREG.exec(item);
      if (!match) return item;

      const url = options.urlItems[+match[1]].url;
      return '" + require(' + url + '") + "';
    })

    var moduleJs = "exports.push([module.id, " + cssAsString + ",\"\"])";

    callback(null, [
      'exports = module.exports = require(' + loaderUtils.stringifyRequest(this, require.resolve("./css-base.js")) + ")();\n",
      importJs.join(''),
      moduleJs,
      'exports.locals = ' + JSON.stringify(options.exports) 
    ].join("\n"))
  })
}