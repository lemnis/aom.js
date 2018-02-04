/* eslint-env: node */

const gulp            = require("gulp");
const browserSync     = require("browser-sync");
const browserify      = require("browserify");
const source          = require("vinyl-source-stream");
const babelify        = require("babelify");
const mochaPhantomJS  = require("gulp-mocha-phantomjs");
const gutil           = require('gulp-util');
const gulpJsdoc2md    = require('gulp-jsdoc-to-markdown')
const rename          = require('gulp-rename')

gulp.task("browser-sync", function () {
  browserSync({
    server: {
      //serve tests and the root as base dirs
      baseDir: ["./test/", "./"],
      //make tests.html the index file
      index: "index.html"
    }
  });
});

gulp.task("browserify", function () {
  return browserify("./test/tests.js", { debug: true })
    .transform([babelify,])
      .on("error", function (e) {
        console.log(e.message);
        this.emit("end");
      })
    .bundle()
      .on("error", function (err) {
        console.log(err.toString());
        this.emit("end");
      })
    .pipe(source("tests-browserify.js"))
    .pipe(gulp.dest("test/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("test", ["browserify"], function () {
  return gulp.src("./test/index.html")
    .pipe(mochaPhantomJS());
});

//////////////////////////////
// GENERATING DOCUMENTATION //
//////////////////////////////

gulp.task('docs', function () {
  return gulp.src('src/*.js')
    .pipe(gulpJsdoc2md())
      .on('error', function (err) {
        gutil.log(gutil.colors.red('jsdoc2md failed'), err.message)
      })
      .pipe(rename(function (path) {
        path.extname = '.md'
      }))
      .pipe(gulp.dest('api'))
})

gulp.task("serve", ["browserify", "browser-sync", "docs"], function () {
  //when tests.js changes, browserify code and execute tests
  gulp.watch(["test/tests.js", "src/**/*.js"], ["browserify"]);
  gulp.watch(["src/**/*.js"], ["docs"]);
});