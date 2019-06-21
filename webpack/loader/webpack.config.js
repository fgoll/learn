const path = require('path')
module.exports = {
  mode:"production",
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules'
      }
    ]
  },

  resolveLoader: {
    alias: {
      "babel-loader": path.resolve('./my-loaders/babel-loader.js'),
      'style-loader': path.resolve('./my-loaders/style-loader'),
      'css-loader': path.resolve('./my-loaders/css-loader')
    }
  },

  devServer:{//设置webpack本地服务器的配置
    contentBase:'./dist',//默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器
    port:'8383',//监听端口
    inline:true,//设置为true，当源文件改变的时候会自动刷新
    historyApiFallback:true,//在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    hot:true//允许热加载
  }
}