/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-01-13 14:04:25
 * @title       title
 * @description description
 */
'use strict';
const
  // built-in modules
  path = require('path'),
  // thirdparty modules
  koa = require('koa'),
  debug = require('debug')('F:index'),
  nconf = require('nconf'),
  favicon = require('koa-favicon'),
  koaStatic = require('koa-static'),
  staticCache = require('koa-static-cache'),
  logger = require('koa-logger'),
  // local modules
  router = require('./router.js'),

  app = koa(),

  config = require('../config.js')(),

  isDev = nconf.get('NODE_ENV') !== 'production',
  staticDir = isDev ? config.staticDirectoryForDev : config.staticDirectoryForProduction

  ;

var
  server;

// exports module
exports = module.exports = server = Object.create(app);

server.start = function ( cfg ) {
  this.init(cfg);

  this.loadMiddleware();
};
server.init = function ( cfg ) {
  this.opts = cfg || {};

  this.initCache();
};
server.initCache = function () {

};
server.loadMiddleware = function () {
  const
    port = this.opts.port || 8000,
    opts = this.opts;

  isDev && this.webpackDev();

  this.use(favicon(path.join(opts.root, staticDir +'/favicon.ico')));
  // this.use(koaStatic(path.join(opts.root, staticDir), {
  //   maxAge: isDev ? 0 : 365 * 24 * 60 * 60
  // }));
  this.use(staticCache(path.join(opts.root, staticDir), {
    maxAge: 365 * 24 * 60 * 60
  }));

  opts.log && this.use(logger());

  this.use(router.routes());
  // TODO: ADD MIDDLEWARE

  this.listen(port);
  console.log('Server listening on ' + port);
};

/**
 * 开发环境下，通过webpack动态编译静态资源
 * @return {[type]} [description]
 */
server.webpackDev = function webpackDev () {
  let
    webpack = require('webpack'),
    webpackConf = require('../webpack.config.tpl.js')({debug: true}),
    compiler = webpack(webpackConf),
    webpackDevMiddleware = require('koa-webpack-dev-middleware'),
    webpackHotMiddleware = require('koa-webpack-hot-middleware');

  this.use(webpackDevMiddleware(compiler, {
    contentBase: webpackConf.output.path,
    publicPath: webpackConf.output.publicPath,
    hot: true,
    stats: {
      cached: false,
      colors: true
    }
  }));
  this.use(webpackHotMiddleware(compiler));
}
