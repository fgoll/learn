1. 在src下创建**npm/index.js**来引入使用npm install 下载的包

2. 使用webpack来打包**npm/index.js**并使用`output.libraryTarget: "commonjs2"`来保证打包出来的js是模块化的. 之后便可以直接在小程序js中直接引入打包出来的js.
3. 可以使用gulp将webpack打包**npm/index.js**这项任务加入到构建流程中.


