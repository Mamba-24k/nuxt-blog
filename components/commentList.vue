<template>
  <div class="comment-list fs-2xl">
    <div v-if="commentsList.length == 0" class="text-center fs-5xl">
      <strong>快来抢个沙发吧！</strong>
      <div class="mt-5">
        <img src="../assets/img/geyou.jpg" alt="Mamba 曼巴">
      </div>     
    </div>
    <div v-else v-for="(item, index) in commentsList" :key="index" class="py-4" :class="index>0 ? 'border-top' : ''">
      <div class="d-flex">
        <div class="avatar-one text-left">
          <img :src="item.avatarImg" alt="Mamba 曼巴" width="50" height="50" />
        </div>
        <div class="flex-1">
          <div class="d-flex ai-center">
            <strong class="col-less mr-4">{{item.nickName}}</strong>
            <span class="col-grey-4">
              <span class="fs-xl">{{item.createdAt | formatDate}}</span>
              <strong
                class="reply cur-p pl-4"
                @click="replyHandle(item,index,false)"
                v-if="item.userId != userInfo._id"
              >{{showReply ? '回复' : '回复'}}</strong>
            </span>
          </div>
          <div class="py-2">{{item.content}}</div>
          <div class="bg-orange-light px-4" :class="{'py-4' : item.children.length>0}">
            <div class v-for="(c, i) in item.children" :key="i">
              <div class="d-flex">
                <div class="mini-avatar text-left">
                  <img :src="c.avatarImg" alt="Mamba 曼巴avatar" width="30" height="30" />
                </div>
                <div class="flex-1">
                  <div class="mt-0">
                    <span>
                      <strong class="col-less mr-4">{{c.nickName}}</strong>
                    </span>
                    <span class="col-grey-4">
                      <span class="fs-xl">{{c.createdAt | formatDate}}</span>
                      <strong
                        class="reply cur-p pl-4"
                        @click="replyHandle(item,index,c)"
                        v-if="c.userId != userInfo._id"
                      >{{(showReply && commentIndex == index) ? '回复' : '回复'}}</strong>
                    </span>
                  </div>
                  <div class="py-2">
                    <!-- <i class="pl-3 pr-2">回复</i> -->
                    <span>
                      <span class="col-more">@{{c.byAiteName}}：</span>
                      {{c.content}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <comment-textarea
            @blur="showReply = false"
            :model="model"
            @toResponse="hideReply"
            type="children"
            :blogsId="blogsId"
            v-if="showReply && commentIndex == index"
            :parentId="item._id"
            :nickName="byAiteName"
            :byAiteUserId="byAiteUserId"           
            :placeholder='`@${placeholder}`'
          ></comment-textarea>
        </div>
      </div>
    </div>
    <el-drawer
      :title="`回复 ${byAiteName}`"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="ttb"
      custom-class="demo-drawer"
      ref="drawer"
      size="100%"
      >
      <div class="demo-drawer__content">
          <comment-textarea
            :model="model"
            @toResponse="hideReply"
            type="children"
            :blogsId="blogsId"
            :parentId="parentId"
            :nickName="byAiteName"
            :placeholder='`@${placeholder}`'
          ></comment-textarea>
      </div>
    </el-drawer>
    <!-- <div class="text-center">
      <el-pagination
        small
        background
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div> -->
  </div>
</template>

<script>
import dayjs from "dayjs";
import commentTextarea from "~/components/commentTextarea";
import { mapState } from "vuex";
export default {
  props: {
    blogsId: String,
    model: String,
    commentsList: Array
  },
  components: {
    commentTextarea
  },
  data() {
    return {
      placeholder: '',
      userInfo: '',
      showReply: false,
      dialog: false,
      loading: false,
      parentId: '',
      byAiteName: "",
      byAiteUserId: '',
      commentIndex: -1,
      total: 31,
      pageNum: 1,
      pageSize: 10,
      clientWidth: 10000,
    };
  },
  created() {

  },
  beforeMount() {
    this.clientWidth = document.body.clientWidth
        this.userInfo = (localStorage.userInfo &&
        JSON.parse(localStorage.userInfo)) || { _id: "" }
  },
  filters: {
    formatDate(val) {
      return dayjs(val).format("YYYY-MM-DD HH:MM:ss");
    }
  },
  computed: {
    ...mapState(["map_user_info"])
  },
  methods: {
    replyHandle(item, index, c) {
      this.placeholder = c ? c.nickName : item.nickName;
      this.commentIndex = index;    
      // this.showReply = !this.showReply
      this.parentId = item._id
      this.byAiteName = c ? c.nickName : item.nickName;
      this.byAiteUserId = c ? c.userId : item.userId;
      
      // 如果设备屏幕宽度<=375, 回复框使用弹出el-drawer
      if (this.clientWidth <= 450) {
        this.dialog = true
      } else {
        this.showReply = true;
      }
    },
    hideReply() {
      this.commentIndex = -1;
      this.dialog = false
      this.$emit("getCommentList");
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }, 
    handleClose(){
      this.dialog = false
    }
  }
};
</script>

<style lang="scss" scoped>
.min-height{
  min-height: 300px;
}
.comment-list {
  .avatar-one {
    padding-right: 30px;
    img {
      background-color: #4ebbaa;
      border-radius: 20%;
    }
  }
  .mini-avatar {
    padding-right: 10px;
    img {
      background-color: #4ebbaa;
      border-radius: 20%;
    }
  }
}
.reply {
  &:hover {
    color: var(--more);
    text-decoration: underline;
  }
}
@media screen and (max-width: 768px) {
  .comment-list {
    .avatar-one {
      padding-right: 15px;
    }
  }
}
@media screen and (max-width: 400px) {
  .comment-list {
    .avatar-one {
      padding-right: 10px;
      img {
        width: 32px;
        height: 32px;
      }
    }
    .mini-avatar {
      padding-right: 5px;
      img {
        width: 22px;
        height: 22px;
      }
    }
    .px-4{
      padding: 0 10px;
    }
    .py-4{
      padding-top: 10px;
      padding-bottom: 10px;
      // padding: 10px 0px;
    }
  }
}

</style>
<style>
.el-drawer__body {
  padding: 0 20px;
}
.el-drawer__header{
  margin-bottom: 10px!important;
}
.emoji-picker-icon {
  top: 95px;
}
</style>