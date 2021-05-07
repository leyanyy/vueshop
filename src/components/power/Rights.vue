<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航结束 -->
    <!-- table表格开始 -->
    <!-- <el-card> -->
    <el-table :data="rightList" border style="width: 100%" stripe>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180"> </el-table-column>
      <!-- 权限那一列 -->
      <el-table-column prop="level" label="权限等级">
        <template v-slot:default="scoped">
          <el-tag v-if="scoped.row.level == '0'">一级权限</el-tag>
          <el-tag type="success" v-else-if="scoped.row.level == '1'"
            >二级权限</el-tag
          >
          <el-tag type="warning" v-else>三级权限</el-tag>
        </template>
      </el-table-column>
      <!-- 权限那一列结束 -->
    </el-table>
    <!-- </el-card> -->
    <!-- table表格结束 -->
  </div>
</template>

<script>
//网络请求的引入
import { getRightList } from "network/rights";

export default {
  data() {
    return {
      rightList: [],
    };
  },
  methods: {
    //权限列表的请求
    getRightLists() {
      getRightList("list").then((res) => {
        this.rightList = res.data.data;
        console.log(this.rightList);
      });
    },
  },
  created() {
    //权限列表的请求
    this.getRightLists();
  },
};
</script>

<style scoped>
</style>