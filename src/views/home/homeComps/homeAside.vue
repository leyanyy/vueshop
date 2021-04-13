<template>
  <!-- 侧边栏 -->

  <el-aside :width="asideWidth">
    <!-- 折叠功能 -->
    <button class="btn" @click="collapseClick">|||</button>
    <!-- element导航菜单 -->

    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409bff"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
    >
      <!-- 一级菜单 -->
      <el-submenu
        :index="item.id + ''"
        v-for="item in menuList"
        :key="item.id"
        :disabled="isCollapse"
      >
        <!-- 一级菜单模板 -->
        <template slot="title">
          <i :class="icon[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>

        <!-- 二级菜单 -->

        <el-menu-item
          :index="i.path + ''"
          v-for="i in item.children"
          :key="i.id"
        >
          <!-- 二级菜单模板 -->
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ i.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {
      //获取字体图标
      icon: {
        125: "iconfont icon-users",
        103: "iconfont icon-lock",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 水平折叠菜单栏
      isCollapse: false,
    };
  },
  props: {
    //获取导航菜单文字
    menuList: {
      tupe: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    //侧边栏的宽度
    asideWidth() {
      return this.isCollapse ? "60px" : "200px";
    },
    //控制二级菜单的路由活跃
    activePath() {
      return this.$route.path.split("/")[1];
    },
  },
  methods: {
    collapseClick() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {},
};
</script>

<style scoped>
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: "";
}
.btn {
  /* width: 198px; */
  color: #fff;
  width: 100%;
  height: 30px;
  background-color: #333744;
  border: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.el-submenu {
  width: 200px;
}
</style>