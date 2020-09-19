<template>
  <div class="blogs-details">
      <page-box
        :isGrey="true"
        :isWhite="true"
        :styleStr="`width: 100%; height: 300px; background: url(${blogsDetails.imgUrl}) no-repeat top right/cover`"
      >
        <div slot="header" class="shadow-dialog">
          <div class="container container-text">
            <h1 class="fs-8xl">{{blogsDetails.title}}</h1>
            <p class="fs-2xl">{{blogsDetails.description}}</p>
          </div>
        </div>
        <div slot="section">
          <div class="blogs-box d-flex pb-5 pr">
            <div class="blogs-content flex-1" :class="{'pr-4 border-right': isShowMenu}">
              <div class="d-flex jc-between ai-center mb-5">
                <h2 class="m-0 article-zw">
                  <i class="col-primary"># </i>正文
                </h2>
                <span
                  v-show="!isShowMenu"
                  class="hover-gradient fs-2xl col-grey-1"
                  @click="isShowMenu = true"
                >「 显示目录 」</span>
              </div>
              <article
                v-highlight
                class="article markdown-body"
                ref="article"
                v-html="blogsDetails.content"
              ></article>
              <div class="" v-if="blogsDetails.related.filter(v => v._id!=id)>0">
                <h2 class="article-zw py-3">
                  <i class="col-primary"># </i>相关阅读
                </h2>
                <ul>
                  <li v-for="(r) in blogsDetails.related.filter(v => v._id!=id)" :key="r._id" class="mt-2">
                    <nuxt-link :to="`/blog/${r._id}`" >{{r.title}}</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="blogs-menu pl-4 toc-sticky" v-show="isShowMenu">
              <div class="d-flex jc-between ai-center mb-5">
                <h2 class="m-0">
                  <i class="col-primary"># </i>TOC
                </h2>
                <span
                  v-show="isShowMenu"
                  class="hover-gradient fs-2xl col-grey-1"
                  @click="isShowMenu = false"
                >「 隐藏目录 」</span>
              </div>
              <div
                class="menu-title cur-p text-ellipsis"
                :title="item.text"
                v-for="item in articleToc"
                :key="item.id"
                :style="{paddingLeft: `${item.indent}em`}"
                @click="scrollTo(item.id)"
              >{{item.text}}</div>
            </div>
          </div>
          <div>
              <share-qrcode></share-qrcode>
          </div>
          <div class="fs-2xl">
            <h2 class>
              <i class="col-primary"># </i>评论
            </h2>
            <comment-textarea
              model="comments"
              @toResponse="getBlogsComments"
              type="parent"
              :blogsId="id"
              placeholder="大家请坐下，陈独秀同志，要发言了。。。"
            ></comment-textarea>
            <comment-list
              class="mt-4"
              model="comments"
              @getCommentList="getBlogsComments"
              :commentsList="parentComments"
              v-if="parentComments"
              :blogsId="id"
            ></comment-list>
          </div>
        </div>
      </page-box>
  </div>
</template>

<script>

import buildToc from "~/assets/js/build-toc.js";
// import highlight from '../plugins/highlight.js'
import marked from "marked";
import { addLineAndCopy } from "~/assets/js/lineAndCopy";
import shareQrcode from '~/components/shareQrcode'
export default {
  scrollToTop: true,
  // transition: 'page',
  components: {
    shareQrcode
  },
  async asyncData({ $axios, params }) {
    const data = await $axios.$get(`/comments/${params.id}`)
      let blogsComments = data;
      let parentComments = blogsComments.filter(
        v => v.parent == "5e52a80981bf76430fd982f0"
      );
      parentComments.forEach(c => {
        return (c.children = blogsComments.filter(v => v.parent == c._id));
      });
    return { parentComments }
  },
  data() {
    return {
      isShowMenu: true,
      id: this.$route.params.id,
      blogsDetails: {
        imgUrl: "",
        related: []
      },
      articleToc: [],
      parentComments: []
    };
  },
  head () {
    return {
      title: '博文详情',
      meta: [
        { hid: 'page', name: 'description', content: '这里是博文详情页，网站核心页面，谢谢你的浏览，欢迎你来评论支持' }
      ]
    }
  },
  created() {
    // this.getBlogsComments();
  },
  mounted() {
    this.getBlogsDetails();
  },
  methods: {
    async getBlogsDetails() {
      let data = await this.$axios.$get(`/blogs/${this.id}`);
      this.blogsDetails = data;
      let tocData = buildToc(marked(data.content));
      console.log(tocData);
      this.blogsDetails.content = tocData.article;
      this.articleToc = tocData.toc;
      this.$nextTick(() => {
        addLineAndCopy();
        // this.addCodeSupport()
      });
    },
    addCodeSupport() {
      // 代码高亮
      // let codeList = this.$refs.article.querySelectorAll('pre code')
      // 	codeList.forEach(codeNode => highlight(codeNode))
    },
    async getBlogsComments() {
      let data = await this.$axios.$get(`/comments/${this.id}`);
      console.log(data);
      let blogsComments = data;
      this.parentComments = blogsComments.filter(
        v => v.parent == "5e52a80981bf76430fd982f0"
      );
      this.parentComments.forEach(c => {
        return (c.children = blogsComments.filter(v => v.parent == c._id));
      });
    },
    scrollTo(id) {
      // 绑定 toc 点击事件
      let node = document.querySelector('[data-id="' + id + '"]');
      if (!node) {
        return;
      }
      node.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.blogs-detail {
  position: relative;
}
.shadow-dialog {
  height: 300px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(21, 21, 21, 0.7);
  color: #fff;
  .container-text {
    height: 100%;
    padding: 130px 20px 56px;
  }
}
.article-zw {
  line-height: 32px;
}
.blogs-box {
  min-height: 500px;
  display: -webkit-box;
  display: flex;
  // -webkit-box-orient: horizontal;
  // -webkit-box-direction: normal;
  // flex-flow: row nowrap;
  // position: relative;
  -webkit-box-align: start;
  align-items: flex-start;
}
.blogs-content {
  overflow: hidden;
  .article {
    line-height: 1.5;
  }
}
.blogs-menu {
  width: 220px;
  line-height: 1.3;
  .menu-title {
    font-size: 14px;
    padding: 5px 0;
    color: #0366d6;
    &:hover {
      text-decoration: underline;
    }
  }
}
.toc-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 91px;
  flex-shrink: 0;
}
@media screen and (max-width: 768px) {
  .blogs-content {
    padding-right: 0;
  }
  .border-right {
    border-right: none;
  }
  .blogs-menu {
    display: none;
  }
}
</style>
<style lang='scss'>
@media screen and (max-width: 768px) {
  .blogs-content {
    overflow: hidden;
    .article {
      line-height: 1.5;
      img {
        width: 100% !important;
      }
    }
  }
}
</style>