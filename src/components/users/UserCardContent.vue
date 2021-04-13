<template>
  <el-row :gutter="20">
    <el-col :span="10"
      ><div>
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="inputValue"
          :clearable="true"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changQuery"
          ></el-button>
        </el-input></div
    ></el-col>
    <el-col :span="6"
      ><div>
        <el-button type="primary" @click="adddialogVisible = true"
          >添加用户</el-button
        >
      </div></el-col
    >
    <!-- 点击添加用户弹出的对话框 -->

    <el-dialog
      title="添加用户"
      width="50%"
      :before-close="handleClose"
      :visible.sync="adddialogVisible"
    >
      <!-- 对话框内容主题区 -->
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input> </el-form-item
        ><el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框取消确定按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateClick">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>



<script>
import { username, password, email, mobile } from "../../utlis/rules";

//网络请求
import { addUsersNet } from "network/users";

export default {
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputValue: "",
      //控制对话框是否能关闭
      adddialogVisible: false,
      //绑定的添加用户的表单数据
      addForm: {
        username: "admi",
        password: "123456",
        email: "1113677388@qq.com",
        mobile: "17885900284",
      },
      //form表单的验证规则
      addFormRules: {
        username,
        password,
        email,
        mobile,
      },
    };
  },
  computed: {},
  methods: {
    //点击搜索的时候触发
    changQuery() {
      // console.log(this.inputValue);
      this.$emit("changequery", this.inputValue);
    },
    // 关闭对话框之前触发的
    handleClose() {
      console.log("关闭对话框");
      //点击关闭表单进行重置
      this.$refs.addFormRef.resetFields();
      this.adddialogVisible = false;
    },
    //表单的预校验
    validateClick() {
      this.$refs.addFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) {
          this.$message.error("表单内容有误");
          return;
        }
        //验证成功之后发起请求
        this.getaddUsersNet();
      });
      // console.log(1);
    },
    //表单网络请求的
    getaddUsersNet() {
      addUsersNet(this.addForm).then((res) => {
        //关闭表单
        this.adddialogVisible = false;
        // 重置表单;
        this.$refs.addFormRef.resetFields();
        if (res.data.meta.status == 201) {
          //关闭对话框
          this.$message.success("添加新用户成功");
          return;
        }
        this.$message.error("添加用户失败");
      });
    },
  },
};
</script>

<style scoped>
</style>