<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb>
      <span slot="value1">首页</span>
      <span slot="value2"> 商品管理 </span>
      <span slot="value3">参数列表</span>
    </bread-crumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部的警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        :show-icon="true"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="selectRow">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="cascaderSelectedList"
            :options="cateList"
            :props="cascaderOpt"
            @change="cascaderhandleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- table页签区域 -->
      <el-tabs v-model="activeTableName" @tab-click="handleTableClick">
        <!-- 添加参数页   -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addparams"
            >添加参数</el-button
          >
          <!-- 动态参数属性表格 -->
          <el-table :data="manyTabltList" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot:default="scoped">
                <el-tag
                  closable
                  v-for="(item, i) in scoped.row.attr_vals"
                  :key="i"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="180" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template v-slot:default="scoped">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-delete"
                  @click="editdialogClick(scoped.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scoped.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加属性页 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addparams"
            >添加属性</el-button
          >
          <!-- 静态参数属性表格 -->
          <el-table :data="onlyTableList" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scoped">
                <el-tag
                  closable
                  v-for="(item, i) in scoped.row.attr_vals"
                  :key="i"
                  @close="delateParamTag(scoped.row, i)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="180" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="e">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-delete"
                  @click="editdialogClick(e.row)"
                  >编辑</el-button
                >

                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(e.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 点击添加参数的对话框 -->
    <el-dialog
      :title="paramTitle"
      :visible.sync="addParamdialogVisible"
      width="30%"
      :before-close="addParamshandleClose"
      @close="paramClose"
    >
      <!-- dialog里面的表单 -->
      <el-form
        :model="ParamRuleForm"
        :rules="paramrules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="ParamRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ParamdialogVisible1">取 消</el-button>
        <el-button type="primary" @click="ParamdialogVisible2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击修改参数的对话框 -->
    <el-dialog
      :title="paramTitle"
      :visible.sync="editParamdialogVisible"
      width="30%"
      :before-close="editParamshandleClose"
    >
      <!-- dialog里面的表单 -->
      <el-form
        :model="editParamRuleForm"
        :rules="editparamrules"
        ref="editruleForm"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editParamRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamdialogVisible1">取 消</el-button>
        <el-button type="primary" @click="editParamdialogVisible2"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 组件的引入
import breadCrumb from "../content/breadCrumb";

// 网络请求的引入
import { getCateList } from "../../network/goods";
import {
  getParamsList,
  addParams,
  getParams,
  handleParams,
  deleteParam,
  sumbitParam,
} from "../../network/params";

// 验证规则的引入
import { attr_name } from "../../utlis/rules";
export default {
  components: {
    breadCrumb,
  },
  data() {
    return {
      cateList: [],

      //级联选择器的配置项
      cascaderOpt: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选定后的数组
      cascaderSelectedList: [],
      //活跃的table页签
      activeTableName: "many",
      //请求后的参数列表
      // paramList: [],
      //动态参数列表
      manyTabltList: [],
      //静态参数列表
      onlyTableList: [],
      // 控制添加参数对话框的显示与隐藏
      addParamdialogVisible: false,
      //dialog form里面的
      ParamRuleForm: {
        attr_name: "ff",
      },
      // form的验证规则
      paramrules: {
        attr_name: attr_name,
      },

      //修改dialog对话框的显示隐藏
      editParamdialogVisible: false,

      //修改参数双向绑定
      editParamRuleForm: {
        attr_name: "",
      },
      //表单验证
      editparamrules: {
        attr_name: attr_name,
      },

      //修改参数的网络参数
      handleParamsparam: {},
    };
  },

  computed: {
    isBtnDisabled() {
      if (this.cascaderSelectedList.length !== 3) {
        // console.log(this.cascaderSelectedList[2]);
        this.manyTabltList = [];
        this.onlyTableList = [];
        return true;
      }
      return false;
    },
    cateId() {
      if (this.cascaderSelectedList.length == 3) {
        // console.log(this.cascaderSelectedList[2]);
        return this.cascaderSelectedList[2];
      }
      return null;
    },
    paramTitle() {
      if (this.activeTableName == "many") {
        return "动态参数";
      }
      return "静态参数";
    },
  },

  methods: {
    // 获取所有商品的分类列表
    async getCateList() {
      const cateres = await getCateList();
      this.cateList = cateres.data.data;
      if (cateres.data.meta.status !== 200) {
        return this.$message.error("获取商品列表数据失败");
      }
      // console.log(this.cateList);
    },
    //点击级联选择器时的
    async cascaderhandleChange() {
      this.getparamsData();
    },

    async getparamsData() {
      // 判断是否选中的是三级分类
      if (this.cascaderSelectedList.length !== 3) {
        return (this.cascaderSelectedList = []);
      }

      //请求参数列表
      const paramsListRes = await getParamsList(
        this.cateId,
        this.activeTableName
      );
      console.log(paramsListRes);
      // paramsListRes.data.data.forEach((item) => {
      //   return (item.attr_vals = item.attr_vals.split(","));
      // });
      for (var i = 0; i < paramsListRes.data.data.length; i++) {
        paramsListRes.data.data[i].attr_vals = paramsListRes.data.data[i]
          .attr_vals
          ? paramsListRes.data.data[i].attr_vals.split(",")
          : [];
        paramsListRes.data.data[i].inputVisible = false;
        paramsListRes.data.data[i].inputValue = "";
      }
      if (paramsListRes.data.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      // this.paramList = paramsListRes.data.data;
      // console.log(paramsListRes);
      // console.log(this.paramList);
      if (this.activeTableName == "many") {
        //属于动态参数列表
        return (this.manyTabltList = paramsListRes.data.data);
      } else {
        return (this.onlyTableList = paramsListRes.data.data);
      }
    },

    //点击table页签是触发的函数
    handleTableClick() {
      // console.log("点击table");
      console.log(this.activeTableName);
      //请求参数列表的
      this.getparamsData();
    },
    // 点击弹出添加参数的对话框
    addparams() {
      this.addParamdialogVisible = true;
    },
    // 添加参数对话框的点击取消
    ParamdialogVisible1() {
      this.addParamdialogVisible = false;
    },
    // 添加参数对话框的点击确定
    ParamdialogVisible2() {
      this.addParamdialogVisible = false;
      this.$refs.ruleForm.validate(async (vaild) => {
        // console.log(vaild);
        if (!vaild) {
          return this.$message.error("表单验证失败");
        }
        const addParamsRes = await addParams(
          this.cateId,
          this.ParamRuleForm.attr_name,
          this.activeTableName
        );
        // console.log(addParamsRes);
        this.getparamsData();
      });
    },
    // 添加参数对话框的点击取消

    addParamshandleClose() {
      this.addParamdialogVisible = false;
    },
    // 监听dialog对话框的开启与否
    paramClose() {
      // console.log(1);
      this.$refs.ruleForm.resetFields();
    },
    //点击编辑弹出的修改对话框}
    async editdialogClick(e) {
      this.editParamdialogVisible = true;
      // console.log(e);
      // console.log(this.onlyTableList);
      //不发请求了，直接拿
      this.editParamRuleForm.attr_name = e.attr_name;
      // console.log(e);
      //发送修改参数的网络请求
      this.handleParamsparam = e;

      // console.log(res);
    },
    // //关闭修改对话框的
    // editparamClose() {
    //   // this.editParamdialogVisible = false;
    //   console.log(1);
    // },
    //修改dialog对话框叉叉
    editParamshandleClose() {
      this.editParamdialogVisible = false;
      this.$refs.editruleForm.resetFields();
    },
    //修改dialog取消
    editParamdialogVisible1() {
      this.editParamdialogVisible = false;
      this.$refs.editruleForm.resetFields();
    },
    //修改dialog对话框确定
    async editParamdialogVisible2() {
      this.editParamdialogVisible = false;
      const res = await handleParams(
        this.cateId,
        this.handleParamsparam.attr_id,
        this.editParamRuleForm.attr_name,
        this.activeTableName
        // "many"
      );
      this.getparamsData();

      this.$refs.editruleForm.resetFields();
    },
    //点击删除参数
    async deleteParams(e) {
      // console.log("删除");
      const SUreDelete = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      console.log(SUreDelete);
      if (SUreDelete !== "confirm") {
        return this.$message("取消删除成功");
      }
      console.log(e);
      const deleteRes = await deleteParam(this.cateId, e.attr_id);
      console.log(deleteRes);
      this.getparamsData();
    },

    //tag标签旁的，无论是焦点离开还是抬起enter键
    async handleInputConfirm(e) {
      if (e.inputValue.trim().length == 0) {
        e.inputValue = "";
        e.inputVisible = false;
        return;
      }
      e.attr_vals.push(e.inputValue.trim());

      // console.log("ok");
      this.saveParamTag(e);
    },
    async saveParamTag(e) {
      const netRes = await sumbitParam(
        this.cateId,
        e.attr_id,
        e.attr_name,
        e.attr_sel,
        e.attr_vals.join(",")
      );
      // console.log(netRes);
      if (netRes.data.meta.status == 200) {
        return this.$message.success("修改成功");
      }
    },

    //点击切换为button按钮时单机函数
    showInput(e) {
      console.log("qiehuan  ");
      e.inputVisible = true;

      //让input输入框自动获取焦点
      //this.$nextTick函数，当页面重新被渲染之后才会执行，里面穿了一个回调

      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag参数标签
    delateParamTag(row, i) {
      // console.log("删除");
      row.attr_vals.splice(i, 1);
      this.saveParamTag(row);
    },
  },
  created() {
    // 获取所有商品的分类列表
    this.getCateList();
  },
};
</script>

<style scoped>
.selectRow {
  margin-top: 25px;
  margin-bottom: 20px;
  font-size: 30px;
}
.input-new-tag {
  width: 150px;
}
</style>