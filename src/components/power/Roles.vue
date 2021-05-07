<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-button type="primary" style="margin-bottom: 15px" @click="addRoles"
        >添加角色</el-button
      >
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesdialogVisible"
        width="80%"
      >
        <el-form ref="form" :model="addForm" label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addForm.descible"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelRolesdialogVisible">取 消</el-button>
          <el-button type="primary" @click="addSureRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <el-table-column type="expand">
          <template v-slot:default="scoped">
            <el-row
              v-for="(item1, i1) in scoped.row.children"
              :key="i1"
              :class="['borderBottom', i1 == 0 ? 'borderTop' : '', 'venter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <!-- {{ item1.children.authName }} -->
                <el-tag closable @close="closeRightById(scoped.row, item1)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-arrow-right"></i>
              </el-col>

              <!--总 二三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                  :class="[i2 == 0 ? '' : 'borderTop', 'venter']"
                >
                  <!-- venter垂直居中的 -->
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="closeRightById(scoped.row, item2)"
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>

                  <el-col :span="16">
                    <!-- 三级权限 -->
                    <el-row
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      :class="i3 == 0 ? '' : 'borderTop'"
                    >
                      <el-col>
                        <el-tag
                          type="warning"
                          closable
                          @close="closeRightById(scoped.row, item3)"
                        >
                          {{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <pre>
              {{ scoped.row }}
          </pre
            >
          </template>
        </el-table-column>

        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="权限名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column> </el-table-column>
        <!-- 权限那一列 -->
        <el-table-column label="操作" width="550px">
          <template v-slot:default="scoped">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="addRightsBtn(scoped.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delateRolesBtn(scoped.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="getRightsTreeList(scoped.row)"
              >分配权限</el-button
            >
            <!-- 权限树列表 -->
            <el-dialog
              title="分配权限"
              :visible.sync="showRightsTree"
              width="60%"
            >
              <el-tree
                :data="rightsTree"
                :props="defaultProps"
                show-checkbox
                default-expand-all
                node-key="id"
                :default-checked-keys="selectedRights"
                ref="elTree"
              ></el-tree>
              <span class="dialog-footer" slot="footer">
                <el-button @click="cancelBtn">取 消</el-button>
                <el-button type="primary" @click="cancelBtn1(scoped.row)"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <!-- <el-dialog
              title="分配权限"
              :visible.sync="showRightsTree"
              width="20%"
            >
              <span class="dialog-footer" slot="footer">
                <el-button @click="cancelBtn">取 消</el-button>
                <el-button type="primary" @click="cancelBtn1(scoped.row)"
                  >确 定</el-button
                >
              </span>
            </el-dialog> -->
          </template>
        </el-table-column>
        <!-- 权限那一列结束 -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
//网络请求的引入
import {
  getRoleList,
  delateRight,
  addRolesNet,
  delateRoles,
  getRightsTree,
  //给角色添加权限
  addRightsById,
} from "network/rights";
export default {
  data() {
    return {
      rolesList: [],
      addRolesdialogVisible: false,
      addForm: {
        name: "",
        descible: "",
      },
      showRightsTree: false,
      // 权限数据存储
      rightsTree: [],

      defaultProps: {
        children: "children",
        label: "authName",
      },
      //已经勾选了的节点
      selectedRights: [],
      //添加权限时候选择的数组
      selectedLists: [],
      // 临时id,添加权限时保存的id
      id: "",
    };
  },
  methods: {
    // 角色列表的请求
    getRoleLists() {
      getRoleList().then((res) => {
        // console.log(res);
        this.rolesList = res.data.data;
        // console.log(this.rolesList);
      });
    },
    //点击移除权限
    async closeRightById(roleld, rightld) {
      // console.log("移除");
      const confirmRes = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        this.$message("您取消了删除");
        // console.log(err);
      });
      // console.log(confirmRes);
      if (confirmRes == "confirm") {
        // console.log("删除成功");
        //发送网络请求
        const newRights = await delateRight(roleld.id, rightld.id);
        roleld.children = newRights.data.data;
      }
    },
    //添加角色
    addRoles() {
      this.addRolesdialogVisible = true;
    },
    //确定添加角色
    addSureRoles() {
      this.addRolesdialogVisible = false;
      addRolesNet(this.addForm.name, this.addForm.descible);
      if (this.addForm.name !== "") {
        this.$message("添加角色成功");
      }
      this.addForm = {};
      this.getRoleLists();
    },
    //取消添加角色
    cancelRolesdialogVisible() {
      this.addRolesdialogVisible = false;
      this.addForm = {};
    },
    //点击删除角色
    async delateRolesBtn(id) {
      // delateRoles(id).then((res) => this.getRoleLists());
      const removeRoles = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        console.log(err);
      });
      if (removeRoles == "confirm") {
        delateRoles(id).then((res) => this.getRoleLists());
        this.$message("删除成功");
      }
    },
    //获取所有的权限树的按钮
    async getRightsTreeList(obj) {
      this.showRightsTree = true;
      const getRightTreeRes = await getRightsTree();
      // console.log(getRightTreeRes);
      if (getRightTreeRes.status !== 200) {
        this.$message("获取权限列表失败");
        return;
      }
      this.rightsTree = getRightTreeRes.data.data;
      // console.log(this.rightsTree);
      // console.log(obj);
      this.getSelected(obj, this.selectedRights);
      //因为拿不到id在点击el-dilog的确定按钮时，只能这样先保存
      this.id = obj.id;
    },
    //递归来循环勾选默认节点
    getSelected(node, arr) {
      // console.log(node);
      if (node.children) {
        node.children.forEach((item) => {
          this.getSelected(item, arr);
        });
        return;
      }
      return arr.push(node.id);
    },

    //给角色添加权限
    async addRightsBtn(rights) {
      // console.log(rights.id);
      // const list = [];
    },

    //清除前一次默认勾选的selectedRights
    //点击的是取消
    cancelBtn() {
      this.selectedRights = [];
      this.showRightsTree = false;
    },
    //点击的是确定
    async cancelBtn1(rights) {
      this.selectedLists = [
        ...this.$refs.elTree.getCheckedKeys(),
        ...this.$refs.elTree.getHalfCheckedKeys(),
      ];
      console.log(rights);
      // this.selectedLists = [101, 104, 105, 116, 149];
      const idStr = this.selectedLists.join(",");
      console.log(this.selectedLists);
      console.log(idStr);
      // addRightsById(rights.id, idStr);
      const addrightsRes = await addRightsById(this.id, idStr);
      console.log(addrightsRes);
      this.getRoleLists();
      this.showRightsTree = false;
    },
  },
  created() {
    // 角色列表的请求
    this.getRoleLists();
  },
};
</script>

<style scoped>
.el-tag {
  margin: 10px;
}
.borderTop {
  border-top: 1px solid #999;
}
.borderBottom {
  border-bottom: 1px solid #999;
}
.venter {
  display: flex;
  align-items: center;
}
</style>