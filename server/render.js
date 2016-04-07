/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-01-13 15:37:46
 * @title       title
 * @description description
 */
'use strict';

const
  debug = require('debug')('F:render'),
  coViews = require('co-views');

module.exports = coViews('views', {
  map: {
    html: 'jade'
    // md: 'hogan'
  },
  default: 'jade'
});
