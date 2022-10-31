## 认识Vite
兼容性注意：
`Vite`需要 `Node.js` 版本 `14.18+`，`16+`。然而，有些模板需要依赖更高的 `Node` 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 `Node` 版本。

`Webpack`是目前整个前端使用最多的构建工具，但是除了`webpack`之后也有其他的一些构建工具:
  - 比如`rollup`、`parcel`、`gulp`、`vite`等等
  - `rollup`一般用来打包一些框架，更为常见;
  - `parcel`号称零配置的打包工具，但是本身比较大，用的会比较少一点;
  - `gulp`用来做自动化比较多一点;

什么是`vite`呢?官方的定位∶下一代前端开发与构建工具;
如何定义下一代开发和构建工具呢?
  - 我们知道在实际开发中，我们编写的代码往往是不能被浏览器直接识别的，比如`ES6`、`TypeScript`、`Vue`文件等等;
  - 所以我们必须通过构建工具来对代码进行转换、编译，类似的工具有`webpack`、`rollup`、`parcel`;
  - 但是随着项目越来越大，需要处理的`JavaScript`呈指数级增长，模块越来越多;
  - 构建工具需要很长的时间才能开启服务器，`HMR`也需要几秒钟才能在浏览器反应出来;

`Vite`(法语意为"快速的"，发音`/it/`)是一种新型前端构建工具，能够显著提升前端开发体验。

## Vite的构造
它主要由两部分组成:
  - 一个开发服务器，它基于原生`ES`模块提供了丰富的内建功能，`HMR`的速度非常快速;
  - 一套构建指令，它使用`rollup`打开我们的代码【内置`rollup`】，并且它是预配置的，可以输出生成环境的优化过的静态资源;

## 浏览器原生支持模块化
创建一个目录作为项目根目录，在里面创建一个`src`文件夹和一个`main.js`文件，在其中随便写点代码：
```js
console.log("Hello World")
```

再到`src`文件夹下创建一个`js`文件夹，再创建一个`math.js`文件，书写一点`js`代码
```js
export function sum(num1, num2) {
  return num1 + num2
}
```

然后导入到`main.js`文件中
```js
import { sum } from "./js/math"

console.log("Hello World")
console.log(sum(1, 2))
```

接着再到项目根目录下创建一个`index.html`文件，再把`main.js`引入
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="./src/main.js" type="module"></script>
</body>
</html>
```

我们来运行这个`html`文件，由于没有构建工具，那么它是否能打印出结果呢？
先说结论吧，对于版本比较高的浏览器已经支持`ES Module`，刚刚写的`import`其实已经支持了，但是现在浏览器控制台运行是报错的，如果想要让浏览器认识`main.js`模块，必须给`script`添加一个属性`type="module"`
添加这个属性，就相当于浏览器解析时允许代码使用`ES Module`

接着再次运行，但是浏览器控制台依然是报错的，它说这个`math`找不到，注意这时我们再回头看一下刚刚导入`math`是似乎没加后缀名，那么这里就得注意了，原生的`ES Module`后缀名都是不能掉的，之前在`webpack`中`js`文件能省去，那是因为`webpack`有自己的查找规则，它会一个一个后缀名进行添加查找，所以这里后缀明得加上
```diff
-import { sum } from "./js/math"
+import { sum } from "./js/math.js"

console.log("Hello World")
console.log(sum(1, 2))
```

然后浏览器就能正常显示了
既然浏览器能直接识别我这里的代码，如果开发里我还写了`request.js`文件代码里面也是`ES6`代码，这些代码加在一起都是模块化的，而浏览器也是支持模块化的，是不是完全意味着开发阶段不需要用构建工具，那就省去了构建这个过程，直接运行就行了；等到真正打包上线的时候，因为我们要适配更多的用户的浏览器，某些用户使用浏览器可能就不支持`ES6`了，我们等到打包的时候再做构建转成`ES5`的代码

其实这也就是`Vite`的基本思想
目前只是写的`ES6`代码，万一还有`ts`文件和`vue`文件，这肯定是没办法直接跑到浏览器上的，就算是现在最新的浏览器它也不支持
那不支持，该怎么办呢？
`Vite`它将这些不识别的代码做了一个转化，转换为浏览器能识别的`ES Module`代码

虽然我们目前这些代码能跑，可是一旦有了`ts`代码，就不能跑了，所以还是需要构建工具

先在项目根目录下初始化一个`package.json`文件
```bash
# 创建package.json
npm init
# 快速创建package.json
npm init -y
```

再安装一个`lodash-es`包
```bash
npm install lodash-es -S
```

在`main.js`导入使用
```js
import _ from 'lodash-es'

