/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-01-13 13:51:08
 * @title       title
 * @description description
 */
'use strict';
const
  debug = require('debug')('F:app'),
  colors = require('colors'),

  server = require('./server/index.js'),

  config = require('./config.js')();

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

server.start(config);
// server.initCache();

// server.initGlobal();

// server.start();

// server.connectDb();

// server.errHandle(function(err) {
//     _log(err);
// });
