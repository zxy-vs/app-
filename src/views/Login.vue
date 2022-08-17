<template>
  <div class="login">
    <table>
      <tr>
        <th colspan="2" class="title">登&nbsp;录</th>
      </tr>
      <tr>
        <td>
          <div class="login_logo" style="border-bottom: 1px solid #eee">
            <van-icon name="phone-o" />
          </div>
        </td>
        <td>
          <van-field
            v-model="value"
            type="tel"
            style="border-bottom: 1px solid #eee"
            placeholder="请输入手机号"
            @touchstart.native.stop="show = true"
          />
        </td>
      </tr>
      <tr>
        <td>
          <div class="login_logos">
            <van-icon name="chat-o" />
          </div>
        </td>
        <td>
          <van-field v-model="password" center placeholder="请输入验证码">
            <template #button>
              <van-button
                color="#ccc"
                size="small"
                :disabled="!shows"
                plain
                type="primary"
                @click="small"
                ><span v-show="shows">发送验证码</span>
                <van-count-down
                  v-show="!shows"
                  millisecond
                  ref="countDown"
                  :auto-start="false"
                  :time="60000"
                  format="ss 秒"
                  @finish="finish"
              /></van-button>
            </template>
          </van-field>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="loginBtn">
            <van-button type="info" class="rad" size="large" @click="login"
              >登&nbsp;录</van-button
            >
          </div>
        </td>
      </tr>
    </table>
    <van-icon
      color="#fff"
      name="arrow-left"
      class="back"
      @click="$router.back()"
    />
    <a class="over" href="javascript:;">隐私条款</a>
    <!-- error-message="手机号格式错误" -->
    <!-- 13288888881 -->
    <!-- error-message="短信验证码错误" -->
    <!-- 246810 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      show: true,
      shows: true,
      value: "",
      countDown: null,
      test1:
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
    };
  },
  methods: {
    login() {
      if (this.value.length && this.password.length) {
        axios
          .post("/api/v1_0/authorizations", {
            mobile: this.value,
            code: this.password,
          })
          .then((res) => {
            localStorage.setItem("token", res.data.token);
            this.$router.replace("/me");
            this.$router.go();
          });
      }
    },
    small() {
      console.log(this.test1.test(this.value));
      if (this.test1.test(this.value)) {
        this.start();
        axios.get("/api/v1_0/sms/codes/" + this.value).then(res=>{
          console.log(res.message);
        })
      } else {
        console.log("不符合手机号!!!!");
      }
    },
    async finish() {
      this.shows = true;
      await this.$nextTick();
      this.$refs.countDown.reset();
    },
    async start() {
      this.shows = false;
      await this.$nextTick();
      this.$refs.countDown.start();
    },
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #f4f6f8;
  table {
    width: 100%;
    border-collapse: collapse;
    .title {
      width: 100%;
      height: 1.22667rem;
      line-height: 1.22667rem;
      text-align: center;
      color: #fff;
      font-size: 24px;
      font-weight: 400;
      background-color: #3195f9;
    }
    td {
      height: 100%;
      .loginBtn {
        line-height: 80px;
        width: 90%;
        margin: auto;
        .rad {
          border-radius: 5px;
        }
      }

      .login_logo {
        height: 44px;
        line-height: 44px;
        padding: 0 0.34rem;
        background-color: #fff;
        text-align: center;
      }
      .login_logos {
        height: 53px;
        line-height: 53px;
        padding: 0 0.34rem;
        background-color: #fff;
        text-align: center;
      }
    }
  }
  .over {
    font-size: 16px;
    position: absolute;
    bottom: 20%;
    left: 50%;
    color: #0f0f0f;
    transform: translateX(-50%);
  }
  .back {
    position: fixed;
    top: 0.32667rem;
    left: 0.32667rem;
  }
}
</style>
