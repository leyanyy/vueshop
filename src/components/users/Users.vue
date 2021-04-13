<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <bread-crumb></bread-crumb>
    <!-- 卡片区域 -->
    <card>
      <user-card-content @changequery="changequery"></user-card-content>
    </card>

    <!--用户表单 表单区域 -->
    <user-table
      :userList="userList"
      @refreshgetUserList="refreshgetUserList"
    ></user-table>

    <!-- 分页区域 -->
    <users-pages
      :pageInfo="{ ...paramInfo, total }"
      @changePageSize="changePageSize"
      @changePageNum="changePageNum"
    ></users-pages>
  </div>
  <!--  -->
</template>

<script>
import breadCrumb from "../content/breadCrumb.vue";
import Card from "../content/Card.vue";
import UserCardContent from "./UserCardContent.vue";
import UserTable from "./userTable.vue";

//网络请求相关
import { getUserList } from "network/users";
import UsersPages from "./UsersPages.vue";
export default {
  components: { breadCrumb, Card, UserCardContent, UserTable, UsersPages },
  data() {
    return {
      //请求数据
      paramInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    };
  },

  created() {
    //网络请求
    this.getUserList();
  },
  methods: {
    //发送网络请求
    getUserList() {
      getUserList(this.paramInfo).then((res) => {
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 改变每页显示的条数
    changePageSize(e) {
      // console.log(e);
      this.paramInfo.pagesize = e;
      //改变请求参数之后重新发起请求
      this.getUserList();
    },
    //页码条数的改变
    changePageNum(e) {
      this.paramInfo.pagenum = e;
      this.getUserList();
    },
    //监听query的改变
    changequery(e) {
      // console.log(e);
      this.paramInfo.query = e;
      //发送网络请求
      this.getUserList();
    },
    //子组件表单列表更新数据
    refreshgetUserList() {
      this.getUserList();
      this.$message("修改数据成功");
    },
  },
};
</script>

<style scoped>
</style>