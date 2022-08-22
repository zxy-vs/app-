<template>
  <div class="edit">
    <div class="atit">
      <div class="aicon">
        <span> 编辑资料 </span>
        <van-icon class="left" name="arrow-left" @click="$router.go(-1)" />
      </div>
    </div>
    <div class="main">
      <input type="file" hidden ref="file" @change="Change" />
      <van-popup v-model="showss" position="bottom" :style="{ height: '100%' }">
        <Imgs v-if="showss" :img="img" @show="Show" @shows="Shows" />
      </van-popup>
      <div class="img">
        <van-cell title="头像" is-link value="内容" @click="$refs.file.click()">
          <template #default>
            <van-image
              ref="img"
              round
              width="1.3rem"
              height="1.3rem"
              :src="me.photo"
            />
          </template>
        </van-cell>
      </div>
      <!-- <van-uploader :after-read="updates" :preview-image="false">
        <div class="img">
          <van-cell title="头像" is-link value="内容">
            <template #default>
              <van-image ref="img" round width="1.3rem" height="1.3rem" :src="me.photo" />
            </template>
          </van-cell>
        </div>
      </van-uploader> -->
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
import Image from "./image.vue";
export default {
  components: { Imgs: Image },

  data() {
    return {
      fileList: [],
      show: false,
      shows: false,
      showss: false,
      me: {},
      img: "",
      minDate: new Date(0),
      maxDate: new Date(),
      currentDate: "",
      cropper: null,
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
        this.me.name = item;
      } else if (this.currentDate == item) {
        let y = item.getFullYear(),
          m = item.getMonth(),
          d = item.getDate();
        await axios.patch("/api/v1_0/user/profile", {
          birthday: `${y}-${m + 1}-${d}`,
        });
        this.me.birthday = `${y}-${m + 1}-${d}`;
        this.shows = false;
      } else {
        const blob = new Blob([item.file], { type: "image/png" });
        const formData = new FormData();
        formData.append("photo", blob);
        const {
          data: { photo: photo },
        } = await axios.patch("/api/v1_0/user/photo", formData);
        this.me.photo = photo;
      }
    },
    Change() {
      const url = URL.createObjectURL(this.$refs.file.files[0]);
      this.img = url;
      this.showss = true;
      this.$refs.file.value = "";
    },
    Show() {
      this.showss = false;
    },
    Shows(photo) {
      this.me.photo = photo;
      this.Show();
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