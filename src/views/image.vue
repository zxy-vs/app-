<template>
  <div class="imgs">
    <img :src="img" ref="imgs" />
    <div class="toolbar">
      <span @click="$emit('show')">取消</span>
      <span @click="end">完成</span>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
  props: ["img"],
  mounted() {
    const image = this.$refs.imgs;
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: "move", // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false, // 关闭默认背景
    });
  },
  methods: {
    end() {
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("photo", blob);
        const {
          data: { photo: photo },
        } = await axios.patch("/api/v1_0/user/photo", formData);
        this.$emit("shows", photo);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.imgs {
  background: #000;
  width: 100%;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
img {
  display: block;
  width: 100%;
}
</style>