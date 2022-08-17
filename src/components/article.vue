<template>
  <div class="article">
    <div class="atit">
      <div class="aicon">
        <span> 文章详情 </span>
        <van-icon class="left" name="arrow-left" @click="$router.go(-1)" />
      </div>
    </div>
    <h1>{{ article.title }}</h1>
    <div class="author">
      <div class="title">
        <img :src="article.aut_photo" width="60" height="60" alt="" />
        <div>
          <p>{{ article.aut_name }}</p>
          <p class="hu">{{ article.pubdate | time }} 年前</p>
        </div>
      </div>
      <div class="value">
        <van-button
          size="mini"
          plain
          icon="plus"
          type="primary"
          @click="plus(article)"
          v-show="!article.is_followed"
          >关注</van-button
        >
        <van-button
          size="mini"
          icon="plus"
          type="primary"
          @click="plus(article)"
          v-show="article.is_followed"
          >已关注</van-button
        >
      </div>
    </div>
    <van-divider />
    <div v-html="article.content" class="ac" @click="isShow = false"></div>
    <van-divider>End</van-divider>
    <div class="goodjob" @click="pluss(article)">
      <van-button
        icon="good-job-o"
        plain
        color="red"
        type="warning"
        v-show="article.attitude <= 0"
        >点赞</van-button
      >
      <van-button
        icon="good-job-o"
        color="red"
        type="warning"
        v-show="article.attitude > 0"
        >已点赞</van-button
      >
    </div>
    <van-list
      v-if="list.length"
      class="comment"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        clickable
        @click="call(item)"
      >
        <global-com-1 :item="item" :call="true" />
      </van-cell>
    </van-list>

    <div class="foot">
      <div class="write" v-show="!isShow">
        <div class="ipt" @click="wr">发表评论</div>
        <div class="icon-box">
          <van-badge :content="200" max="99">
            <van-icon class="child" size="20px" name="comment-o" />
          </van-badge>
          <van-icon
            name="good-job-o"
            @click="pluss(article)"
            size="20px"
            v-show="article.attitude <= 0"
          />
          <van-icon
            name="good-job"
            color="red"
            @click="pluss(article)"
            size="20px"
             v-show="article.attitude > 0"
          />
          <van-icon
            name="star-o"
            @click="plusss(article)"
            size="20px"
            v-show="!article.is_collected"
          />
          <van-icon
            name="star"
            @click="plusss(article)"
            color="yellow"
            v-show="article.is_collected"
            size="20px"
          />
          <van-icon name="share-o" size="20px" />
        </div>
      </div>
      <div class="writes" v-show="isShow">
        <textarea
          ref="focu"
          placeholder="友善言辞，理性发言，阳光心灵"
          v-model.trim="txt"
          autofocus
          @blur="isShow = false"
        ></textarea>
        <button @click.prevent.stop="fa()" :class="txt.length ? 'color' : ''">
          发布
        </button>
      </div>
    </div>
    <van-popup
      v-model="isShows"
      position="bottom"
      :style="{ height: '100%' }"
      @open="getLists(items.com_id)"
    >
      <Comments :list="lists" :item="items" @shows="(is) => (isShows = is)" />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import globalCom1 from "../globalCom/globalCom1.vue";