// import { sum } from "./js/math"
// 原生后缀名不能掉
import { sum } from "./js/math.js"

console.log("Hello World")
console.log(sum(1, 2))

// 使用lodash
console.log(_.join(['abc', 'def'], '-'))
```

但是这样浏览器运行是无法加载`lodash`的，在`webpack`中是有专门的包对这种路径做解析的，浏览器它是无法加载的，不认识，应该换为下面这种写法：
```diff
// import _ from 'lodash-es'
// 浏览器无法加载上面这个包，找不到这个包所在位置
+import _ from '../node_modules/lodash-es/lodash.default.js'

// import { sum } from "./js/math"
// 原生后缀名不能掉
import { sum } from "./js/math.js"

console.log("Hello World")
console.log(sum(1, 2))

// 使用lodash
console.log(_.join(['abc', 'def'], '-'))
```

但是这种方式是有弊端的，在浏览器控制台`network`中，我们刷新一下，是可以看到浏览器有很多请求的，`lodash`依赖了很多其它文件，浏览器就会认为也要加载，就会把这些文件全部都加载出来，每个`js`文件都要发一次请求，浏览器再解析这么多文件是非常消耗性能的，虽然没有使用构建工具，源代码也能跑起来，但是会有两个弊端：
1. 某些文件是不识别的【`ts`文件、`vue`文件】
2. 如果包之间的依赖太多，那么会发送过多的网络请求

`vite`它会帮我们解决。

## Vite的安装和使用
注意: `Vite`本身也是依赖`Node`的，所以也需要安装好`Node`环境口
  - 并且`Vite`要求`Node`版本是大于12版本的;
首先，我们安装一下`vite`工具︰
```bash
# 全局安装
npm install vite -g
# 局部安装
npm install vite -D
```

这里我们只需要对于我们的这个项目进行打包，所以这里我们就用局部安装
使用一下`vite`
```bash
npx vite
```

执行完它就会我们搭建好本地服务，浏览器上运行显示正常，这个`vite`它对我们的源代码做了一个构建，然后搭建了一个本地服务，浏览器访问时，访问的是`vite`搭建的这个本地服务，然后`vite`这个服务就会给我们提供这里的源代码
但是这样似乎和原来没有什么区别，这里来看第一个区别：
1. 导入文件时不需要加后缀名，`vite`它会帮自动我们加上后缀名的；
2. 想从`node_modules`导入某个包，直接写上包名即可，不需要原来那样路径写很长；
3. 在`network`中查看请求，它只有常见的几个请求了，因为它帮我们做了个打包，`lodash`虽然比较大，但是没有之前那么多`http`请求

## Vite对于css、less的支持
在`src`文件夹中创建个`css`文件夹，再在其中创建个`style.css`文件
```css
body {
  background-color: skyblue;
}
```

加入依赖图，它才会进行构建、打包
回到`main.js`文件中
```js
// 导入样式
import "./css/style.css"
```
回到浏览器样式生效了，这也说明了`vite`默认就对`css`做了处理，不需要像`webpack`那样再做什么`css-loader`、`style-loader`处理
接着我们再到`main.js`文件中创建个空标签
```js
const titleEl = document.createElement('div')
titleEl.className = "title"
titleEl.innerHTML = "Hello vite"
document.body.appendChild(titleEl)
```

再到`css`文件夹下创建一个`title.less`文件
```css
@fontSize: 50px;
@fontColor: pink;

