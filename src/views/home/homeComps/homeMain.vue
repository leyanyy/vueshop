<template>
  <!-- 主题区域 -->
  <el-main>
    <router-view></router-view>
  </el-main>
</template>

<script>
import Welcome from "../../welcome/Welcome.vue";
export default {
  components: { Welcome },
};
</script>

<style scoped>
</style>