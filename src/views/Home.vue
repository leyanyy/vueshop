<template>
  <div class="home">
    <el-button @click="backClick" type="info">退出</el-button>
  </div>
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
</style>