.title {
  font-size: @fontSize;
  color: @fontColor;
}
```

加入依赖图中，回到main.js文件中
```js
import "./css/title.less"
```

这时下方也很快的出现了报错
`[vite] Internal server error: Preprocessor dependency "less" not found. Did you install it?`
大概意思是：我们当前预处理器它需要依赖我们`less`工具，但这个`less`工具没有找到，你安装了`less`工具吗
之前`webpack`也是需要依赖`less`工具[`lessc`]，只不过在`vite`中，不需要`less-loader`，但是`less`工具依然还是要安装
局部安装`less`工具【注意停掉服务】:
```bash
npm install less -D
```
重新跑下服务，`less`文件就生效了

我们再来验证一下`postcss`，比如浏览器加上前缀，回到`title.less`文件中
```less
@fontSize: 50px;
@fontColor: pink;

.title {
  font-size: @fontSize;
  color: @fontColor;
  // 验证浏览器前缀
  user-select: none;
}
```
浏览器上查看它是并没有帮我们加上浏览器前缀的，这时我们需要加上，一般会这样做：
1. 我们还是需要postcss这个工具，用它来做转化
```bash
npm install postcss -D
```

注意`postcss`已经集合为一个小的生态，它还是需要相应的插件去实现功能，添加前缀我们可以使用之前`autoprefixer`插件，但是我们使用`postcss-preset-env`更多，它已经内置了`autoprefixer`插件
安装`postcss-preset-env`
```bash
npm install postcss-preset-env -D
```
注意不是安装完就结束了，我们还需要配置，再到项目根目录下创建一个`postcss.config.js`文件，添加如下代码：
```js
module.exports = {
  plugins: [
    require('postcss-preset-env')
  ]
}
```
这时再重新跑下服务，前缀就成功加上了，我们也能发现`vite`它都不需要我们做任何配置，执行效率也比`webpack`高很多

## Vite对TypeScript的支持
在`src`文件夹下创建一个`ts`文件夹，再到其中创建一个`mul.ts`文件
```typescript
export default function(num1: number, num2: number): number {
  return num1 * num2
}
```

回到`main.js`文件中，导入使用
```js
import mul from './ts/mul'

console.log(mul(10, 10))
```

重新跑一下，成功打印出结果，说明`vite`不需要我们做关于`ts`配置，直接写`ts`它就可以对于`ts`来做一些转化

## Vite的原理
接上面，我们再到浏览器控制台的`network`中刷新一下来看一下这个请求的资源，如下图
![10194](https://s1.ax1x.com/2022/10/31/xoHGTI.png)

我们可以看到它请求的文件扩展名就是`less`和`ts`
前面也提到过`vite`它会在本地建一个服务器，在`webpack`中使用的是`express`，而在`vite1`里面用的服务器是`koa`，但是从`vite2`开始便不再用`koa`了，用的是`connect`，本地服务器并不是直接把`.less`文件和`.ts`文件直接给浏览器，浏览器无法解析这两个文件的，`vite`的一些工具把我们编写的这两个`.less`文件和`.ts`文件做了个转化生成新的文件同时也还叫这个名字，并且这两个文件里面的代码变成了`es6`的`js`代码【我们可以在浏览器控制台的`response`中查看】，注意`css`也是变成了`js`代码，待会它会通过`style`标签注入到页面里面去的
当我们浏览器去请求这两个文件时，`vite`的本地服务它对于请求做了个拦截和转发，这也是它为什么它要使用`connect`的原因，connect`非常方便做这个转发，这个转发其实请求的是新生成的`ES6`的`js`代码文件，然后返回给浏览器，浏览器就会解析，显示
如果有兴趣可以到`node_modules`下去找一下`vite`其中的`package.json`文件中它是有这个`connect`的包版本号的

## Vite对vue的支持
我们在`src`下创建一个`vue`的文件夹再创建个`App.vue`文件，并书写一点代码
```vue
<template>
  <div>
    <h2>{{ message }}</h2>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      message: "Hello vue"
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  color: #fff;
}
</style>
```

当然既然要使用`vue`，首先肯定得安装一下`vue`，我们这里安装`vue3`就行了
```bash
npm install vue -D
```

