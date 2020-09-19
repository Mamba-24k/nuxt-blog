import Vue from 'vue'

import * as hljs from 'highlight.js/lib/highlight'
import * as javascript from 'highlight.js/lib/languages/javascript'
import * as xml from 'highlight.js/lib/languages/xml'
import * as css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

import 'highlight.js/styles/solarized-light.css' // 样式文件

// hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
   
    // let i = 1
    // const n = (m) => `<em class="line-label">${m > 9 ? m : '0' + m}</em>`
    // block.innerHTML = `<div class="line">${n(i)}${block.innerHTML.replace(/\n/g, function (word) {
    //   i += 1
    //   return `</div><div class="line">${n(i)}`
    // })}</div>`
  })
})