<template>
  <div class="channel">
    <div class="title">
      频道管理
      <van-icon name="cross" class="cross" @click="show" />
    </div>
    <div class="ch_c">
      <div class="ch_has">
        <div class="has">
          <span class="bold"
            >已添加频道：
            <span class="gray">点击{{ isShow ? "进入" : "移除" }}频道</span>
          </span>
          <span class="edit" @click="isShow = !isShow">{{
            isShow ? "编辑" : "完成"
          }}</span>
        </div>
        <div class="has_btn">
          <div
            class="btns"
            v-for="item of list"
            :key="item.id"
            @click="indexss(item.id)"
          >
            {{ item.name }}
            <i
              v-if="item.id !== 0 && list.length > 2"
              v-show="!isShow"
              class="close"
              @click.stop.prevent="remove(item.id)"
            ></i>
          </div>
        </div>
      </div>
      <van-divider />
      <div class="ch_has">
        <div class="has">
          <span class="bold"
            >可添加频道：
            <span class="gray">点击添加频道</span>
          </span>
        </div>
        <div class="has_btn">
          <div
            class="btns"
            v-for="item of listc"
            :key="item.seq"
            @click="add(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list", "show", "indexss"],
  data() {
    return {
      isShow: true,
      listc: [],
      jieliu: true,
      time: null,
      jl: [],
    };
  },
  methods: {
    async getList() {
      const list = [];
      const all = await axios.get("/api/v1_0/channels");
      all.data.channels.forEach((v) => {
        if (!this.list.some((vs) => v.id === vs.id)) {
          list.push(v);
        }
      });
      this.listc = list;
    },
    async remove(id) {
      const i = this.list.findIndex((v) => v.id === id);
      this.jl.splice(i, 1);
      await axios.put("/api/v1_0/user/channels", { channels: this.jl });
      this.$emit("rm", i);
    },
    add(item) {
      if (this.jieliu) {
        clearTimeout(this.time);
        this.time = setTimeout(async () => {
          this.jl.push({ id: item.id, seq: this.jl[this.jl.length] });
          await axios.put("/api/v1_0/user/channels", { channels: this.jl });

          this.$emit("add", item);
          this.jieliu = true;
        }, 200);
      }
      this.jieliu = false;
    },
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    clearTimeout(this.time);
  },
  watch: {
    list: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.channel {
  z-index: 4;
  position: fixed;
  top: 0;
  height: 0;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  .title {
    width: 100%;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background-color: #007bff;
    .cross {
      position: fixed;
      top: 15px;
      right: 15px;
    }
  }
  .ch_c {
    padding: 0.21333rem;
    .ch_has {
      .has {
        display: flex;
        font-size: 0.37333rem;
        line-height: 0.74667rem;
        justify-content: space-between;
        .bold {
          font-weight: 700;
          .gray {
            color: grey;
            font-size: 0.32rem;
          }
        }
        .edit {
          border: 0.02667rem solid #a3a2a2;
          padding: 0 0.26667rem;
          line-height: 0.53333rem;
          height: 0.53333rem;
          border-radius: 0.16rem;
          font-size: 0.32rem;
          margin-top: 5px;
        }
      }
      .has_btn {
        color: black;
        .btns {
          float: left;
          width: 21%;
          min-height: 0.02667rem;
          font-size: 0.32rem;
          text-align: center;
          line-height: 0.96rem;
          background-color: #fafafa;
          border: 1px solid #eee;
          margin: 0.16rem;
        }
        &::after {
          content: ".";
          display: block;
          clear: both;
          visibility: hidden;
        }
      }
    }
  }
}
</style>