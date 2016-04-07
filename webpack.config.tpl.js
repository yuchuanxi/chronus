/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-01-13 16:46:56
 * @title       title
 * @description description
 */
'use strict';
const
  path = require('path'),
  fs = require('fs'),

  debug = require('debug')('F:webpack.config'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  DedupePlugin = webpack.optimize.DedupePlugin,
  UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
  CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
  OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin,

  config = require('./config.js')(),
  // [Easy dependency injection for node.js unit testing](https://github.com/jhnns/rewire-webpack)
  // RewirePlugin = require("rewire-webpack"),

  srcDir = path.resolve(process.cwd(), config.staticDirectoryForDev), // 前端源代码
  viewDir = path.resolve(process.cwd(), config.viewDirectory), // jade 模版文件
  devDir = config.webpackPublicPathForDev, // 开发目录
  buildDir = config.webpackPublicPathForProduction; // 编译目录
  // aliasSourceMap = {
    // 'zepto': 'js/lib/zepto',
    // 'commonCss': 'css/common.css',
    // 'webpackLogo': 'img/webpack.png'
  // };

/**
 * 获取entry文件列表
 * @return {[type]} [description]
 */
function genEntries () {
  const
    jsDir = srcDir,
    names = fs.readdirSync(jsDir);

  let
    map = {};

  names.forEach(function ( name ) {
    const
      m = name.match(/(.+)\.js$/),
      entry = m ? m[1] : '',
      entryPath = entry ? path.resolve(jsDir, name) : '';

    if ( entry ) {
      debug('entry list: '+ entry);
      map[entry] = entryPath;
    }
  });

  return map;
}

function makeConfig ( options ) {
  options || (options = {});
  var
    isDev = options.debug !== undefined ? options.debug : true,
    entries = genEntries(),
    enrtyKeys = Object.keys(entries),
    // chunks = enrtyKeys,
    webpackConfig,

    aliasSourceMap = {

    };

  // 分离第三方库
  entries.vendors = [];
  if ( isDev ) {
    entries.vendors.unshift('webpack-hot-middleware/client?reload=true');
    // entries.index = ['webpack-hot-middleware/client?reload=true', entries.index]
  }

  webpackConfig = {
    entry: entries,
    // 定义了输出文件的位置及名字
    output: {
      // 在debug模式下，__build目录是虚拟的，webpack的dev server存储在内存中
      path: path.resolve(isDev ? devDir : buildDir),
      filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
      chunkFilename: isDev ? '[id].js' : 'chunks/[id].[chunkhash:8].js',
      hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
      publicPath: isDev ? '/'+ devDir : '',
      jsonpFunction: 'TD'
    },

    resolve: {
      root: [srcDir, path.resolve(process.cwd(), './node_modules')],
      alias: aliasSourceMap
      // extensions: ['', '.js', '.css', '.less', '.jade', '.png', '.jpg']
    },
    // resolveLoader: {
    //   root: path.join(__dirname, 'node_modules')
    // },

    module: {
      // noParse: ['jquery', 'backbone', 'underscore'],
      loaders: [
        { test: /\.jade$/, loader: 'jade' },
        { test: /\.css$/, loader: 'style!css' },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract('style', 'css!less')
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
            'image?{bypassOnDebug: true, progressive:true, optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
            // url-loader更好用，小于10KB的图片会自动转成dataUrl，
            // 否则则调用file-loader，参数直接传入
            'url?limit=10000&name=img/[name].[hash:8].[ext]'
          ]
        },
        {
          test: /\.(woff|eot|ttf)$/i,
          loader: 'url?limit=10000&name=fonts/[name].[hash:8].[ext]'
        }
      ],
      preLoaders: [

      ]
    },

    plugins: [
      new CommonsChunkPlugin({
        name: 'vendors',
        filename: isDev ? 'js/common.js' : 'js/common.[hash:8].js',
        // create an async commons chunk
        // 异步共用块 http://webpack.github.io/docs/list-of-plugins.html
        // async: true,
        // minChunks: 1

        // with more entries,
        // this ensures that no other module goes into the vendor chunk.
        minChunks: Infinity
      }),
      // Automatically loaded modules.
      // new webpack.ProvidePlugin({
      //   '$': 'jquery',
      //   '_': 'underscore',
      //   'B': 'backbone'
      // }),
      // new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin( isDev ? '[name].css' : 'css/[name].[contenthash:8].css', {
        // 当allChunks指定为false时，css loader必须指定怎么处理
        // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
        // 第一个参数`notExtractLoader`，一般是使用style-loader
        // @see https://github.com/webpack/extract-text-webpack-plugin
        allChunks: false
      }),
      // Assign the module and chunk ids by occurrence count
      new OccurenceOrderPlugin()
    ],
    recordsPath: path.join(process.cwd(), 'cache', 'webpack.json'),

    devServer: {
      stats: {
        cached: false,
        colors: true
      }
    },

    eslint: {
      emitError: false,
      emitWarning: false,
      failOnWarning: false
    }
  }

  // Use this, if you are writing a library and want to publish it as single file
  if ( options.library ) {
    webpackConfig.output.library = options.library;
    webpackConfig.output.libraryTarget = 'commonjs2';
  }

  if ( isDev ) {
    webpackConfig.output.pathinfo = true;
    // webpackConfig.debug = true;

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
    enrtyKeys.forEach(function ( entryPath ) {

      webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: path.resolve(viewDir, entryPath +'.jade'),
        inject: 'body',
        chunks: ['vendors', entryPath],
        filename: entryPath +'.html'
      }));
    });
  }
  else {
    // 自动生成入口文件，入口js名必须和入口文件名相同
    // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
    enrtyKeys.forEach(function ( entryPath ) {

      webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: path.resolve(viewDir, entryPath +'.jade'),
        // @see https://github.com/kangax/html-minifier
        minify: {
          collapseWhitespace: true,
          removeComments: true
        },
        inject: 'body',
        chunks: ['vendors', entryPath],
        filename: entryPath +'.html'
      }));
    });

    webpackConfig.plugins.push(new DedupePlugin());
    webpackConfig.plugins.push(new UglifyJsPlugin());
  }
  // 它会按引用频度来排序 ID，以便达到减少文件大小的效果。
  // webpackConfig.plugins.push(new OccurenceOrderPlugin());

  return webpackConfig;
}

module.exports = makeConfig;
