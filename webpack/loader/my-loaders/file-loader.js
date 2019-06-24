// file-loader 并不会对文件内容进行任何转换，只是复制一份文件内容，并根据配置为他生成一个唯一的文件名。

// 工作流程:
//    1. 通过 loaderUtils.interpolateName 方法可以根据 options.name 以及文件内容生成一个唯一的文件名 url（一般配置都会带上hash，否则很可能由于文件重名而冲突）
//    2. 通过 this.emitFile(url, content) 告诉 webpack 我需要创建一个文件，webpack会根据参数创建对应的文件，放在 public path 目录下。
//    3. 返回 'module.exports = __webpack_public_path__ + '+ JSON.stringify(url) + ‘;’ ，这样就会把原来的文件路径替换为编译后的路径

var loaderUtils = require('loader-utils');

module.exports = function(content) {

  // 获取 webpack 中对 file-loader 的配置
  const options = loaderUtils.getOptions(this) || {};

  // 这是 loaderUtils 的一个方法，可以根据 name 配置和 content 内容 生成一个文件名。
  // 为什么需要 文件内容呢？这是为了保证当文件内容没有发生变化的时候，名字中的 [hash] 字段也不会变。可以理解为用文件的内容作了一个hash
  const url = loaderUtils.interpolateName(this, options.name, {
    content
  });

  // 告诉webpack，我要创建一个文件，文件名和内容，这样webpack就会帮你在 dist 目录下创建一个对应的文件
  this.emitFile(url, content);

  // __webpack_public_path__: webpack提供的全局变量，是public的根路径
  return 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url);

}

// 默认情况下 webpack 会把文件内容当做UTF8字符串处理，而我们的文件是二进制的，当做UTF8会导致图片格式错误
// 所以需要指定webpack用 raw-loader 来加载文件的内容，而不是当做 UTF8 字符串传给我们
// 参见： https://webpack.js.org/loaders/raw-loader
module.exports.raw = true