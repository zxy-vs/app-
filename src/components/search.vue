<template>
  <div class="search">
    <div class="search_content">
      <van-icon class="back" name="arrow-left" color="#fff" @click="show" />
      <div class="s_c">
        <div class="icon">
          <van-icon name="search" size="24px" />
        </div>
        <input
          type="text"
          placeholder="请输入搜索关键词"
          v-model.trim="text"
          @keyup.13="jump(text)"
        />
      </div>
    </div>
    <div class="sugg_list" v-if="list.length">
      <div
        class="sugg_item"
        v-for="(item, index) of list"
        :key="index"
        v-html="item"
        @click="jump(item)"
      ></div>
    </div>
    <div class="search_his">
      <div class="his_cell">
        <span>搜索历史</span>
        <van-icon name="delete-o" size="24" @click="rm" />
      </div>
      <div class="his_list" v-if="listKey.length">
        <span
          class="history-item"
          @click="$router.push('/searchs/' + item)"
          v-for="(item, index) of listKey"
          :key="index"
          >{{ item }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["show"],
  data() {
    return {
      text: "",
      list: [],
      listKey: this.$store.state.listKey,
    };
  },
  methods: {
    getList(id = 0) {
      if (id) {
        axios
          .get("/api/v1_0/suggestion?q=" + id)
          .then((res) => {
            this.list = res.data.options;
            const test = new RegExp(id, "g");
            this.list = this.list
              .join(",")
              .replace(test, `<span style="color:red;">${id}</span>`)
              .split(",");
          });
      } else {
        this.list = [];
      }
    },
    jump(text) {
      if (this.text.length) {
        this.listKey.push(this.text);
        this.listKey = [...new Set(this.listKey)];
        this.$store.state.listKey = this.listKey;
        text = text
          .replace(/<span style="color:red;">/g, "")
          .replace(/<\/span>/g, "");
        this.$router.push("/searchs/" + text);
      }
    },
    rm() {
      this.listKey = [];
      this.$store.state.listKey = [];
    },
  },
  watch: {
    text() {
      this.getList(this.text);
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  z-index: 12;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  .search_content {
    width: 100vw;
    height: 1.22667rem;
    display: flex;
    justify-content: space-between;
    padding-right: 0.2rem;
    align-items: center;
    background-color: #007bff;
    overflow: hidden;
    .s_c {
      display: flex;

      width: 80%;
      height: 80%;
      line-height: 80%;
      background-color: #fff;
      border-radius: 8px;
      .icon {
        width: 10%;
        margin: 6px 7px;
        border-right: 1px solid #eee;
      }
      input {
        width: 80%;
        border: 0;
        font-size: 16px;
      }
    }
    .back {
      margin-left: 0.25rem;
    }
  }
  .sugg_list {
    .sugg_item {
      padding: 0 0.4rem;
      border-bottom: 0.02667rem solid #f8f8f8;
      font-size: 0.37333rem;
      line-height: 1.33333rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .search_his {
    .his_cell {
      display: flex;
      justify-content: space-between;
      padding: 0.26667rem 0.42667rem;
      overflow: hidden;
      color: #323233;
      font-size: 0.37333rem;
      line-height: 0.64rem;
      border-bottom: 1px solid #eee;
    }
    .his_list {
      padding: 0 0.26667rem;
      .history-item {
        display: inline-block;
        font-size: 0.32rem;
        padding: 0.21333rem 0.37333rem;
        background-color: #efefef;
        margin: 0.26667rem 0.21333rem 0 0.21333rem;
        border-radius: 0.26667rem;
      }
    }
  }
}
</style>