<template>
  <div>
    <div class="atit">
      <div class="aicon">
        <span> 评论详情 </span>
        <van-icon
          class="left"
          name="arrow-left"
          @click="esc"
        />
      </div>
    </div>
    <div
      class="maint"
      @click="isShow = false"
      :style="{ marginBottom: isShow ? '80px' : '50px' }"
    >
      <GlobalCom1 :item="item" :call="false" />
      <van-divider style="margin: 0">回复</van-divider>
      <GlobalCom1
        v-for="items of list"
        :key="items.com_id"
        :item="items"
        :call="false"
      />
      <div class="none">没有更多了...</div>
    </div>
    <div class="foot" @click="wr">回复评论</div>
    <div class="writes" v-show="isShow">
      <textarea
        ref="focu"
        placeholder="友善言辞，理性发言，阳光心灵"
        v-model.trim="txt"
        autofocus
      ></textarea>
      <button @click.prevent.stop="fa()" :class="txt.length ? 'color' : ''">
        发布
      </button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import GlobalCom1 from "../globalCom/globalCom1.vue";
export default {
  components: { GlobalCom1 },
  props: ["item",'list'],
  data() {
    return {
      com: {},
      isShow: false,
      txt: "",
    };
  },
  methods: {
    time(num) {
      let o = +new Date(num);
      let n = +new Date();
      return parseInt((n - o) / 1000 / 60 / 60 / 24);
    },
    async fa() {
      if (this.txt.length && localStorage.getItem("token")) {
        let {
          data: { new_obj: new_obj },
        } = await axios.post("/api/v1_0/comments", {
          target: this.item.com_id,
          content: this.txt,
          art_id: "8163",
        });
        this.txt = "";
        this.list.unshift(new_obj);
      } else {
        Toast("请前去登录再来评论吧");
      }
      this.isShow = false;
    },
    async wr() {
      this.isShow = true;
      await this.$nextTick();
      this.$refs.focu.focus();
    },
    esc(){
      this.$emit('shows', false)
    }
  },
};
</script>

<style lang="less" scoped>
.atit {
  z-index: 1;
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
.maint {
  margin-top: 46px;
  background-color: #fff;
  padding: 0.4rem 0.42667rem;
  // height: 100vh-46px-80px;
  overflow-y: auto;
  .none {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #ccc;
    text-align: center;
  }
}
.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  font-size: 18px;
  line-height: 50px;
  text-align: center;
  background-color: #f8f8f8;
  border-top: 1px solid #efefef;
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
</style>