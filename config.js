/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-01-13 13:57:40
 * @title       title
 * @description description
 */
'use strict';
const path = require('path');

module.exports = function ( root ) {
  root || (root = __dirname);
  return {
    mongodb: 'mongodb://localhost:27017/test',
    // model: path.join(root, 'model'),
    // view: path.join(root, 'view'),
    // controller: path.join(root, 'controller'),
    // mainpath: path.join(root, 'server'),
    // secret: '1234!@#$',
    root: root,
    // disqus_shortname: 'disqus',
    port: 2018,
    viewDirectory: 'views',
    staticDirectoryForDev: 'client',
    staticDirectoryForProduction: 'dist',
    webpackPublicPathForDev: 'dev/',
    webpackPublicPathForProduction: 'dist/'
  }
}
