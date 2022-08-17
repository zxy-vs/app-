<template>
  <div>
    <van-uploader  @oversize="onOversize" capture="camera" :after-read="afterRead" :max-size="4 * 1024 * 1024" class="uploader">
	<!-- <span>点击调用摄像头进行拍摄</span> -->
</van-uploader>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    afterRead(file){
      console.log(file);
    },
    onOversize(){
      console.log(2);
    }
  }
  
};
</script>

<style lang="less" scoped>
</style>