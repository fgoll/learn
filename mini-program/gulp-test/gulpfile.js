const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const webpackConfig = {
  
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  }
};

// 清空 ./dist 目录
gulp.task('clean', () => del(['./dist/**']));

// 打包 npm 依赖
gulp.task('npm', () => {
  gulp.src('./src/npm/*.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./dist/npm'));
});

// 编译 JS 文件
gulp.task('scripts', () => {
  gulp.src(['./src/**/*.js', '!./src/npm/*.js'])
    .pipe(gulp.dest('./dist'));
});

// 待复制的文件，不包含需要编译的文件
var copyPath = [
  "src/**/!(_)*.*",
  "!src/**/*.less",
  "!src/**/*.ts",
  "!src/img/**"
];
// 复制不包含需要编译的文件，和图片的文件
gulp.task("copy", () => {
  return gulp.src(copyPath).pipe(gulp.dest('./dist'));
});

// 开发模式命令
gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'scripts', 'npm')));
