<template>
  <div>
    <header class="header-box" :class="isScrolling ? `mini bgGrad-right` : ''">
      <div class="d-flex container">
        <div
          class="bgGrad-right mamba-box cur-p d-flex ai-end jc-between col-white"
          @click="$router.push('/')"
        >
          <i :class="`iconfont ${this.vuex_skin_obj.icon}`"></i>
          <!-- <strong class="icon-f">{{vuex_skin_obj.first}}</strong> -->
          <strong class="fs-4xl">{{this.vuex_skin_obj.behind}}</strong>
        </div>
        <div class="bgCol-more flex-1 d-flex jc-end ai-center">
          <theme-picker class="flex-1 d-flex jc-center ai-center col-white"></theme-picker>
          <m-dropdown ref="menu" @hideDrop="isShowMenu = false" :list="routerList" @toDrop="changeMenu" :posObj="{top: '38px', right: '5px'}">
            <div slot="icon">
              <div
                class="menu-button cur-p"
                @click="isShowMenu = !isShowMenu"
                :class="{'isShowMenu': isShowMenu}"
              >
                <i>.</i>
                <i>.</i>
                <i>.</i>
              </div>
            </div>
          </m-dropdown>
          <!-- <el-dropdown trigger="click" @visible-change="v => isShowMenu = v">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <nuxt-link tag="div" to="/">首页</nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <nuxt-link tag="div" to="/blog">博文</nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <nuxt-link tag="div" to="/friend">web圈</nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <nuxt-link tag="div" to="/message">留言</nuxt-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <div class="router-box d-flex ai-center col-white fs-4xl">
            <nuxt-link
              :class="{'col-less border-less' : activeRoute == r.path}"
              class="router-item cur-p hover-more"
              tag="div"
              :to="r.path"
              v-for="(r, i) in routerList"
              :key="i"
            >{{r.name}}</nuxt-link>
          </div>
          <!-- <el-menu
            router
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            :background-color="#8600ff"
            text-color="#fff"
            active-text-color="#ffb929"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/blog">博文</el-menu-item>
            <el-menu-item index="/friend">web圈</el-menu-item>
            <el-menu-item index="/message">留言</el-menu-item>
          </el-menu>-->
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import ThemePicker from "./ThemePicker";
import { mapState, mapMutations } from "vuex";
import MDropdown from "./MDropdown.vue"

export default {
  props: {
    isScrolling: Boolean
  },
  components: {
    ThemePicker,
    MDropdown
  },
  data() {
    return {
      isShowMenu: false,
      isTop: false,
      routerList: [
        {
          name: "首页",
          path: "/"
        },
        {
          name: "博文",
          path: "/blog"
        },
        // {
        //   name: '生活随感',
        //   path: '/thought'
        // },
        {
          name: "web圈",
          path: "/friend"
        },
        {
          name: "留言",
          path: "/message"
        }
      ],
      activeRoute: ""
    };
  },
  computed: {
    ...mapState(["vuex_skin_obj"])
  },
  created() {
    this.activeRoute = this.$route.path;
  },
  watch: {
    $route(newV, oldV) {
      this.activeRoute = this.$route.path;
    }
  },
  methods: {
    ...mapMutations(["vuex_set_skin_obj"]),
    // handleSelect(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    changeMenu(v) {
      this.$refs.menu.showDrop = false
      this.isShowMenu = false
      this.$router.push(v.path)
    }
  }
};
</script>

<style lang="scss" scoped>
.header-box {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding-top: 20px;
  z-index: 2000;
  transition: 0.6s ease-in-out;
  .mamba-box {
    height: 60px;
    padding: 0 20px 6px 20px;
    .iconfont {
      font-size: 40px;
      margin-right: 5px;
    }
    // .icon-f{
    //   font-size: 36px;
    //   line-height: 1;
    //   margin-right: 5px;
    //   border: 1px solid #fff;
    //   border-radius: 10px;
    // }
  }
}
.mini {
  padding-top: 0px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
}
.router-box {
  height: 60px;
  .router-item {
    height: 60px;
    line-height: 58px;
    padding: 0 20px;
  }
}
.menu-button {
  padding: 5px 0;
  border: none;
  display: none;
  margin-right: 20px;
  i {
    display: block;
    width: 24px;
    height: 3px;
    color: transparent;
    background-color: #fff;
    margin: 5px auto;
    transition: 0.2s ease-in-out;
  }
}
.isShowMenu {
  i {
    &:nth-child(2) {
      opacity: 0;
    }
    &:nth-child(1) {
      transform: translateY(8px) rotate(-45deg);
    }
    &:nth-child(3) {
      transform: translateY(-8px) rotate(45deg);
    }
  }
}
// .el-menu.el-menu--horizontal {
//   border: none;
// }
// .el-menu-demo {
//   font-size: 16px;
// }
@media screen and (max-width: 768px) {
  .header-box {
    padding-top: 0;
  }
  .router-box {
    display: none;
  }
  .menu-button {
    display: block;
  }
}
</style>
<style>
/* .el-menu--horizontal > .el-menu-item {
  font-size: 16px;
} */
/* .el-dropdown-menu__item {
  text-align: center;
  width: 80px;
  padding: 0 0px !important;
}
.el-dropdown-menu__item--divided:before {
  margin: 0 !important;
} */
</style>