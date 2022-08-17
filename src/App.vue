<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
li {
  list-style: none;
}
.close {
  position: relative;
  float: right;
  display: block;
  width: 12px;
  height: 12px;
  &::before {
    content: "";
    position: absolute;
    left: 6px;
    display: inline-block;
    line-height: 12px;
    width: 1px;
    height: 12px;
    transform: rotate(45deg);
    background-color: #969799;
  }
  &::after {
    content: "";
    position: absolute;
    left: 6px;
    display: inline-block;
    width: 1px;
    height: 12px;
    line-height: 12px;
    transform: rotate(-45deg);
    background-color: #969799;
  }
}
</style>