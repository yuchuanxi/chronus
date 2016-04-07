＃ Webpack

## webpack是什么
CommonJS和AMD是用于JavaScript模块管理的两大规范，前者定义的是模块的同步加载，主要用于NodeJS；而后者则是异步加载，通过requirejs等工具适用于前端。随着npm成为主流的JavaScript组件发布平台，越来越多的前端项目也依赖于npm上的项目，或者自身就会发布到npm平台。因此，让前端项目更方便的使用npm上的资源成为一大需求。

web开发中常用到的静态资源主要有JavaScript、CSS、图片、Jade等文件，webpack中将静态资源文件称之为模块。webpack是一个module bundler(模块打包工具)，其可以兼容多种js书写规范，且可以处理模块间的依赖关系，具有更强大的js模块化的功能。Webpack对它们进行统一的管理以及打包发布。

## webpack特性
webpack具有requireJs和browserify的功能，但仍有很多自己的新特性：

1. 对 CommonJS 、 AMD 、ES6的语法做了兼容
2. 对js、css、图片等资源文件都支持打包
3. 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对CoffeeScript、ES6的支持
4. 有独立的配置文件webpack.config.js
5. 可以将代码切割成不同的chunk，实现按需加载，降低了初始化时间
6. 支持 SourceUrls 和 SourceMaps，易于调试
7. 具有强大的Plugin接口，大多是内部插件，使用起来比较灵活
8. webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

## Webpack安装和配置

### 安装
`webpack` 可以作为全局的`npm`模块安装，也可以在当前项目中安装。
```
npm install -g webpack
npm install --save-dev webpack
```
对于全局安装的`webpack`，直接执行此命令会默认使用当前目录的`webpack.config.js`作为配置文件。如果要指定另外的配置文件，可以执行：
```
webpack —config webpack.custom.config.js
```

### 配置
每个项目下都必须配置有一个 `webpack.config.js` ，它的作用如同常规的 `gulpfile.js/Gruntfile.js` ，就是一个配置项，告诉 webpack 它需要做什么。

前文说了，`webpack.config.js`文件通常放在项目的根目录中，它本身也是一个标准的`Commonjs`规范的模块。在导出的配置对象中有几个关键的参数：

#### entry
entry参数定义了打包后的入口文件，可以是个字符串或数组或者是对象；如果是数组，数组中的所有文件会打包生成一个filename文件；如果是对象，可以将不同的文件构建成不同的文件:
```
{
  entry: {
  page1: "./page1",
  //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
  page2: ["./entry1", "./entry2"]
  },
  output: {
  path: "dist/js/page",
  publicPath: "/output/",
  filename: "[name].bundle.js" // 模版基于上边 entry 的 key
  }
}
```
该段代码最终会生成一个 page1.bundle.js 和 page2.bundle.js，并存放到 ./dist/js/page 文件夹下
针对 page1, 在页面当中插入 `<script src="dist/js/page/page1.bundle.js"></script>`

