<template>
  <div class="home">
    <!-- 头部 -->
    <home-header></home-header>
    <el-container class="container">
      <!-- 左侧 -->
      <home-aside :menuList="menuList"></home-aside>
      <!-- 主体 -->
      <home-main></home-main>
    </el-container>
  </div>
</template>

<script>
//网络请求
import { getMenuList } from "network/home";

//组件的引入
import homeHeader from "./homeComps/homeHeader.vue";
import HomeAside from "./homeComps/homeAside.vue";
import HomeMain from "./homeComps/homeMain.vue";

export default {
  components: { homeHeader, HomeAside, HomeMain },
  data() {
    return {
      menuList: [],
    };
  },
  async created() {
    //获取左侧总的菜单
    const res = await getMenuList();
    const menuList = res.data.data;
    this.menuList = menuList;
    // console.log(menuList);
  },

  methods: {},
};
</script>

<style scoped>
.el-aside {
  background-color: #333744;
  /* flex: 2; */
}
.el-main {
  background-color: #eaedf1;
  /* flex: 8; */
}
.home {
  width: 100vw;
  height: 100vh;
}
.el-container {
  width: 100%;
  height: 100%;
}
</style>