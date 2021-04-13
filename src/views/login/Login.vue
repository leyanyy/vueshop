<template>
  <div class="login_continer">
    <!-- 顶部头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="@/assets/img/logo.png" alt="" />
        <!-- 表单区域 -->
      </div>

      <el-form
        class="el_form"
        :model="form"
        :rules="logininRules"
        ref="el_form"
      >
        <el-form-item class="el_item" prop="username">
          <el-input
            prefix-icon="iconfont icon-xiaoren"
            v-model="form.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-search"
            v-model="form.password"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="login">登录</el-button
          ><el-button type="info" @click="resertForm">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- <el-button :plain="true" @click="open2">成功</el-button> -->
  </div>
</template>

<script>
import { loginNet } from "network/login"; //登录请求
import axios from "axios";

//验证规则的引入
import { username, password } from "../../utlis/rules";
export default {
  data() {
    return {
      //表单双向绑定的信息
      form: {
        username: "admin",
        password: "123456",
      },
      logininRules: {
        //验证用户名和密码
        username,
        password,
      },
    };
  },

  methods: {
    //重置登录名和用户密码
    resertForm() {
      this.$refs.el_form.resetFields();
    },

    //登录的预验证
    login() {
      this.$refs.el_form.validate(async (valid) => {
        if (!valid) {
          alert("请输入正确的登录账号或者密码");
          return;
        } else {
          // let res = loginNet("admin", 123456);
          // console.log(res);
          const res = await loginNet(this.form.username, this.form.password);
          // console.log(res.data);
          if (res.data.meta.status == 200) {
            this.open2();
            //会话期间保存token
            window.sessionStorage.setItem("token", res.data.data.token);
            this.$router.push("/home");
            return;
          }
          this.open3();
        }
      });
    },
    //成功的弹框提示
    open2() {
      this.$message.success("登录成功");
    },
    //失败的弹窗提示
    open3() {
      this.$message.error("登录失败，请仔细检查哦");
    },
  },
  created() {
    // console.log(userNameRules);
  },
};
</script>

<style scoped Lang="less">
.login_continer {
  background-color: #2b4b6b;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  margin: 0 auto;
  transform: translateY(-50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #ddd;
}
.el_form {
  width: 100%;
  padding: 0 15px;
  position: absolute;
  top: 80px;
}
.el_item {
  width: 100%;
}

.btn {
  float: right;
  margin-top: 45px;
}
</style>