<template>
  <div>
    <router-link :to="'/article/' + item.art_id" class="content">
      <div class="li_img">
        <span :class="item['cover']['type'] == 1 ? 'ce' : ''">{{
          item.title
        }}</span>
        <div v-if="item['cover']['type'] > 1">
          <img
            v-for="(items, indexs) of item['cover'].images"
            :key="indexs"
            :src="items"
            alt=""
          />
        </div>
        <img
          v-if="item['cover']['type'] == 1"
          :src="item['cover'].images[0]"
          alt=""
        />
      </div>
      <div class="li_txt">
        <span
          >作者 {{ item.aut_name }}&nbsp;&nbsp;{{
            item.comm_count
          }}
          评论&nbsp;&nbsp; 发布日期 {{ item.pubdate | time }} 年前</span
        ><i
          class="close"
          v-if="s"
          @click.stop.prevent="remove(item.art_id)"
        ></i>
      </div>
    </router-link>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect()"
    />
  </div>
</template>

<script>
export default {
  props: ["item", "s"],
  data() {
    return {
      show: false,
      id: "",
      actions: [{ name: "不感兴趣" }],
    };
  },
  
  filters: {
    time(num) {
      let nt = +new Date();
      let ot = +new Date(num);
      return parseInt((nt - ot) / 1000 / 60 / 60 / 24 / 365);
    },
  },
  methods: {
    remove(id) {
      this.show = true;
      this.id = id;
      // console.log(this.item);
    },
    async onSelect() {
      if (localStorage.getItem("token")) {
        await axios.post(
          "/api/v1_0/article/dislikes",
          { target: this.id },
          );
      }
      this.show = false;
      this.$emit("sp", this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0.26667rem 0.42667rem;
  overflow: hidden;
  color: #323233;
  font-size: 0.37333rem;
  line-height: 0.64rem;
  background-color: #fff;
  .li_txt {
    width: 100%;
    margin-top: 0.10667rem;
    color: #969799;
    font-size: 0.32rem;
    line-height: 0.48rem;
    span {
      display: inline-block;
    }
    .close {
      margin-top: 3px;
    }
  }
  .li_img {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    .ce {
      max-width: 67%;
    }
    img {
      width: 3.01333rem;
      height: 1.86667rem;
    }

    // background-color: #f8f8f8;
    // object-fit: cover;
  }
}
</style>