<template>
  <el-breadcrumb :separator="icon">
    <el-breadcrumb-item :to="{ path: '/welcome' }"
      ><slot name="value1"></slot
    ></el-breadcrumb-item>
    <el-breadcrumb-item> <slot name="value2"></slot></el-breadcrumb-item>
    <el-breadcrumb-item> <slot name="value3"></slot></el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "/",
    },
  },
};
</script>

<style scoped>
</style>