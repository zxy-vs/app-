<template>
  <div>
    <div class="head">
      <header>
        <div class="logo">
          <img src="../assets/static/logo.png" alt="" />
        </div>
        <div class="search" @click="isSear = true">
          <van-icon color="#fff" name="search" size="0.6rem" />
        </div>
      </header>
      <transition
        enter-active-class="animate__animated animate__fadeInTopRight"
        leave-active-class="animate__animated animate__fadeOutTopRight"
        mode="out-in"
      >
        <Search v-show="isSear" :show="shows" />
      </transition>
    </div>
    <div class="visbli">
      <div class="class">
        <van-tabs
          class="tab"
          v-model="indexs"
          v-if="list.length"
          swipe-threshold="3"
        >
          <van-tab
            v-for="item in list"
            :key="item.id"
            :title="item.name"
            :name="item.id"
          >
            <van-pull-refresh
              v-model="isLoading"
              success-text="刷新成功"
              @refresh="onRefresh"
            >
              <van-list class="list" v-model="loading" @load="onLoad(item)">
                <van-cell v-for="items in item.list" :key="items.art_id">
                  <globalCom
                    :item="items"
                    :s="true"
                    @sp="
                      (id) =>
                        items.splice(
                          items.findIndex((v) => v.art_id === id),
                          1
                        )
                    "
                  />
                </van-cell>
              </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>
        <div slot="nav-right">
          <van-icon
            name="plus"
            class="add"
            size="20px"
            @click="isShow = true"
          />
        </div>
        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
          mode="out-in"
        >
          <Channel
            v-show="isShow"
            :show="show"
            :list="list"
            :indexss="indexss"
            @rm="reList"
            @add="addList"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Channel from "../components/channel.vue";
import Search from "../components/search.vue";
export default {
  data() {
    return {
      active: "",
      list: [],
      indexs: this.$store.state.indexs,
      isLoading: false,
      loading: false,
      isSear: false,
      pre_timestamp: "",
      nav: [
        { path: "/home", name: "首页", icon: "wap-home-o" },
        { path: "/question", name: "问答", icon: "comment-circle-o" },
        { path: "/video", name: "视频", icon: "video-o" },
        { path: "/me", name: "我的", icon: "manager-o" },
      ],
      isShow: false,
    };
  },
  methods: {
    async getTab() {
      await axios.get("/api/v1_0/user/channels").then((res) => {
        this.list = res.data.channels;
      });
    },
    async getTabC(id) {
      await axios
        .get(`/api/v1_0/articles?channel_id=${id}&timestamp=${+new Date()}`)
        .then((res) => {
          const index = this.list.findIndex((v) => v.id == id);
          this.$set(this.list[index], "list", res.data.results);
          this.$set(this.list[index], "pre_timestamp", res.data.pre_timestamp);
        });
    },

    reList(index) {
      this.list.splice(index, 1);
    },
    addList(item) {
      this.list.push(item);
    },
    show() {
      this.isShow = false;
    },
    shows() {
      this.isSear = false;
    },
    indexss(index) {
      this.indexs = index;
      this.isShow = false;
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.getTabC(this.indexs);
      }, 500);
    },
    async onLoad(item) {
      if (item.pre_timestamp != undefined) {
        await axios
          .get(
            `/api/v1_0/articles?channel_id=${item.id}&timestamp=${item.pre_timestamp}`
          )
          .then((res) => {
            item.list.push(...res.data.results);
            item.pre_timestamp = res.data.pre_timestamp;
          });
      }
      this.loading = false;
    },
  },
  created() {
    this.getTab();
    this.getTabC(this.indexs);
  },
  watch: {
    indexs() {
      this.getTabC(this.indexs);
      this.$store.state.indexs = this.indexs;
    },
  },
  filters: {
    time(num) {
      let nt = +new Date();
      let ot = +new Date(num);
      return parseInt((nt - ot) / 1000 / 60 / 60 / 24 / 365);
    },
  },
  components: { Channel, Search },
};
</script>

<style lang="less" scoped>
.head {
  width: 100%;
  height: 1.22667rem;
  header {
    z-index: 11;
    position: fixed;
    display: flex;
    width: 100%;
    height: 1.22667rem;
    background-color: #007bff;
    justify-content: space-between;
    .logo {
      height: 100%;
      line-height: 70px;
      img {
        height: 36px;
        margin: 0 16px;
      }
    }
    .search {
      width: 1.22667rem;
      height: 100%;
      line-height: 50px;
      i {
        margin: 0.34rem;
      }
    }
  }
}

.visbli {
  height: 1.17333rem;
  .class {
    z-index: 11;
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .tab {
      width: 100%;
      text-emphasis: none;
    }
    .add {
      z-index: 4;
      position: fixed;
      top: 1.22667rem;
      right: 0;
      width: 44px;
      height: 1.17333rem;
      padding-left: 0.333rem;
      line-height: 1.17333rem;
      background-color: #fff;
    }
    .list {
      height: 79vh;
      overflow-y: auto;
    }
  }
}
.van-cell {
  padding: 0;
}
</style>