import Comments from "./comments.vue";
export default {
  components: { globalCom1, Comments },
  data() {
    return {
      article: {},
      id: this.$route.params.id || 0,
      list: [],
      lists: [],
      end: 0,
      sum: 0,
      loading: false,
      finished: false,
      time: null,
      isShow: false,
      items: {},
      isShows: false,
      show: false,
      txt: "",
    };
  },

  methods: {
    getArt(id) {
      axios.get(`/api/v1_0/articles/${id}`).then((res) => {
        this.article = res.data;
      });
    },
    getComment(id, offset) {
      if (offset) {
        axios
          .get(`/api/v1_0/comments?type=a&source=${id}&offset=${offset}`)
          .then((res) => {
            this.end = res.data.last_id;
            this.list.push(...res.data.results);
          });
      } else {
        axios.get(`/api/v1_0/comments?type=a&source=${id}`).then((res) => {
          this.sum = res.data.total_count;
          this.end = res.data.last_id;
          this.list.push(...res.data.results);
        });
      }
    },
    onLoad() {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        // 加载状态结束
        this.getComment(this.id, this.end);
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= this.sum) {
          this.finished = true;
        }
      }, 1000);
    },
    async wr() {
      this.isShow = true;
      await this.$nextTick();
      this.$refs.focu.focus();
    },
    async fa() {
      if (this.txt.length && localStorage.getItem("token")) {
        let {
          data: { new_obj },
        } = await axios.post("/api/v1_0/comments", {
          target: this.id,
          content: this.txt,
        });
        this.txt = "";
        this.list.unshift(new_obj);
      } else {
        Toast("请前去登录再来评论吧");
      }
      this.isShow = false;
    },
    async plus(item) {
      if (localStorage.getItem("token")) {
        if (item.is_followed) {
          await axios.delete("/api/v1_0/user/followings/" + item.aut_id);
          item.is_followed = false;
        } else {
          await axios.post("/api/v1_0/user/followings", {
            target: item.aut_id,
          });
          item.is_followed = true;
        }
      } else {
        Toast("请前去登录再来关注吧");
      }
    },
    async pluss(item) {
      if (localStorage.getItem("token")) {
        if (item.attitude > 0) {
          await axios.delete("/api/v1_0/article/likings/" + item.art_id);
          item.attitude = -1;
        } else {
          await axios.post("/api/v1_0/article/likings", {
            target: item.art_id,
          });
          item.attitude = 1;
        }
      } else {
        Toast("请前去登录再来关注吧");
      }
    },
    async plusss(item) {
      if (localStorage.getItem("token")) {
        if (item.is_collected) {
          await axios.delete("/api/v1_0/article/collections/" + item.art_id);
          item.is_collected = false;
        } else {
          await axios.post("/api/v1_0/article/collections", {
            target: item.art_id,
          });
          item.is_collected = true;
        }
      } else {
        Toast("请前去登录再来关注吧");
      }
    },
    call(item) {
      this.isShows = true;
      this.items = item;
    },
    getLists(com_id) {
      axios.get(`/api/v1_0/comments?type=c&source=${com_id}`).then((res) => {
        this.lists = res.data.results;
      });
    },
  },
  created() {
    this.getArt(this.id);
    this.getComment(this.id, this.end);
  },
  watch: {
    id() {
      if (this.id) {
        this.getArt(this.id);
        this.getComment(this.id, this.end);
      }
    },
  },
  filters: {
    time(num) {
      let nt = +new Date();
      let ot = +new Date(num);
      return parseInt((nt - ot) / 1000 / 60 / 60 / 24 / 365);
    },
  },
  beforeDestroy() {
    this.list = [];
  },
};
</script>

<style lang="less" scoped>
.article {
  padding: 0.26667rem;
  margin-top: 1.22667rem;
  .atit {
    z-index: 11;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.22667rem;
    font-size: 16px;
    line-height: 1.22667rem;
    text-align: center;
    color: #fff;
    background-color: #007bff;
    padding: 0;
    .left {
      float: left;
      line-height: 1.22667rem;
      color: #fff;
      padding: 0 0.42667rem;
    }
    span {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .ac {
    font-size: 0.32rem;
    line-height: 0.64rem;
    width: 100%;
    overflow-x: scroll;
    word-break: break-all;
  }
  h1 {
    font-size: 0.42667rem;
    font-weight: 700;
    margin: 0.26667rem 0;
  }
  .author {
    display: flex;
    white-space: nowrap;
    padding: 0.13333rem 0;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    color: #323233;
    font-size: 0.37333rem;
    line-height: 0.64rem;
    background-color: #fff;
    .title {
      display: flex;
      align-content: space-between;
      img {
        margin-right: 10px;
      }
      p {
        margin: 0;
        padding: 0;
        line-height: 30px;
      }
      .hu {
        color: #969799;
        font-size: 0.32rem;
      }
    }
    .value {
      width: 2rem;
      height: 0.8rem;
      line-height: 0.8rem;
      white-space: nowrap;
    }
  }
}
/deep/ .hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #444;
  background: #f0f0f0;
}
.ac /deep/ img {
  width: 94.5vw;
  overflow: hidden;
  margin: 0 auto;
}
.goodjob {
  text-align: center;
  margin-bottom: 0.6rem;
}
.comment {
  li {
    padding: 0.4rem 0;
  }
}
.foot {
  height: 1.22667rem;
  .write {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.22667rem;
    line-height: 1.22667rem;
    padding-left: 0.26667rem;
    .ipt {
      flex: 1;
      border: 0.02667rem solid #efefef;
      border-radius: 0.4rem;
      height: 0.8rem;
      font-size: 0.32rem;
      line-height: 0.8rem;
      margin-left: 0.26667rem;
      background-color: #f8f8f8;
      text-align: center;
    }
    .icon-box {
      width: 50%;
      display: flex;
      justify-content: space-evenly;
      line-height: 0;
    }
  }
  .writes {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.13333rem;
    line-height: 1.22667rem;
    padding-left: 0.26667rem;
    textarea {
      resize: none;
      width: 83%;
      border-radius: 8px;
      overflow: hidden;
      height: 80%;
      line-height: 14px;
      font-size: 12px;
      padding-left: 0.26667rem;
      border: 0.02667rem solid #efefef;
      background-color: #f8f8f8;
    }
    button {
      font-size: 16px;
      border: 0;
      color: #ccc;
      margin: auto;
      background-color: #fff;
    }
    .color {
      color: black;
    }
  }
}
</style>