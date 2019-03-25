const path = require('path')
const glob = require('glob')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const purifyCSSPlugin = require('purifycss-webpack')

if (process.env.type === 'build') {
  var website = {
    publicPath: "http://developerjh.com/"
  }
}else {
  var website = {
    publicPath: "http://127.0.0.1:1717/"
  }
}


// ========>  标准模板
// module.exports = {
//   //入口文件的配置项
//   entry: {},
//   //出口文件的配置项
//   output: {},
//   //模块：例如解读CSS,图片如何转换，压缩
//   module: {},
//   //插件，用于生产模版和各项功能
//   plugins: [],
//   //配置webpack开发服务功能
//   devServer: {}
// }


// ========>  入口和出口配置
// module.exports = {
//   // 入口文件的配置项
//   entry: {
//     entry: './src/entry.js',
//   },
//   // 出口文件的配置项 
//   output: {
//     // 输出的路径
//     path:path.resolve(__dirname,'dist'),
//     //输出的文件名称
//     filename:'bundle.js'
//   },
//   // 模块：例如解读CSS,图片如何转换，压缩
//   module: {},
//   //插件，用于生产模版和各项功能
//   plugins: [],
//   //配置webpack开发服务功能
//   devServer: {}
// }

// ========>  多入口和多出口配置
// module.exports = {
//   // 入口文件的配置项
//   entry: {
//     entry: './src/entry.js',
//     entry2: './src/entry2.js'
//   },
//   // 出口文件的配置项 
//   output: {
//     // 输出的路径
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name].js'
//   },
//   // 模块：例如解读CSS,图片如何转换，压缩
//   module: {},
//   //插件，用于生产模版和各项功能
//   plugins: [],
//   //配置webpack开发服务功能
//   devServer: {}
// }

// ========>  服务和热更新
module.exports = {
  // 入口文件的配置项
  entry: {
    entry: './src/entry.js',
    entry2: './src/entry2.js'
  },
  // 出口文件的配置项 
  output: {
    // 输出的路径
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  // 模块：例如解读CSS,图片如何转换，压缩
  module: {
    rules: [
      // 将css打包到js
      //   {
      //   test: /\.css$/,
      //   // 写法一
      //   // use: ['style-loader', 'css-loader']
      //   // 写法二
      //   // loader: ['style-loader', 'css-loader'],
      //   // 写法三
      //   use: [{
      //     loader: "style-loader"
      //   }, {
      //     loader: "css-loader"
      //   }]
      // },
      // css分离
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1 //当css文件中又有引入了其他的css的时候，需要设置一下importLoaders 
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000,
            outputPath: 'images/'
          }
        }]
      }
    ]
  },
  // 插件，用于生产模版和各项功能
  plugins: [
    // 打包html文件
    new htmlPlugin({
      // 压缩
      minify: {
        // 掉属性的双引号
        removeAttributeQuotes: true
      },
      // 有效避免缓存JS
      hash: true,
      // 要打包的html模板路径和文件名称
      template: './src/index.html'
    }),
    // css分离
    new extractTextPlugin("css/index.css"),
    //消除未使用的css
    new purifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))      
    })
  ],
  // 配置webpack开发服务功能
  devServer: {
    //设置基本目录结构
    contentBase: path.resolve(__dirname, 'dist'),
    // 服务器的IP地址, 可以使用IP也可以使用localhost
    host: 'localhost',
    // 服务端压缩是否开启
    compress: true,
    // 配置服务端口号
    port: 1717
  }
}