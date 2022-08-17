<template>
  <div class="sear">
    <div class="sear_head">
      <div class="icon">
        <van-icon name="arrow-left" color="#fff" @click="$router.go(-1)" />
      </div>
      <div class="title">搜索结果</div>
    </div>
    <van-pull-refresh v-model="isloading" @refresh="onRefresh">
      <van-list
        v-if="list.length"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item.art_id">
          <globalCom :item="item" s="false" />
        </van-cell>
      </van-list>
    </van-pull-refresh>

    <div class="sear_foot" v-if="!this.list.length">没有更多了</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      page: 1,
      per_page: 1,
      loading: false, //加载结束
      isloading: false, //加载结束
      finished: false, //没有更多了
      time: null,
    };
  },
  methods: {
    async getList(id, page) {
      if (this.per_page >= 1 && this.per_page >= page) {
        await axios.get(`/api/v1_0/search?q=${id}&page=${page}`).then((res) => {
          this.page = res.data.page;
          this.per_page = res.data.per_page;
          this.list.push(...res.data.results);
        });
      }
    },
    onLoad() {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        if (this.page <= this.per_page) {
          this.page++;
          this.getList(this.$route.params.id, this.page);
          this.loading = false;
        } else {
          this.loading = false;
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.$router.go();
      }, 500);
    },
  },
  created() {
    this.getList(this.$route.params.id, this.page);
  },
  beforeDestroy() {
    this.list = [];
    clearTimeout(this.time);
  },
};
</script>

<style lang="less" scoped>
.sear {
  margin-top: 1.22667rem;
  .sear_head {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    // position: relative;
    display: flex;
    align-items: center;
    height: 1.22667rem;
    line-height: 0.58667rem;
    text-align: center;
    background-color: #007bff;
    .icon {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding: 0 0.42667rem;
      font-size: 0.37333rem;
      cursor: pointer;
    }
    .title {
      max-width: 60%;
      margin: 0 auto;
      color: #fff;
      font-weight: 500;
      font-size: 0.42667rem;
    }
  }
  .sear_foot {
    color: #969799;
    font-size: 0.37333rem;
    line-height: 1.33333rem;
    text-align: center;
  }
  .van-cell {
    padding: 0;
  }
}
</style>