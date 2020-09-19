<template>
  <div class="pt-4">
    <div class="d-flex">
      <div class="avatar-box text-center">
        <img @click="lookUserInfo" v-if="avatarImg" :src="userInfo.avatarImg" alt="Mamba 曼巴" />
        <i v-else @click="lookUserInfo" class="iconfont icon-touxiang"></i>
        <p
          class="mt-2 avatar text-center fs-xl"
        >{{ userInfo.nickName ? userInfo.nickName : "雁过留名" }}</p>
      </div>
      <div class="flex-1">
        <el-input
          type="textarea"
          rows="4"
          v-model="messageObj.content"
          :placeholder="placeholder"
          maxlength="300"
        ></el-input>
        <div class="mt-3 d-flex jc-between position-emoji">
          <button @blur="showEmoji = false" class>
            <i
              class="iconfont icon-weixiao cur-p"
              @click="
                showBtn = true;
                showEmoji = !showEmoji;
              "
            ></i>
            <VEmojiPicker
              @focus="showEmoji = true"
              :showSearch="false"
              :emojisByRow="10"
              :emojiSize="30"
              class="emoji-picker"
              v-if="showEmoji"
              :pack="packData"
              @select="selectEmoji"
            />
          </button>
          <el-button type="primary" size="medium" :loading="btnLoading" @click="verifyHandle">发布</el-button>
        </div>
      </div>
    </div>
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible" width="300px" center>
      <div :class="{ turnAnima: false }">
        <form-input @toRequest="submit" :isUpload="false" :toForm="userForm"></form-input>
      </div>
    </el-dialog>
    <slide-verify v-if="isVerifyDialog" @close="closeSlideVerify" @success="successSlideVerify"></slide-verify>
    <!-- <textarea v-model="input"></textarea>
    <emoji-picker @emoji="insert" :search="search">
      <div slot="emoji-invoker" slot-scope="{ events: { click: clickEvent } }" @click.stop="clickEvent">
        <button type="button">open</button>
      </div>
      <div slot="emoji-picker" slot-scope="{ emojis, insert }">
        <div>
          <div>
            <input type="text" v-model="search">
          </div>
          <div>
            <div v-for="(emojiGroup, category) in emojis" :key="category">
              <h5>{{ category }}</h5>
              <div>
                <span
                  v-for="(emoji, emojiName) in emojiGroup"
                  :key="emojiName"
                  @click="insert(emoji)"
                  :title="emojiName"
                >{{ emoji }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </emoji-picker>-->
  </div>
</template>

<script>
// import EmojiPicker from '../EmojiPicker'
import { mapState, mapMutations } from "vuex";
import VEmojiPicker from "v-emoji-picker";
// import packData from 'v-emoji-picker/data/emojis.json';
import formInput from "./formInput";
import slideVerify from "../components/slideVerify/slideVerify";

export default {
  props: {
    model: String,
    type: String,
    blogsId: String,
    parentId: String,
    nickName: String,
    byAiteUserId: String,
    placeholder: String,
  },
  components: {
    // EmojiPicker,
    VEmojiPicker,
    formInput,
    slideVerify,
  },
  data() {
    return {
      isVerifyDialog: false,
      showBtn: false,
      showEmoji: false,
      btnLoading: false,
      input: "",
      search: "",
      packData: "",
      userInfo: {
        nickName: "",
        email: "",
        url: "",
        avatarImg: "",
        id: "",
      },
      dialogVisible: false,
      userForm: {
        nickName: "",
        email: "",
        url: "",
        avatarImg: "",
      },
      qqUrl: "https://q1.qlogo.cn/g?b=qq&nk=QQ号码&s=100",
      userRules: {
        nickName: { required: true, message: "必填", trigger: "change" },
        email: { required: true, message: "必填", trigger: "change" },
        url: { required: true, message: "必填", trigger: "change" },
      },
      messageObj: {
        nickName: "",
        avatarImg: "",
        content: "",
        relateBlogId: this.blogsId,
        parent: "",
        byAiteName: "",
      },
      timeCha: 60 * 60 * 1000, // 定义一个评论频繁，等待恢复的时间值, 与后端服务一致
      isTooManyRequest: false,
    };
  },
  created() {},
  beforeMount() {
    this.userInfo = localStorage.userInfo
      ? JSON.parse(localStorage.userInfo)
      : this.userInfo;
  },
  computed: {
    ...mapState(["map_user_info"]),
    avatarImg() {
      return this.userInfo.avatarImg;
    },
  },
  methods: {
    ...mapMutations(["map_set_user_info"]),
    closeSlideVerify() {
      this.isVerifyDialog = false;
      this.btnLoading = false;
    },
    successSlideVerify() {
      this.isVerifyDialog = false;
      this.fabuHandle();
    },
    lookUserInfo() {
      this.userForm = this.userInfo;
      this.dialogVisible = true;
    },
    async verifyHandle() {
      // 防灌水
      if (!localStorage.userInfo) {
        return (this.dialogVisible = true);
      }
      if (!this.messageObj.content) {
        return this.$message.warning("陈独秀，请发言");
      }
      let currentUser = await this.$axios.get(`/users/${this.userInfo._id}`);
      if (currentUser.isFind && !currentUser.isFind) {
        return this.$message.warning("你的用户信息有误, 请重新注册！");
      }
      if (currentUser.isSB) {
        return this.$message.warning("你已被列入黑名单, 禁止评论！");
      }

      // 如果这个isTooManyRequest为true，说明是禁止评论时间段，则直接 return 提示，不用走下面
      if (this.isTooManyRequest) {
        this.messageObj.content = "";
        return this.$message.warning("您评论过于频繁，请稍后再试！");
      }
      this.isVerifyDialog = true;
    },
    async fabuHandle() {
      this.btnLoading = true;
      this.messageObj.nickName = this.userInfo.nickName;
      this.messageObj.avatarImg = this.userInfo.avatarImg;
      this.messageObj.userId = this.userInfo._id;
      this.messageObj.parent =
        this.type == "children" ? this.parentId : "5e52a80981bf76430fd982f0";
      this.messageObj.byAiteName =
        this.type == "children" ? this.nickName : "coco";
      let url = this.model == "comments" ? "/comments" : "/messages";
      await this.$axios
        .post(url, this.messageObj)
        .then(async (res) => {
          this.$message({
            message: "发布成功，博主已收到消息，稍后回复",
            type: "success",
            duration: 2000,
          });
          this.$emit("toResponse");

          this.btnLoading = false;
          if (
            this.userInfo._id == "5e634fed4e0fed3f6e75864d" &&
            this.type == "children"
          ) {
            let byAiteObj = await this.$axios.get(
              `/users/${this.byAiteUserId}`
            );
            let replyObj = {
              recipient: byAiteObj.email,
              subject: this.messageObj.byAiteName,
              html: this.messageObj.content,
            };
            await this.$axios.post("/email", replyObj);
          } else {
            let toMeEmail = {
              recipient: "765992529@qq.com",
              subject: `Hello! Mamba ${this.messageObj.byAiteName} 给你发消息了，请回复！`,
              html: this.messageObj.content,
            };
            await this.$axios.post("/email", toMeEmail);
          }
          this.messageObj.content = "";
        })
        .catch((err) => {
          // console.log(err, err.response);
          if (err.response.status === 429) {
            this.isTooManyRequest = true;
            let limitTime = setInterval(() => {
              this.timeCha -= 1000;
              // 倒计时归零时， 清除定时器、 并归零评论次数, 以及恢复timeCha = 60000
              if (this.timeCha == 0) {
                clearInterval(limitTime);
                this.isTooManyRequest = false;
                this.timeCha = 60 * 60 * 1000;
              }
            }, 1000);
            this.messageObj.content = "";
          }
          this.btnLoading = false;
        });
    },
    async submit(userForm) {
      userForm.avatarImg = this.qqUrl.replace(
        "QQ号码",
        userForm.email.replace("@qq.com", "")
      );
      let resData;
      if (this.userInfo._id) {
        resData = await this.$axios.$put(
          `/users/${this.userInfo._id}`,
          userForm
        );
      } else {
        resData = await this.$axios.$post("/users", userForm);
      }
      this.map_set_user_info(resData);
      this.userInfo = resData;
      localStorage.userInfo = JSON.stringify(resData);
      this.dialogVisible = false;
    },
    selectEmoji(emoji) {
      // console.log(emoji);
      this.messageObj.content += emoji.data;
    },
    insert(emoji) {
      this.input += emoji;
    },
  },
};
</script>

<style lang="scss" scoped>
.emoji-picker {
  z-index: 1000;
}
.avatar-box {
  width: 80px;
  padding-right: 30px;
  img {
    cursor: pointer;
    width: 100%;
    height: auto;
    background-color: #4ebbaa;
    border-radius: 20%;
  }
  .icon-touxiang {
    font-size: 50px;
    color: #c4c4c4;
  }
}
.icon-biaoqing {
  font-size: 30px;
}
.position-emoji {
  transition: all 0.6s ease-in-out;
  position: relative;
  .emoji-picker {
    position: absolute;
    top: 40px;
    left: 0;
  }
}
.icon-weixiao {
  font-size: 26px;
  color: #c4c4c4;
  &:hover {
    color: #ffb929;
  }
}
@media screen and (max-width: 768px) {
  .avatar-box {
    width: 65px;
    padding-right: 15px;
  }
  .el-textarea__inner {
    height: 60px !important;
  }
}
@media screen and (max-width: 400px) {
  .avatar-box {
    width: 42px;
    padding-right: 10px;
    .icon-touxiang {
      font-size: 32px;
    }
  }
}
@media screen and (max-width: 375px) {
  .avatar-box {
    padding-right: 10px;
    .icon-touxiang {
      font-size: 32px;
    }
  }
}
</style>
<style lang="scss">
.container-emoji {
  height: 180px !important;
}
// grid-template-columns{repeat(15, 10%)}
@media screen and (max-width: 768px) {
  #EmojiPicker {
    width: 100% !important;
  }
  .el-textarea__inner {
    height: 80px !important;
  }
}
@media screen and (max-width: 375px) {
  // .el-textarea__inner{
  //   height: 80px!important;
  // }
}
</style>
