<template>
  <div>
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>

      <el-table-column prop="mg_state" label="状态">
        <template v-slot:default="lll">
          <el-switch
            v-model="lll.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(lll.row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="180px">
        <template v-slot:default="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini "
            @click="editClick(scope.row.id)"
          ></el-button>

          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini "
            @click="removeUserById(scope.row.id)"
          ></el-button>
          <!-- 包含tooltip的设置按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top-start"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini "
              @click="settingRoles(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 点击edit弹出的修改框 -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      @close="resetting"
    >
      <!-- 添加表单信息 -->
      <el-form
        :model="editFrom"
        :rules="editRules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 点击设置角色弹出的按钮 -->
    <el-dialog
      title="设置角色"
      :visible.sync="showSettingRoles"
      width="50%"
      @close="hideSettingRoles"
    >
      <div>
        <p style="padding-bottom: 20px">当前的用户：{{ userInfo.username }}</p>

        <p>当前的角色：{{ userInfo.role_name }}</p>
      </div>
    </el-dialog>

    <!-- 添加表单信息结束 -->

    <!-- 确实是否删除框 -->

    <!-- 确实是否删除框结束 -->
  </div>
</template>

<script>
//网络请求
import {
  changeStateNet,
  formIdGetInfo,
  editFormNet,
  delateUser,
  getRoles,
} from "network/users";

//根据用户id查询用户信息

//网络请求成功与否的展示函数的引入
import { isNetSuccess } from "../../utlis/utlis";

//校验规则的引入
import { email, mobile } from "../../utlis/rules";

//
export default {
  props: {
    userList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      //修改表单信息是否显示
      dialogVisible: false,

      //修改的表单信息
      editFrom: {},

      //校验规则
      editRules: {
        email,
        mobile,
      },
      // 控制设置角色对话框的显示隐藏
      showSettingRoles: false,

      // 弹框角色信息
      userInfo: {},
    };
  },
  methods: {
    //改变状态触发的函数
    changeState(e) {
      //点击开关就能改变由上面传过来的e.mg_state的值，
      //是element ui改变的
      // console.log(e);
      changeStateNet(e.id, e.mg_state).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          e.mg_state = !e.mg_state; //更新失败 取反
          this.$message.error("更新失败");
          return;
        } else {
          // this.$message.success("更新成功");
          return;
        }
      });
    },
    //修改表单信息
    editClick(e) {
      //发起根据id获得用户信息的请求
      // this.$message.success("成功");
      formIdGetInfo(e).then(async (res) => {
        // console.log(res);
        await isNetSuccess(this, res, 200, () => {
          this.editFrom = res.data.data;
        });
      });

      this.dialogVisible = true;
    },
    //点击关闭修改表单信息对话框触发的
    handleClose() {
      this.dialogVisible = false;
    },
    //重置修改用户输入框
    resetting() {
      // this.$refs.ruleForm.resetFields();
      console.log("关闭");
    },

    //点击确定提交修改用户信息的表单
    editUserInfo() {
      this.dialogVisible = false;
      this.$refs.ruleForm.validate((vaild) => {
        if (!vaild) {
          this.$message.error("表单信息有误");
          return;
        }
        //若预验证成功，则发起请求
        // console.log("发起请求");
        editFormNet(
          this.editFrom.id,
          this.editFrom.email,
          this.editFrom.mobile
        ).then((res) => {
          // console.log(res.data.data);
          this.editFrom = res.data.data;
          // console.log(this.editFrom);
          // console.log(this.editFrom);
          // 更新数据列表;
          this.$emit("refreshgetUserList");
        });
      });
    },
    //弹框是否删除用户信息
    removeUserById(e) {
      // console.log(e); id
      this.$confirm("此操作将删除该用户信息, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          //点击确定
          console.log(res);
          delateUser(e).then((ress) => {
            // console.log(ress);
            this.$notify({
              title: "成功",
              message: "删除用户成功",
              type: "success",
              duration: "1000",
            });
          });
        })
        .catch((err) =>
          //点击取消
          console.log(err)
        );
    },
    //settingRoles分配角色按钮
    async settingRoles(userInfo) {
      this.showSettingRoles = true;
      this.userInfo = userInfo;
      console.log(userInfo);

      const allRoles = await getRoles();
      console.log(allRoles);
    },

    // 关闭角色对话框时促发的
    hideSettingRoles() {
      // console.log(111);
    },
  },

  created() {
    // setTimeout(() => {
    //   console.log(this.userList);
    // }, 1000);
  },
};
</script>

<style scoped>
/* .el-table {
  font-size: 12px;
} */
</style>