#### output
`output`参数是个对象，定义了输出文件的位置及名字：
```
output: {
  path: "dist/js/page", // 图片和 JS 会到这里来
  publicPath: "/output/", // 这个用来拼成比如图片的 URL
  filename: "[name].bundle.js"
}
```
`path\`: 打包文件存放的绝对路径
`publicPath`: 网站运行时的访问路径, 替换 CDN
`filename`:打包后的文件名

当我们在`entry`中定义构建多个文件时，`filename`可以对应的更改为`[name].js`用于定义不同文件构建后的名字。

#### module
在webpack中JavaScript，CSS，LESS，TypeScript，JSX，CoffeeScript，图片等静态文件**都是模块**，不同模块的加载是通过模块加载器（`webpack-loader`）来统一管理的。loaders之间是可以串联的，一个加载器的输出可以作为下一个加载器的输入，最终返回到JavaScript上：
```
module: {
  //加载器配置
  loaders: [
  // .css 文件使用 style-loader 和 css-loader 来处理
  { test: /\.css$/, loader: 'style-loader!css-loader' },
  
  // .js 文件使用 jsx-loader 来编译处理
  { test: /\.js$/, loader: 'jsx-loader?harmony' },
  
  // .scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
  { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
  
  // 图片文件使用 url-loader 来处理，小于8kb的直接转为base64
  // loaders 可以接受 querystring 格式的参数
  { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
  ]
}
```
`test`项表示匹配的资源类型，`loader`或`loaders`项表示用来加载这种类型的资源的loader，loader的使用可以参考 [using loaders](http://webpack.github.io/docs/using-loaders.html)，更多的loader可以参考 [list of loaders](http://webpack.github.io/docs/list-of-loaders.html)。

`！`用来定义loader的串联关系，`"-loader"`是可以省略不写的，多个loader之间用“!”连接起来，但**所有的加载器都需要通过 npm 来加载**。

此外，还可以添加用来定义png、jpg这样的图片资源在小于10k时自动处理为base64图片的加载器：
```
{ test: /\.(png|jpg)$/,loader: 'url-loader?limit=10000'}
```
给css和less还有图片添加了loader之后，我们不仅可以像在node中那样require js文件了，我们还可以require css、less甚至图片文件：
```
require('./bootstrap.css');
require('./myapp.less');
var img = document.createElement('img');
img.src = require('./glyph.png');
```
`require()`时指定的loader会覆盖配置文件里对应的loader配置项。

#### resolve
webpack在构建包的时候会按目录的进行文件的查找，resolve属性中的extensions数组中用于配置程序可以自行补全哪些文件后缀：
```
resolve: {
  // 查找module的话从这里开始查找
  root: '/pomy/github/flux-example/src', //绝对路径
  
  // 自动扩展文件后缀名，意味着我们可以写 require('file') 代替 require('file.coffee')
  extensions: ['', '.js', '.json', '.scss', '.coffee'],
  
  // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
  alias: {
  AppStore : 'js/stores/AppStores.js',//后续直接 require('AppStore') 即可
  ActionType : 'js/actions/ActionType.js',
  AppAction : 'js/actions/AppAction.js'
  }
}
```
然后我们想要加载一个js文件时，只要require('common')就可以加载common.js文件了。

注意一下, extensions 第一个是空字符串! 对应不需要后缀的情况.

#### plugin
webpack提供了[丰富的组件]用来满足不同的需求，当然我们也可以自行实现一个组件来满足自己的需求：
```
plugins: [
  //your plugins list
]
```
在webpack中编写js文件时，可以通过require的方式引入其他的静态资源，可通过loader对文件自动解析并打包文件。通常会将js文件打包合并，css文件会在页面的header中嵌入style的方式载入页面。但开发过程中我们并不想将样式打在脚本中，最好可以独立生成css文件，以外链的形式加载。这时extract-text-webpack-plugin插件可以帮我们达到想要的效果。需要使用npm的方式加载插件，然后参见下面的配置，就可以将js中的css文件提取，并以指定的文件名来进行加载。
```
npm install extract-text-webpack-plugin –save-dev

plugins: [
  new ExtractTextPlugin('styles.css')
]
```

#### externals
当我们想在项目中require一些其他的类库或者API，而又不想让这些类库的源码被构建到运行时文件中，这在实际开发中很有必要。此时我们就可以通过配置externals参数来解决这个问题：
```
externals: {
  "jquery": "jQuery"
}
```
这样我们就可以放心的在项目中使用这些API了：`var jQuery = require("jquery");`

#### context
当我们在require一个模块的时候，如果在require中包含变量，像这样：
```
require("./mods/" + name + ".js");
```
那么在编译的时候我们是不能知道具体的模块的。但这个时候，webpack也会为我们做些分析工作：
1.分析目录：'./mods'； 
2.提取正则表达式：'/^.*\.js$/'；

于是这个时候为了更好地配合wenpack进行编译，我们可以给它指明路径，像在cake-webpack-config中所做的那样（我们在这里先忽略abcoption的作用）：
```
var currentBase = process.cwd();
var context = abcOptions.options.context ? abcOptions.options.context : 
path.isAbsolute(entryDir) ? entryDir : path.join(currentBase, entryDir);
```

## webpack常用命令

### webpack的使用通常有三种方式：
1、命令行使用：webpack <entry.js> <result.js> 其中entry.js是入口文件，result.js是打包后的输出文件
2、node.js API使用：
```
var webpack = require('webpack');
webpack({
  //configuration
}, function(err, stats){});
```
3、默认使用当前目录的webpack.config.js作为配置文件。如果要指定另外的配置文件，可以执行：webpack --config webpack.custom.config.js

webpack 的执行也很简单，直接执行
```
$ webpack --display-error-details
```
即可，后面的参数“--display-error-details”是推荐加上的，方便出错时能查阅更详尽的信息（比如 webpack 寻找模块的过程），从而更好定位到问题。

### 常用命令
webpack的使用和browserify有些类似，下面列举几个常用命令：
```
webpack 最基本的启动webpack命令
webpack -w 提供watch方法，实时进行打包更新
webpack -p 对打包后的文件进行压缩
webpack -d 提供SourceMaps，方便调试
webpack --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
webpack --profile 输出性能数据，可以看到每一步的耗时
webpack --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块
```
前面的四个命令比较基础，使用频率会比较大，后面的命令主要是用来定位打包时间较长的原因，方便改进配置文件，提高打包效率。

## 图片打包和静态资源服务器

### 图片打包
webpack中对于图片的处理，可以通过url-loader来实现图片的压缩。
```
div.img{
  background: url(../image/xxx.jpg)
}
```
//或者
```
var img = document.createElement("img");
img.src = require("../image/xxx.jpg");
document.body.appendChild(img);
```
针对上面的两种使用方式，loader可以自动识别并处理。根据loader中的设置，webpack会将小于指点大小的文件转化成 base64 格式的 dataUrl，其他图片会做适当的压缩并存放在指定目录中。
```
module: {
  loaders: [{
  test: /\.(png|jpg)$/,
  loader: 'url-loader?limit=10000&name=build/[name].[ext]'
  }]
}
```
对于上面的配置，如果图片资源小于10kb就会转化成 base64 格式的 dataUrl，其他的图片会存放在build/文件夹下。

### 静态资源服务器
除了提供模块打包功能，Webpack还提供了一个基于Node.js Express框架的开发服务器，它是一个静态资源Web服务器，对于简单静态页面或者仅依赖于独立服务的前端页面，都可以直接使用这个开发服务器进行开发。在开发过程中，开发服务器会监听每一个文件的变化，进行实时打包，并且可以推送通知前端页面代码发生了变化，从而可以实现页面的自动刷新。

Webpack开发服务器需要单独安装，同样是通过npm进行：
```
npm install -g webpack-dev-server
```
可以使用webpack-dev-server直接启动，也可以增加参数来获取更多的功能，具体配置可以参见官方文档。默认启动端口8080，通过localhost:8080/webpack-dev-server/可以访问页面，文件修改后保存时会在页面头部看到sever的状态变化，并且会进行热替换，实现页面的自动刷新。

## web_modules
有些时候，我们用到的第三方库并没有采用CommonJS或AMD规范，也没有提交到npm。这样的话，我们无法通过npm来下载，并通过require()来引用这些库。

webpack给我们提供了一个很好的实现方式。我们可以在项目根目录下，创建一个叫做`web_modules`的文件夹，然后将需要用到的第三方库存放在此处。那么之后，不需要做任何设置，可以在我们的逻辑代码中使用 `require('xx-lib.js')` 并且使用了。

## 去除多个文件中的频繁依赖
当我们经常使用React、jQuery等外部第三方库的时候，通常在每个业务逻辑JS中都会遇到这些库。
如我们需要在各个文件中都是有jQuery的$对象，因此我们需要在每个用到jQuery的JS文件的头部通过require('jquery')来依赖jQuery。 这样做非常繁琐且重复，因此webpack提供了我们一种比较高效的方法，我们可以通过在配置文件中配置使用到的变量名，那么webpack会自动分析，并且在编译时帮我们完成这些依赖的引入。

webpack.config.js中：
```
plugins: [
   new webpack.ProvidePlugin({
     'Moment': 'moment',
     "$": "jquery",
     "jQuery": "jquery",
     "window.jQuery": "jquery",
     "React": "react"
   })
]
```
这样，我们在JS中，就不需要引入jQuery等常用模块了，直接使用配置的这些变量，webpack就会自动引入配置的库。

## 分离应用和第三方库代码
把应用拆分成两个文件，如 app.js 和 vendor.js，然后再 vendor.js 中引用第三方代码。然后像下面这样把名称当做参数传递给 CommonChunksPlugin。
```
module.exports = {
  entry: {
    app: './app.js',
    vendor: ['jquery', 'underscore', ...],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName = */"vendor", /* filename= */"vendor.bundle.js")
  ]
};
```
这将会把 vendor 分块中的所有模块从 app 分块中移除，然后 bundle.js 将只包含应用代码，而把依赖的第三方代码置于 vendor.bundle.js。

再 html 页面中，再加载 bundle.js 前先加载 vendor.bundle.js。
```
<script src="vendor.bundle.js"></script>
<script src="bundle.js"></script>
```

[基于 Webpack 的前端资源构建方案](http://lifei.github.io/2015/12/20/webpack/?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)
