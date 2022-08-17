<template>
  <div class="cmt-item">
    <div class="head">
      <div class="l">
        <img :src="`${item.aut_photo}?param=40y40`" alt="" />
        <span>{{ item.aut_name }}</span>
      </div>
      <div class="r">
        <van-icon
          @click.stop="like(item)"
          v-show="item.is_liking"
          name="like"
          size="16px"
          color="red"
        />
        <van-icon
          @click.stop="like(item)"
          v-show="!item.is_liking"
          name="like-o"
          size="16px"
        />
      </div>
    </div>
    <div class="main">{{ item.content }}</div>
    <div class="foot">
      {{ time(item.pubdate) > 0 ? time(item.pubdate) + "天前" : "刚刚" }}
    <span v-if="call">回复</span>
   </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: ["item",'call'],
  methods: {
    time(num) {
      let o = +new Date(num);
      let n = +new Date();
      return parseInt((n - o) / 1000 / 60 / 60 / 24);
    },
    async like(item) {
      if (localStorage.getItem("token")) {
        if (item.is_liking) {
         await axios.delete(
            "/api/v1_0/comment/likings/"+item.com_id);
          item.is_liking = false;
        } else {
          await axios.post(
            "/api/v1_0/comment/likings",
            { target: item.com_id },);
          item.is_liking = true;
        }
      } else {
        Toast("请前去登录再来点赞吧");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cmt-item {
  padding: 0.4rem 0;
  border-top: 0.02667rem solid #f8f8f8;
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .l {
      display: flex;
      align-items: center;
      img {
        width: 1.06667rem;
        height: 1.06667rem;
        background-color: #f8f8f8;
        border-radius: 50%;
        margin-right: 0.4rem;
        background-size: cover;
      }
      span {
        font-size: 0.32rem;
      }
    }
  }
  .main {
    font-size: 0.37333rem;
    line-height: 0.74667rem;
    text-indent: 2em;
    margin-top: 0.16rem;
  }
  .foot {
    font-size: 0.32rem;
    color: grey;
    margin-top: 0.26667rem;
    span{
      float: right;
      margin-right: 15px;
      padding: 0 10px;
    }
  }
}
</style>