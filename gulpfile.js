'use strict';

var _ = require('lodash'),
  argv = require('yargs').argv,
  babelify = require('babelify'),
  beautify = require('gulp-jsbeautifier'),
  browserify = require('browserify'),
  config = require('./package.json'),
  eslint = require('gulp-eslint'),
  filter = require('gulp-filter'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  header = require('gulp-header'),
  mocha = require('gulp-mocha'),
  source = require('vinyl-source-stream'),
  shell = require('shelljs');


gulp.task('default', ['lint-and-beautify']);

// Task: drop-component
// This task copies the non-dev dependencies as well as the source required
// to run the application.
gulp.task('drop-component', function () {
  var jsFilter,
    jsHeader,
    jsHeaderText;

  jsHeaderText = helper.jsFileHeader;
  jsHeader = header(jsHeaderText);
  jsFilter = filter(['**/*.js'], {
    restore: true
  });

  return gulp
    .src(['**/*.+(js|json|sql|yml)',
      '!doc/**/*',
      '!gulpfile.js',
      '!node_modules/**/*',
      '!test/**/*',
      '!xtra/**/*'
    ])
    .pipe(jsFilter)
    //.pipe(jsHeader)
    .pipe(jsFilter.restore)
    .pipe(gulp.dest('.'));
});


// Task: lint-and-beautify
// Performs in-place linting & beautification of the *src* files. We perform
// this in-place so that the checked in code is clean and consistent.
gulp.task('lint-and-beautify', function () {
  // Beautify Config: src/.jsbeautifyrc
  // Linting Config: src/.estlintrc
  return gulp
    .src(['**/*.js',
      '!doc/**/*',
      '!coverage/**/*',
      '!node_modules/**/*.js',
      '!xtra/**/*'
    ])
    .pipe(beautify({
      config: '.jsbeautifyrc',
      mode: argv['fail-on-beautify'] ? 'VERIFY_ONLY' : 'VERIFY_AND_WRITE'
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('.'));
});


// Task: watch
// When any file that is being watched changes, the build directory
// is cleaned and everything is rebuilt. If we only ran the rebuild
// task associated with the changed files, the output would still
// be cleaned, and we would be left with an incomplete build output.
gulp.task('watch', function watch() {
  gulp.watch(['server.js', 'app/**/*.js', 'test/**/*.js'], () => {
    return gulp.src('test/**/*.js', {
        read: false
      })
      .pipe(mocha({
        reporter: 'nyan'
      }));
  });
});
