<template>
  <!-- 头部区域 -->
  <el-header>
    <div class="name">
      <img src="~assets/img/heima.png" alt="" />
      电商后台管理系统
    </div>
    <el-button @click="backClick" type="info" class="backbtn"
      >退出</el-button
    ></el-header
  >
</template>

<script>
export default {
  methods: {
    //退出功能
    backClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  width: 100vw;
}
.name {
  /* line-height: 60px; */
  display: flex;
  align-items: center;
  height: 60px;
  color: #fff;
  font-size: 25px;
}
.name img {
  margin-right: 15px;
}
.backbtn {
  height: 40px;
  /* line-height: 60px; */
  /* width: 50px; */
  text-align: center;
  font-size: 14px;
}
</style>