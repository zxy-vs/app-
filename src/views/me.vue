<template>
  <div class="me">
    <div class="me_bgc">
      <van-image
        round
        fit="fill"
        width="1.8rem"
        height="1.8rem"
        :src="me.photo ? me.photo : require('../assets/static/mobile.png')"
      />
      <div class="lr" v-if="!me.name">
        <router-link to="/login">登陆</router-link>&nbsp;
        <router-link to="path">注册</router-link>
      </div>
      <div class="lr" v-else>{{ me.name }}</div>
    </div>
    <van-grid :column-num="2">
      <van-grid-item icon="star-o" color="#ffa229" text="收藏" />
      <van-grid-item icon="underway-o" color="#ffa229" text="历史" />
    </van-grid>
    <div class="me_qt" v-if="me.id">
      <div class="act">
        <p>{{ me.art_count }}</p>
        <p>动态</p>
      </div>
      <div class="follow">
        <p>{{ me.follow_count }}</p>
        <p>关注</p>
      </div>
      <div class="followers">
        <p>{{ me.fans_count }}</p>
        <p>粉丝</p>
      </div>
    </div>
    <van-cell title="编辑资料" is-link to="/edit" v-if="me.id" />
    <van-cell title="小志同学" is-link />
    <van-cell title="退出登录" v-if="me.id" is-link @click="esc" />
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      me: {},
    };
  },
  computed: {
  },
  methods: {
    getMe() {
      axios
        .get("/api/v1_0/user")
        .then((res) => {
          this.me = res.data;
        })
        .catch((err) => {
          console.log("请重新登录");      
        });
    },
    esc() {
      Dialog.confirm({
        message: "是否退出登录",
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.go();
        })
        .catch(() => {});
    },
  },
  created() {
    this.getMe();
  },
};
</script>

<style lang="less" scoped>
.me {
  width: 100vw;
  height: 92vh;
  background-color: #f5f7f9;
  .me_bgc {
    position: relative;
    width: 100%;
    height: 5.5rem;
    color: #f5f7f9;
    background: url("../assets/static/banner.png");
    .lr {
      position: absolute;
      top: 76%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 18px;
      vertical-align: middle;
      a {
        color: #f5f7f9;
      }
    }
  }
  .van-grid {
    height: 1.67rem;
    margin-bottom: 1rem;
  }
  .me_qt {
    height: 1.67rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    background-color: #fff;
    p {
      margin: 0;
      line-height: 20px;
      font-size: 14px;
    }
  }
  .van-cell {
    height: 1.36rem;
  }
  .van-image {
    margin: 1.95rem 4.06rem;
  }
}
</style>