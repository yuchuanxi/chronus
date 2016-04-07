/**
 *
 * @authors     yuChuanXi (http://yuchuanxi.com, wangfei.f2e@gmail.com)
 * @date        2016-03-22 13:37:57
 * @title       title
 * @description description
 */

(function ( global ) {
  'use strict';

  var
    queue = [],
    paused = false,
    results;

  function runTest () {
    if ( !paused && queue.length ) {
      queue.shift()();
      if ( !paused ) global.resume();
    }
  }

  global.test = function (name, fn) {

    queue.push(function () {
      results = document.getElementById('test-results');
      results = global.assert(true, name).appendChild(document.createElement('ul'));
      fn();
    });

    runTest();
  };
  global.pause = function () {
    paused = true;
  };
  global.resume = function () {
    paused = false;
    setTimeout(runTest, 1);
  };

  global.assert = function ( value, desc ) {
    var
      li = document.createElement('li');

    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    results.appendChild(li);

    if ( !value ) {
      li.parentNode.parentNode.className = 'fail';
    }

    return li;
  };

  document.body.insertAdjacentHTML('beforeend', '<ul id="test-results"></ul>')

}( window ));
