// url-loader 并不是复制文件，而是把文件做base64编码，直接嵌入到CSS/JS/HTML代码中。

// 工作流程
//    1. 获取 limit 参数
//    2. 如果 文件大小在 limit 之类，则直接返回文件的 base64 编码后内容
//    3. 如果超过了 limit ，则调用 file-loader

var loaderUtils = require('loader-utils')
var mime = require("mime-types")

module.exports = function(content) {
  
  const options = loaderUtils.getOptions(this) || {};

  let limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit);

  if (limit) {
    limit = parseInt(limit, 10);
  }

  const mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath);

  if(!limit || content.length < limit) {
    if(typeof content === "string") {
      content = new Buffer(content);
    }

    // 直接返回 base64 编码的内容
    return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
  }

  const fallback = options.fallback || "file-loader";

  const fallbackLoader = require(fallback);

  return fallbackLoader.call(this, content);
}

module.exports.raw = true;