<template>
  <div>
  
    <router-view></router-view>
    <div class="home_nav">
      <nav v-if="nav.length">
        <router-link :to="item.path" v-for="(item, index) of nav" :key="index">
          <van-icon :name="item.icon" size="24px" />
          <div class="nav_txt">{{ item.name }}</div>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            nav: [
                { path: "/home", name: "首页", icon: "wap-home-o" },
                { path: "/question", name: "问答", icon: "comment-circle-o" },
                { path: "/video", name: "视频", icon: "video-o" },
                { path: "/me", name: "我的", icon: "manager-o" },
            ]
        };
    },
};
</script>

<style lang="less" scoped>


.home_nav {
  width: 100%;
  height: 50px;
  nav {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 1.333rem;
    height: 1.333rem;
    justify-content: space-around;
    background-color: #fff;
    a {
      display: flex;
      color: #737674;
      flex-direction: column;
      font-size: 10px;
      height: 24px;
      margin-top: 6px;
      .nav_txt {
        height: 12px;
        line-height: 16px;
      }
      &.router-link-active {
        color: #4289ff;
      }
    }
  }
}
</style>