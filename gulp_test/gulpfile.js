//引入gulp模块
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
const open = require("open");

//定义默认任务
/*
gulp.task('jshint', function () {
  // 将你的任务的任务代码放在这
  return gulp.src('./src/js/!*.js') // 将指定目录下的文件以数据流的方式导入到gulp内存中
    .pipe(jshint({esversion: 6}))  // 检查js语法错误
    .pipe(jshint.reporter('default')); // 使用默认的错误提示
});

gulp.task('babel', ['jshint'], function () { // 中间数组作用：先执行数组中的任务，再执行本身得任务
  return gulp.src('./src/js/!*.js')
    .pipe(babel({ // 语法转换 es6->es5
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build/js')) // 将gulp内存中的数据流输出指定目录下
});

gulp.task('concat', ['babel'], function () {
  return gulp.src(['./build/js/module1.js', './build/js/module2.js'])
    .pipe(concat('built.js'))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('uglify', ['concat'], function () {
  return gulp.src('./build/js/built.js')
    .pipe(uglify())  // 压缩js代码
    .pipe(rename('built-min.js')) // 重命名js文件
    .pipe(gulp.dest('./dist/js/'))
});
*/

// 检查语法错误 -- 进行语法转换 -- 合并js文件 -- 压缩js文件
gulp.task('minifyjs', function () {
  return gulp.src('./src/js/*.js') // 将指定目录下的文件以数据流的方式导入到gulp内存中
    .pipe(jshint({esversion: 6}))  // 检查js语法错误
    .pipe(jshint.reporter('default')) // 使用默认的错误提示
    .pipe(babel({ // 语法转换 es6->es5
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build/js')) // 将gulp内存中的数据流输出指定目录下
    .pipe(concat('built.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(uglify())  // 压缩js代码
    .pipe(rename('dist.min.js')) // 重命名js文件
    .pipe(gulp.dest('./dist/js/'))
    .pipe(livereload())
});

gulp.task('minifycss', function () {
  return gulp.src('src/less/*.less')
    .pipe(less({  // 将less文件编译成css文件
      plugins: [autoprefix]  // 增加前缀
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(concat('built.css')) // 合并css
    .pipe(gulp.dest('build/css'))
    .pipe(cssmin())
    .pipe(rename('dist.min.css'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(livereload())
});

gulp.task('minifyhtml', function () {
  return gulp.src('src/index.html')
    .pipe(htmlmin({
      removeComments: true, // 去除注释
      collapseWhitespace: true  // 去除空格
    }))
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
});

gulp.task('watch', ['default'], function () {
  livereload.listen();
  // 配置热更新/热加载
  connect.server({
    root: 'dist',  // 访问的目录
    livereload: true,
    port: 3000
  });
  // 打开网页
  open("http://localhost:3000");
  // 配置监视任务
  gulp.watch('./src/js/*.js', ['minifyjs']);
  gulp.watch('./src/less/*.less', ['minifycss']);
  gulp.watch('./src/index.html', ['minifyhtml']);
});

gulp.task('default', ['minifyjs', 'minifycss', 'minifyhtml']); //异步执行