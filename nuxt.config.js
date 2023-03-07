// const dotenv = require('dotenv');
// dotenv.config()

console.log(process.env.NODE_ENV);
// const CopyPlugin = require("copy-webpack-plugin")
module.exports = {
  mode: "universal",
  server: {
    port: 8727, // default: 3000
    host: "127.0.0.1", // default: localhost,
  },
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
    title: "Mamba 曼巴 个人博客 网页博客设计 前端工程师博客",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "keywords",
        content: "Mamba,曼巴,前端工程师,vue.js,node.js,博客网站",
      },
      { name: "author", content: "Mamba 曼巴" },
      {
        name: "description",
        content:
          "曼巴博客网站是我个人从需求分析、网页设计、创建项目、部署上线全栈搭建的第一个个人网站，我将会通过他来实践自己的所学，让自己得到成长，也希望借此结交更多前辈好友。也乐于分享我的博客网站在前端、node.js、设计和web的各个细节上的点点滴滴，愿与你有缘，共同进步！",
      },
      { hid: "page", name: "page", content: "Mamba 曼巴博客网站" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/_nuxt/img/favicon.ico" },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap' }
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#ffb929",
    height: "2px",
  },
  /*
   ** Global CSS
   */
  css: [
    // 'element-ui/lib/theme-chalk/index.css',
    "@/assets/css/style.scss",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/element-ui",
    "@/plugins/global.js",
    "@/plugins/highlight.js",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt-community/dotenv-module
    // '@nuxtjs/dotenv',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8727/web"
        : "/web",
    credentials: true,
  },
  /*
   ** Build configuration
   */
  build: {
    analyze: process.env.NODE_ENV === "development" ? true : false, // 使用webpack-bundle-analyzer来可视化包以及如何优化它们
    vendor: ["element-ui"],
    maxChunkSize: 30000,
    productionSourceMap: false,
    productionGzip: true,
    productionGzipExtensions: ["js", "css", "svg"],
    // transpile: [/^element-ui/],
    // 按需引入element-ui
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk",
          },
        ],
      ],
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
