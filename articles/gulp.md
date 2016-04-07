# gulp


## what is gulp?
gulp是前端开发过程中一种基于流的代码构建工具，是自动化项目的构建利器；她不仅能对网站资源进行优化，而且在开发过程中很多重复的任务能够使用正确的工具自动完成；使用她，不仅可以很愉快的编写代码，而且大大提高我们的工作效率。

gulp是基于Nodejs的自动任务运行器， 她能自动化地完成 javascript、coffee、sass、less、html/image、css 等文件的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。在实现上，她借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单。


## Gulp为什么快
- 使用`orchestrator`任务系统,最大限度的并发运行多个任务.
- 每个`plugin`只做一件事,做好一件事, 提升处理速度
- 流式处理,极少的文件`IO`


## Gulp.js的核心设计
[gulp](http://gulpjs.com/)官网上的简介是`The streaming build system`，
核心的词是`streaming（流动式）`，`Gulp.js`的精髓在于对`Node.js`中`Streams API`的利用，
所以想要理解`Gulp.js`，我们必须理解`Streams`，`streaming`其实就是`Streams`的设计思想，
但是像我这种对`Node.js`只是一知半解的就只说到这里了，有兴趣的可以自行google。


## Strem
流,简单来说就是建立在面向对象基础上的一种抽象的处理数据的工具。在流中，定义了一些处理数据的基本操作，如读取数据，写入数据等，程序员是对流进行所有操作的，而不用关心流的另一头数据的真正流向。流不但可以处理文件，还可以处理动态内存、网络数据等多种数据形式。

而gulp正是`通过流和代码优于配置的策略`来尽量简化任务编写的工作。这看起来有点“像jQuery”的方法，把动作串起来创建构建任务。早在Unix的初期，流就已经存在了。流在Node.js生态系统中也扮演了重要的角色，类似于*nix将几乎所有设备抽象为文件一样，Node将几乎所有IO操作都抽象成了stream的操作。因此用gulp编写任务也可看作是用Node.js编写任务。当使用流时，gulp去除了中间文件，只将最后的输出写入磁盘，整个过程因此变得更快。


## 特点
- `易于使用`: 通过代码优于配置的策略，gulp 让简单的任务简单，复杂的任务可管理。
- `构建快速`: 利用 Node.js 流的威力，你可以快速构建项目并减少频繁的 IO 操作。
- `易于学习`: 通过最少的 API，掌握 gulp 毫不费力，构建工作尽在掌握：如同一系列流管道。
- `插件高质`: gulp 严格的插件指南确保插件如你期望的那样简洁高质得工作。


# 安装
1. 首先确保你已经正确安装了nodejs环境。然后以全局方式安装gulp：
  npm install -g gulp

2. 全局安装gulp后，还需要在每个要使用gulp的项目中都单独安装一次。把目录切换到你的项目文件夹中，然后在命令行中执行：
  npm install gulp

3. 如果想在安装的时候把gulp写进项目package.json文件的依赖中，则可以加上–save-dev：
  npm install --save-dev gulp

这样就完成了gulp的安装，接下来就可以在项目中应用gulp了。


## 使用
### 1.建立gulpfile.js文件
gulp也需要一个文件作为它的主文件，在gulp中这个文件叫做gulpfile.js。新建一个文件名为gulpfile.js的文件，然后放到你的项目目录中。之后要做的事情就是在gulpfile.js文件中定义我们的任务了。下面是一个最简单的gulpfile.js文件内容示例，它定义了一个默认的任务。
```
var gulp = require('gulp');
gulp.task('default',function(){
  console.log('hello world');
});
```
此时我们的目录结构是这样子的：
project/
├─ node_modules/
│ ├─ .bin/
│ └─ gulp/
└─ gulpfile.js

### 2.运行gulp任务
要运行gulp任务，只需切换到存放gulpfile.js文件的目录，然后在命令行中执行gulp命令就行了，gulp后面可以加上要执行的任务名，例如gulp task1，如果没有指定任务名，则会执行任务名为default的默认任务。


## 工作方式
在介绍gulp API之前，我们首先来说一下gulp.js工作方式。在gulp中，使用的是Nodejs中的stream(流)，首先获取到需要的stream，然后可以通过stream的pipe()方法把流导入到你想要的地方，比如gulp的插件中，经过插件处理后的流又可以继续导入到其他插件中，当然也可以把流写入到文件中。所以gulp是以stream为媒介的，它不需要频繁的生成临时文件，这也是我们应用gulp的一个原因。

gulp的使用流程一般是：首先通过gulp.src()方法获取到想要处理的文件流，然后把文件流通过pipe方法导入到gulp的插件中，最后把经过插件处理后的流再通过pipe方法导入到gulp.dest()中，gulp.dest()方法则把流中的内容写入到文件中。例如：
```
var gulp = require('gulp');
gulp.src('script/jquery.js')         // 获取流的api
  .pipe(gulp.dest('dist/foo.js')); // 写放文件的api
```
我们将在本章内容中来给同学们讲解gulp API，其中包括`gulp.src()`，`gulp.task()`，`gulp.dest()`，`gulp.watch()`，`gulp.run()`。


## Gulp api速览
使用gulp，仅需知道4个API即可：gulp.task(),gulp.src(),gulp.dest(),gulp.watch()，所以很容易就能掌握。

### gulp.src(globs[, options])
gulp.src()方法正是用来获取流的，但要注意这个流里的内容不是原始的文件流，而是一个虚拟文件对象流，这个虚拟文件对象中存储着原始文件的路径、文件名、内容等信息，本文暂不对文件流进行展开，你只需简单的理解可以用这个方法来读取你需要操作的文件就行了，globs参数是文件匹配模式(类似正则表达式)，用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。
options为可选参数。通常情况下我们不需要用到，暂不考虑。

#### 文件匹配模式
Gulp内部使用了node-glob模块来实现其文件匹配功能。我们可以使用下面这些特殊的字符来匹配我们想要的文件：

- `*` 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
- `**` 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
- `?`匹配文件路径中的一个字符(不会匹配路径分隔符)
- `[...]` 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法`!(pattern|pattern|pattern)`匹配任何与括号中给定的任一模式都不匹配的
- `?(pattern|pattern|pattern)`匹配括号中给定的任一模式0次或1次，类似于js正则中的`(pattern|pattern|pattern)?`
- `+(pattern|pattern|pattern)`匹配括号中给定的任一模式至少1次，类似于js正则中的`(pattern|pattern|pattern)+`
- `*(pattern|pattern|pattern)`匹配括号中给定的任一模式0次或多次，类似于js正则中的`(pattern|pattern|pattern)*`
- `@(pattern|pattern|pattern)`匹配括号中给定的任一模式1次，类似于js正则中的`(pattern|pattern|pattern)`

文件匹配列子：
- `*` 能匹配 `reeoo.js`,`reeoo.css`,`reeoo`,`reeoo/`,但不能匹配`reeoo/reeoo.js`
- `*.*`能匹配 `reeoo.js`,`reeoo.css`,`reeoo.html`
- `*/*/*.js`能匹配 `r/e/o.js`,`a/b/c.js`,不能匹配`a/b.js`,`a/b/c/d.js`
- `**`能匹配 `reeoo`,`reeoo/reeoo.js`,`reeoo/reeoo/reeoo.js`,`reeoo/reeoo/reeoo`,`reeoo/reeoo/reeoo/reeoo.co`,能用来匹配所有的目录和文件
- `**/*.js`能匹配 `reeoo.js`,`reeoo/reeoo.js`,`reeoo/reeoo/reeoo.js`,`reeoo/reeoo/reeoo/reeoo.js`
- `reeoo/**/co`能匹配 `reeoo/co`,`reeoo/ooo/co`,`reeoo/a/b/co`,`reeoo/d/g/h/j/k/co`
- `reeoo/**b/co`能匹配 `reeoo/b/co`,`reeoo/sb/co`,但不能匹配`reeoo/x/sb/co`,因为只有单`**`单独出现才能匹配多级目录
- `?.js`能匹配 `reeoo.js`,`reeoo1.js`,`reeoo2.js`
- `reeoo??`能匹配 `reeoo.co`,`reeooco`,但不能匹配`reeooco/`,因为它不会匹配路径分隔符
- `[reo].js`只能匹配 `r.js`,`e.js`,`o.js`,不会匹配`re.js`,`reo.js`等,整个中括号只代表一个字符
- `[^reo].js`能匹配 `a.js`,`b.js`,`c.js`等,不能匹配`r.js`,`e.js`,`o.js`

当有多种匹配模式时可以使用数组
```
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```
使用数组的方式还有一个好处就是可以很方便的使用排除模式，在数组中的单个匹配模式前加上!即是排除模式，它会在匹配的结果中排除这个匹配，要注意一点的是`不能在数组中的第一个元素`中使用排除模式

`gulp.src([*.js,'!r*.js'])` 匹配所有js文件，但排除掉以r开头的js文件
`gulp.src(['!r*.js',*.js])` 不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开的模式相加起来得到的结果。展开的例子如下：

- `r{e,o}c`会展开为 `rec`,`roc`
- `r{e,}o`会展开为 `reo`,`ro`
- `r{0..3}o`会展开为 `r0o`,`r1do`,`r2o`,`r3o`

### gulp.dest(path[,options])
`gulp.dest()`方法是用来写文件的，`path`为写入文件的路径,`options`为一个可选的参数对象，通常我们不需要用到，暂不考虑。
要想使用好`gulp.dest()`这个方法，就要理解给它传入的路径参数与最终生成的文件的关系。
`gulp`的使用流程一般是这样子的：首先通过`gulp.src()`方法获取到我们想要处理的文件流，然后把文件流通过`pipe`方法导入到`gulp`的插件中，最后把经过插件处理后的流再通过`pipe`方法导入到`gulp.dest()`中，`gulp.dest()`方法则把流中的内容写入到文件中，这里首先需要弄清楚的一点是，我们给`gulp.dest()`传入的路径参数，只能用来指定要生成的文件的目录，而不能指定生成文件的文件名，它生成文件的文件名使用的是导入到它的文件流自身的文件名，所以生成的文件名是由导入到它的文件流决定的，即使我们给它传入一个带有文件名的路径参数，然后它也会把这个文件名当做是目录名，例如：
```
var gulp = require('gulp');
gulp.src('script/jquery.js')
  .pipe(gulp.dest('dist/foo.js'));
//最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js
```
要想改变文件名，可以使用插件`gulp-rename`

下面说说生成的文件路径与我们给`gulp.dest()`方法传入的路径参数之间的关系。
`gulp.dest(path)`生成的文件路径是我们传入的`path`参数后面再加上`gulp.src()`中有通配符开始出现的那部分路径。例如：
```
var gulp = reruire('gulp');
//有通配符开始出现的那部分路径为 **/*.js
gulp.src('script/**/*.js')
  .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/**/*.js
//如果 **/*.js 匹配到的文件为 jquery/jquery.js ,则生成的文件路径为 dist/jquery/jquery.js
```
再举更多一点的例子
```
gulp.src('script/avalon/avalon.js') //没有通配符出现的情况
  .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/avalon.js

//有通配符开始出现的那部分路径为 **/underscore.js

gulp.src('script/**/underscore.js')
  //假设匹配到的文件为script/util/underscore.js
  .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/util/underscore.js

gulp.src('script/*') //有通配符出现的那部分路径为 *
  //假设匹配到的文件为script/zepto.js
  .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/zepto.js
```
通过指定`gulp.src()`方法配置参数中的`base`属性，我们可以更灵活的来改变`gulp.dest()`生成的文件路径。
当我们没有在`gulp.src()`方法中配置`base`属性时，`base`的默认值为通配符开始出现之前那部分路径，例如：
  gulp.src('app/src/**/*.css') //此时base的值为 app/src
上面我们说的`gulp.dest()`所生成的文件路径的规则，其实也可以理解成，用我们给`gulp.dest()`传入的路径替换掉`gulp.src()`中的`base`路径，最终得到生成文件的路径。
```
gulp.src('app/src/**/*.css') //此时base的值为app/src,也就是说它的base路径为app/src
   //设该模式匹配到了文件 app/src/css/normal.css
  .pipe(gulp.dest('dist')) //用dist替换掉base路径，最终得到 dist/css/normal.css
```
所以改变`base`路径后，`gulp.dest()`生成的文件路径也会改变
```
gulp.src(script/lib/*.js) //没有配置base参数，此时默认的base路径为script/lib
  //假设匹配到的文件为script/lib/jquery.js
  .pipe(gulp.dest('build')) //生成的文件路径为 build/jquery.js

gulp.src(script/lib/*.js, {base:'script'}) //配置了base参数，此时base路径为script
  //假设匹配到的文件为script/lib/jquery.js
  .pipe(gulp.dest('build')) //此时生成的文件路径为 build/lib/jquery.js
```

用`gulp.dest()`把文件流写入文件后，文件流仍然可以继续使用。

### gulp.task(name[, deps], fn)
`gulp.task`方法用来定义任务，
`name` 为任务名，
`deps` 是当前定义的任务需要依赖的其他任务，
为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。
如果没有依赖，则可省略这个参数，
`fn` 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。

### gulp.watch(glob[, opts], tasks)

gulp.watch()用来监视文件的变化，当文件发生变化后，我们可以利用它来执行相应的任务，例如文件压缩等。
glob 为要监视的文件匹配模式，规则和用法与gulp.src()方法中的glob相同。
opts 为一个可选的配置对象，通常不需要用到，暂不考虑。
tasks 为文件变化后要执行的任务，为一个数组，
```
gulp.task('uglify',function(){
  //do something
});
gulp.task('reload',function(){
  //do something
});
gulp.watch('js/**/*.js', ['uglify','reload']);
```

`gulp.watch()`还有另外一种使用方式：
  gulp.watch(glob[, opts, cb])
`glob`和`opts`参数与第一种用法相同
`cb`参数为一个函数。每当监视的文件发生变化时，就会调用这个函数,并且会给它传入一个对象，该对象包含了文件变化的一些信息，`type`属性为变化的类型，可以是`added`,`changed`,`deleted`；`path`属性为发生变化的文件的路径
```
gulp.watch('js/**/*.js', function(event){
  console.log(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
  console.log(event.path); //变化的文件的路径
});
```

### 常用的gulp插件介绍
- js文件压缩: `gulp-uglify`
- 重命名文件: `gulp-rename`
- 压缩css文件: `gulp-minify-css`
- html文件压缩: `gulp-minify-html`
- 文件合并: `gulp-concat`
- 自动刷新: `browser-sync`
- 处理html: `gulp-processhtml`
- 字符串替换: `gulp-replace`

[^footnote]: [基于Node.js的自动化工具Gulp](https://cnodejs.org/topic/5631875ff3fb0e2d445315db)
[^footnote2]: [gulp简易入坑](http://segmentfault.com/a/1190000002955996)


## Example
```
var gulp = require('gulp'),//gulp基础库
  concat = require('gulp-concat'),//合并文件
  cssmin = require('gulp-minify-css'),//压缩css
  htmlmin = require("gulp-htmlmin"),//压缩html
  jsmin = require('gulp-uglify'),//压缩js
  rename = require('gulp-rename'),//重命名文件
  clean = require("gulp-clean"),//清理目录
  replace = require('gulp-replace'),//文本替换
  processhtml = require('gulp-processhtml'),//处理html文件
  addsrc = require('gulp-add-src'),//添加额外的文件流
  option = {
    buildPath: "../dist"//构建目录
  };
//构建目录清理
gulp.task("clean", function (done) {
  //return cache.clearAll(done);
  return gulp.src(option.buildPath, {
    read: false
  })
  .pipe(clean({force: true}));

})

gulp.task("imgcopy", function () {//图片拷贝
  gulp.src("../img/**/*")
  .pipe(gulp.dest(option.buildPath + '/img/'))
})

//js文件压缩
gulp.task('jsmin', function () {
  gulp.src(["../js/**/**/*.js",'!../js/libs/*.js'])
    .pipe(jsmin())
    .pipe(gulp.dest(option.buildPath+ "/js/"))
});

//需要合并和压缩的文件
gulp.task('concat', function () {
  gulp.src(['../js/libs/angular.min.js','../js/libs/*.js', '!../js/libs/bridge*.js'])
    .pipe(concat('libs.min.js'))
    .pipe(jsmin())
    .pipe(addsrc('../js/libs/bridge*.js'))
    .pipe(jsmin())
    .pipe(gulp.dest(option.buildPath + "/js/libs/"))
});

gulp.task("processhtml", function () {
  var date = new Date().getTime();
  gulp.src('../main.html')
    .pipe(replace(/_VERSION_/gi, date))
    .pipe(processhtml())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(option.buildPath + '/'))
})

//压缩css
gulp.task("cssmin", function () {
  gulp.src("../style/*.css")
    .pipe(cssmin())
    .pipe(gulp.dest(option.buildPath + '/style'))
})

//压缩html文件
gulp.task("htmlmin", function () {
  gulp.src('../views/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(option.buildPath + '/views'))
})

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function () {
  gulp.start('jsmin', 'cssmin', 'processhtml', "htmlmin", 'imgcopy', 'concat');
});
```