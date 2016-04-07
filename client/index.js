/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-01-13 10:34:07
 * @title       title
 * @description description
 */
'use strict';
require('./index.less');

var d = require('../src/chronus-es6.js')();
/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
console.log(d)
window.d = d;

// var
//   jsAaa = document.querySelector('.jsAaa'),
//   start = Date.now(),
//   now,
//   gap = 10;

// document.addEventListener('scroll', function ( e ) {

//   now = Date.now();

//   if ( now - start < gap ) {
//     return;
//   }

//   console.log(jsAaa.getBoundingClientRect())


//   if ( jsAaa.getBoundingClientRect().top <= 0 ) {
//     console.log(111)
//     jsAaa.classList.add('ccc')
//   }
//   else {
//     jsAaa.classList.remove('ccc')
//   }
// });

// var
//  a = 2,
//  b = 3;

// $('body').css({
//   color: 'red',
//   fontSize: '20px'
// })
