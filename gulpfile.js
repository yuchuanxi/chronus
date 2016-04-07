/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2015-12-14 14:13:38
 * @title       title
 * @description description
 */
'use strict';

var
  debug = require('debug')('slily:gulpfile'),
  gulp = require('gulp'),
  webpack = require('webpack'),
  util = require('gulp-util'),
  inject = require('gulp-inject'),
  htmlmin = require('gulp-htmlmin'),
  nodemon = require('gulp-nodemon');

gulp.task('default', function () {
  nodemon({
    // script: 'app/index.js', // 不填会读取package.json的main字段
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
    execMap: {
      // http://stackoverflow.com/questions/23202953/
      // how-to-set-nodemon-cli-config-option-l-to-gulp-nodemon
      js: 'DEBUG=* node'
    }
  })
  .on('restart', function () {
    debug('node restarted!');
  });
});

gulp.task('build', function () {
  var
    webpackConfig = require('./webpack.config.tpl.js')({debug: false});

  webpack(webpackConfig, function ( err, stats ) {
   //
  });
});
