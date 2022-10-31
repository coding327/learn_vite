// import _ from 'lodash-es'
// 浏览器无法加载上面这个包，找不到这个包所在位置
// import _ from '../node_modules/lodash-es/lodash.default.js'
// 使用额vite可以省去后缀名，同时写上包名即可
import _ from 'lodash-es'
import { createApp } from "vue"

// import { sum } from "./js/math"
// 原生后缀名不能掉
// import { sum } from "./js/math.js"
// 使用了vite可以省去后缀名
import { sum } from "./js/math.js"
// 导入ts中函数
import mul from './ts/mul'
// 导入根组件
import App from "./vue/App.vue"

// 导入样式
import "./css/style.css"
import "./css/title.less"

console.log("Hello World")
console.log(sum(1, 2))

// 使用lodash
console.log(_.join(['abc', 'def'], '-'))

const titleEl = document.createElement('div')
titleEl.className = "title"
titleEl.innerHTML = "Hello vite"
document.body.appendChild(titleEl)

console.log(mul(10, 10))

// vue
createApp(App).mount("#app")