<template>
  <div>
    <page-box
      :isGrey="true"
      bgImg="headBgImg-1"
      :styleStr="`position: relative; width: 100%; height: 100vh; background-position: center; background-size: cover`"
    >
      <div slot="header" id="header" class="dialog-black d-flex flex-column jc-between">
        <div class="introduce d-flex ai-center">
          <div class="fs-9xl">
            <h2 :class="`m-0 textGrad-right`">{{vuex_skin_obj.headerUp}}</h2>
            <p :class="`m-0 text-indent textGrad-left`">{{vuex_skin_obj.headerDown}}</p>
          </div>
        </div>
        <div class="arrow-down d-flex flex-column ai-center">
          <i class="iconfont icon-down" @click="downPage"></i>
        </div>

      </div>
      <div slot="section">
        <div class>
          <div class="container fs-3xl text-center">
            <p class="fs-8xl mt-0">博客尝试使用如下技术/工具构建</p>
            <div class="language d-flex">
              <div class="flex-1 language-left border-right-2 text-right">
                <div class="title">前端</div>
                <div class="title">后端</div>
                <div class="title">数据库</div>
                <div class="title">服务器</div>
                <div class="title">工具</div>
              </div>
              <div v-show="showImg" class="language-right text-left">
                <div>
                  <i class="sprites-js mr-3"></i>
                  <i class="sprites-vue"></i>
                  <!-- <img class="mr-3" src="../../assets/img/js.jpg" alt='Mamba 曼巴' />
                  <img src="../../assets/img/vue.png" alt='Mamba 曼巴' /> -->
                </div>
                <div>
                  <i class="sprites-node"></i>
                  <!-- <img src="../../assets/img/node.png" alt='Mamba 曼巴' /> -->
                </div>
                <div>
                  <i class="sprites-mongodb"></i>
                  <!-- <img src="../../assets/img/mongodb.jpg" alt='Mamba 曼巴' /> -->
                </div>
                <div>
                  <i class="sprites-nginx"></i>
                  <!-- <img src="../../assets/img/nginx.jpg" alt='Mamba 曼巴' /> -->
                </div>
                <div>
                  <i class="sprites-vscode mr-3"></i>
                  <i class="sprites-git"></i>
                  <!-- <img class="mr-3" src="../../assets/img/vscode.jpg" alt='Mamba 曼巴' />
                  <img src="../../assets/img/git.jpg" alt='Mamba 曼巴' /> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </page-box>
    <div class="countTime bg-white">
      <div class="d-flex jc-center">
        <div class="d-flex jc-center time-box ai-center" v-show="showTime">
          <div>{{this.timeObj.day}}</div>天
          <div>{{this.timeObj.hour}}</div>时
          <div>{{this.timeObj.minute}}</div>分
          <div>{{this.timeObj.second}}</div>秒
        </div>
      </div>
      <p class="fs-3xl mb-0 text-center col-black">从2020年3月5日00:00开始</p>
    </div>
  </div>
</template>

<script>
import pageBox from '~/components/pageBox'
import $ from "jquery";
import dayjs from "dayjs";
import {mapState} from 'vuex'

