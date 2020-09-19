import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0def26a0 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _18c04775 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _b796bb90 = () => interopDefault(import('../pages/index/index.vue' /* webpackChunkName: "pages/index/index" */))
const _2f10b5a2 = () => interopDefault(import('../pages/index/blog/index.vue' /* webpackChunkName: "pages/index/blog/index" */))
const _4fc2b828 = () => interopDefault(import('../pages/index/friend.vue' /* webpackChunkName: "pages/index/friend" */))
const _246b1b6d = () => interopDefault(import('../pages/index/message.vue' /* webpackChunkName: "pages/index/message" */))
const _7abb2757 = () => interopDefault(import('../pages/index/blog/_id.vue' /* webpackChunkName: "pages/index/blog/_id" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _0def26a0,
    name: "about"
  }, {
    path: "/",
    component: _18c04775,
    children: [{
      path: "",
      component: _b796bb90,
      name: "index"
    }, {
      path: "blog",
      component: _2f10b5a2,
      name: "index-blog"
    }, {
      path: "friend",
      component: _4fc2b828,
      name: "index-friend"
    }, {
      path: "message",
      component: _246b1b6d,
      name: "index-message"
    }, {
      path: "blog/:id",
      component: _7abb2757,
      name: "index-blog-id"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