然后再到`main.js`文件中导入`createApp`和根组件来使用
```js
import { createApp } from "vue"
// 导入根组件
import App from "./vue/App.vue"

// vue
createApp(App).mount("#app")
```

由于需要挂载容器，我们去`index.html`模板中添加一下
```html
<div id="app"></div>
```

然后使用`npx vite`命令来跑一下，发现其实是会报错的，需要安装一个插件
`[vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. Install @vitejs/plugin-vue to handle .vue files.`

`vite`对`vue`提供第一优先级支持:
  - `Vue3`单文件组件支持: `@vitejs/plugin-vue`
  - `Vue3 JSX`支持: `@vitejs/plugin-vue-jsx`
  - `Vue2`支持: `underfin/vite-plugin-vue2`

对于`vue3`安装一下插件
```bash
npm install @vitejs/plugin-vue -D
```

安装完这个插件之后我们还需要做配置，在项目根目录下创建个`vite.config.js`文件
```js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()]
}
```

注意`node`版本，文章开头说过，然后重新`npx vite`浏览器就能成功显示了
然后我们再到`node_modules`下，它有个`.vite`文件，它是我们第一次执行`npx vite`的时候做的一个预打包【主要是对依赖的库如`vue`、`lodash`】，它有个好处就是我们把这一次运行停掉，再次`npx vite`时，这两个就不需要再做预打包了，并且在终端看一下这个时间，很明显的快了一些，当然它内部也是做了判断的，并不会出现修改了还用之前的

## Vite打包项目及预览
`vite`它里面提供了一个`build`，直接去执行里面这个`build`就行了
```bash
npx vite build
```
打包成功后，它会在项目根目录下生成一个`dist`文件夹
一般打包后，我们也会对其在浏览器上测试一下，直接运行打包文件夹里的`index.html`文件也可以吗，但是`vite`它提供了另外一个工具`preview`，即预览，让它去执行里面的`preview`就可以了
```bash
npx vite preview
```
然后我们就可以预览进行测试了
但是在真实开发里面，我们一般不会一直去写`npx`命令，我们会在`package.json`文件的`scripts`脚本中编写【`scripts`里面有个默认的`test`，把它删掉】
```json
{
  ...
  "scripts": {
    "serve": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  ...
}
```
之后我们通过`npm run xxx`的方式去执行就可以了

## ESBuild解析
`vite`打包非常快，还有个原因就是`ESBuild`
`ESBuild`的特点:
  - 超快的构建速度，并且不需要缓存【`babel`去转换还需要利用缓存，但是`ESBuild`速度很快，不需要做缓存】;
  - 支持`ES6`和`CommonJS`的模块化 ;
  - 支持`ES6`的`Tree Shaking`【比如某个函数从未使用过那么就可以通过`Tree Shaking`删除掉】 ;
  - 支持`Go`、`JavaScript`的`API` ;
  - 支持`TypeScript`、`JSX`等语法编译 ;
  - 支持`SourceMap` ;
  - 支持代码压缩 ;
  - 支持扩展其他插件 ;

我们可以发现`ESBuild`与`babel`很像，但是功能更加强一点，`ESBuild`还可以做代码压缩，`babel`一般不做这个，而`Tree Shaking`要到`webpack`中做，相当于兼顾了一些`webpack`的功能

`ESBuild`为什么这么快呢?
  - 使用`Go`语言编写的，可以直接转换成机器代码，而无需经过字节码;
  - `ESBuild`可以充分利用`CPU`的多内核，尽可能让它们饱和运行;
  - `ESBuild`的所有内容都是从零开始编写的，而不是使用第三方，所以从一开始就可以考虑各种性能问题;

## Vite的项目创建方式
以上项目搭建从零开始的，但是真实开发里面不可能从零搭建一个项目，这里我们任意创建个文件夹来存放`vite`项目，利用`vscode`的终端输入如下命令
```bash
npm init vite
```
它会让我们填项目名称，这里不需要删除，直接输入项目名称即可，然后是选择框架、`ts`
创建完之后安装一下依赖，然后根据它的脚本就可以本地运行、预览和打包

