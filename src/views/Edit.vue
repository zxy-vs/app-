<template>
  <div class="edit">
    <div class="atit">
      <div class="aicon">
        <span> 编辑资料 </span>
        <van-icon class="left" name="arrow-left" @click="$router.go(-1)" />
      </div>
    </div>
    <div class="main">
      <!-- v-model="fileList" -->
      <van-uploader :after-read="updates" :preview-image="false">
        <div class="img">
          <van-cell title="头像" is-link value="内容">
            <template #default>
              <van-image round width="1.3rem" height="1.3rem" :src="me.photo" />
            </template>
          </van-cell>
        </div>

        <!-- <van-button icon="plus" type="primary">上传文件</van-button> -->
      </van-uploader>
      <van-cell title="姓名" is-link :value="me.name" @click="show = true" />
      <van-cell
        title="生日"
        is-link
        :value="me.birthday"
        @click="shows = true"
      />
      <van-dialog
        v-model="show"
        title="姓名"
        show-cancel-button
        @confirm="updates(me.name)"
      >
        <van-field v-model.trim="me.name" autofocus />
      </van-dialog>
      <van-action-sheet v-model="shows">
        <van-datetime-picker
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
          title="选择生日"
          @confirm="updates(currentDate)"
          @cancel="shows = false"
        />
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      show: false,
      shows: false,
      me: {},
      minDate: new Date(0),
      maxDate: new Date(),
      currentDate: "",
    };
  },
  methods: {
    getMes() {
      axios
        .get("/api/v1_0/user/profile")
        .then((res) => {
          this.me = res.data;
          this.currentDate = new Date(this.me.birthday);
        })
        .catch((err) => {
          console.log("请重新登录");
          localStorage.removeItem("token");
        });
    },
    async updates(item) {
      if (this.me.name == item) {
        await axios.patch("/api/v1_0/user/profile", { name: item });
        this.getMes();
      } else if (this.currentDate == item) {
        let y = item.getFullYear(),
          m = item.getMonth(),
          d = item.getDate();
        await axios.patch("/api/v1_0/user/profile", {
          birthday: `${y}-${m + 1}-${d}`,
        });
        this.getMes();
        this.shows = false;
      } else {
        const blob = new Blob([item.file], { type: "image/png" });
        const formData = new FormData();
        formData.append("photo", blob);
        const { data } = await axios.patch("/api/v1_0/user/photo", formData);
        this.getMes();
      }
    },
  },
  created() {
    this.getMes();
  },
};
</script>

<style lang="less" scoped>
.edit {
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
  .main {
    margin-top: 1.22667rem;
    .van-cell {
      width: 100%;
      align-items: center;
    }
    .img {
      width: 10rem;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>