export default {
  scrollToTop: true,
  // transition: 'page',
  components: {
    pageBox,
  },
  async asyncData({ $axios }) {
    const data = await $axios.$get('/time')
    return { currentTime: data.data}
  },
  mounted() {
    window.addEventListener("scroll", this.scrollImg);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollImg);
  },
  data() {
    return {
      startTime: 1583337600000,
      showImg: false,
      timeCha: "",
      timeObj: {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      },
      showTime: false,
      intTime: null
    };
  },
  head () {
    return {
      title: 'Mamba 曼巴 博客网站主页',
      meta: [
        { hid: 'page', name: 'description', content: '这里是博客主页, 展示了博客技术架构以及博客的出生日期、年龄' }
      ]
    }
  },
  created() {
    this.getTime();
  },
  beforeMount() {
  },
  beforeDestroy() {  
    clearInterval(this.intTime);
  },
  computed: {
    ...mapState(['vuex_skin_obj'])
  },
  methods: {
    async getTime() {
      this.timeCha = this.currentTime - this.startTime;
      this.getCountTime(this.timeCha);
      this.intTime = setInterval(() => {
        this.timeCha += 1000;
        this.getCountTime(this.timeCha);
      }, 1000);
    },
    // 将倒计的时间戳换算成天、时、分、秒
    getCountTime(time) {
      let countTime = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      };
      countTime.day = Math.floor(time / (24 * 60 * 60 * 1000));
      countTime.hour = Math.floor(
        (time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      countTime.minute = Math.floor(
        ((time % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000)
      );
      countTime.second = Math.floor(
        (((time % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) % (60 * 1000)) /
          1000
      );
      this.$nextTick(() => {
        this.timeObj = countTime;
        this.showTime = true;
      });
    },
    downPage() {
      this.showImg = true
      $("html,body").animate({ scrollTop: $('#header').outerHeight() - 60 }, 500);
    },
    scrollImg() {
      this.showImg = true
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-black {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.introduce {
  width: 90%;
  height: 70%;
  margin: 0 auto;
  max-width: 1800px;
}
.arrow-down{
  padding-bottom: 10px;
  color: #fff;
  .icon-down{
    cursor: pointer;
    animation: arrowDown .8s linear infinite alternate;
    font-size: 60px;
  }
}
@keyframes arrowDown {
  0% {
    visibility: hidden;
    opacity: 0;
    -webkit-transform: translatey(-20%);
  }
  20% {
    visibility: visible;
    opacity: 0;
    -webkit-transform: translatey(10%);
  }
  100% {
    visibility: visible;
    opacity: 1;
    -webkit-transform: translatey(20%);
  }
}
.language-left,
.language-right {
  & > div {
    // background-color: #fff;
    margin: 20px 0px;
    // padding: 15px;
    // border: 2px solid #ffb929;
    img {
      height: 100px;
    }
    i{
      display: inline-block;
      height: 100px;
    }
    .sprites-js{
      width: 100px;
      background: url('~assets/img/sprites.jpeg') -447px -100px;
    }
    .sprites-vue{
      width: 100px;
      background: url('~assets/img/sprites.jpeg') -338px -200px;
    }
    .sprites-node{
      width: 333px;
      background: url('~assets/img/sprites.jpeg') -0 -100px;
    }
    .sprites-nginx{
      width: 308px;
      background: url('~assets/img/sprites.jpeg')  -0 -200px;
    }
    .sprites-mongodb{
      width: 338px;
      background: url('~assets/img/sprites.jpeg') -0 -0;
    }
    .sprites-vscode{
      width: 109px;
      background: url('~assets/img/sprites.jpeg') -338px -100px;
    }
    .sprites-git{
      width: 228px;
      background: url('~assets/img/sprites.jpeg') -338px -0;
    }
  }
  .title {
    font-size: 18px;
    height: 104px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.language-left {
  padding-right: 50px;
  & > div {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      right: -61px;
      top: 42px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--more);
      border: 4px solid var(--less);
    }
  }
}
.language-right {
  flex: 1.5;
  padding-left: 50px;
}
.countTime {
  padding: 50px 0;
}
.time-box {
  font-size: 18px;
  position: relative;
  & > div {
    min-width: 48px;
    height: 48px;
    padding: 0 5px;
    background-color: var(--less);
    margin: 0 5px;
    color: var(--more);
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    line-height: 48px;
  }
  &:before {
    position: absolute;
    top: 25px;
    left: -150px;
    font-size: 14px;
    text-align: center;
    padding-top: 5px;
    content: "累计运行";
    width: 120px;
    border-top: 1px solid #7b7b7b;
  }
  &:after {
    position: absolute;
    top: 25px;
    right: -150px;
    font-size: 14px;
    text-align: center;
    padding-top: 5px;
    content: "到现在";
    width: 120px;
    border-top: 1px solid #7b7b7b;
  }
}
@media screen and (max-width: 768px) {
  .fs-8xl {
    font-size: 20px;
  }
  .language-left,
  .language-right {
    & > div {
      margin: 10px 0px;
      img {
        height: 60px;
      }
    i{
      height: 60px;
    }
    .sprites-js{
      width: 60px;
      background: url('~assets/img/minsprites.jpeg') -268px -60px;
    }
    .sprites-vue{
      width: 60px;
      background: url('~assets/img/minsprites.jpeg') -203px -120px;
    }
    .sprites-node{
      width: 200px;
      background: url('~assets/img/minsprites.jpeg')  -0 -60px;
    }
    .sprites-mongodb{
      width: 202px;
      background: url('~assets/img/minsprites.jpeg') -0 -0;
    }
    .sprites-nginx{
      width: 185px;
      background: url('~assets/img/minsprites.jpeg')  -0 -120px;
    }
    .sprites-vscode{
      width: 65px;
      background: url('~assets/img/minsprites.jpeg') -203px -60px;
    }
    .sprites-git{
      width: 136px;
      background: url('~assets/img/minsprites.jpeg') -203px -0;
    }
    }
    .title {
      height: 64px;
    }
  }
  .language-right {
    flex: 3;
    padding-left: 20px;
  }
  .language-left {
    padding-right: 20px;
    & > div {
      position: relative;
      &:after {
        content: "";
        position: absolute;
        right: -31px;
        top: 22px;
      }
    }
  }
  .time-box {
    & > div {
    }
    &:before {
      display: none;
    }
    &:after {
      display: none;
    }
  }
}
</style>