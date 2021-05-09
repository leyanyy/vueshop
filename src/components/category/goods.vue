<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <bread-crumb>
      <span slot="value1">首页</span>
      <span slot="value2"> 商品管理 </span>
      <span slot="value3">商品分类</span>
    </bread-crumb>

    <!-- card区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-button type="primary" @click="opencatedialogVisible"
          >添加分类</el-button
        >
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="column"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效模板列 -->
        <template #isok="scoped">
          <i
            class="el-icon-success"
            style="color: green; font-size: 20px"
            v-if="!scoped.row.cat_deleted"
          ></i>
          <i
            class="el-icon-error"
            style="color: red; font-size: 20px"
            v-else
          ></i>
        </template>
        <!-- 排序模板列 -->
        <template #order="scoped">
          <el-tag v-if="scoped.row.cat_level === 0"> 一级</el-tag>
          <el-tag type="success" v-else-if="scoped.row.cat_level === 1">
            二级</el-tag
          >
          <el-tag type="danger " v-else> 三级</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template #opt="">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 底部的分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pagenum"
          :page-sizes="[3, 5, 7, 9]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 点击添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="catedialogVisible"
      width="50%"
      :before-close="dialogClose"
    >
      <el-form
        :model="categoriesList"
        :rules="rules"
        ref="cateruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoriesList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 旧版本：options绑定的是数据源，
                       新版本的v-model是绑定的是一个空数组
                      :props旧版本的是绑定的 联级选择器的配置项，新版本的则是说明是hover触发
           -->
          <div class="block">
            <el-cascader
              :options="parentsList"
              :props="cascaderiopt"
              @change="handleChange"
              v-model="selectdKeys"
              clearable
            ></el-cascader>
          </div>
          <!-- 新版的开始 -->
          <!-- <div class="block">
            <el-cascader
              v-model="list"
              :options="parentsList"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader>
          </div> -->
          <!-- 新版的结束 -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcatedialogVisible1">取 消</el-button>
        <el-button type="primary" @click="addcatedialogVisible2">
          确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 组件的引入
import breadCrumb from "../content/breadCrumb";

// 网络请求的引入
import {
  getCateList,
  getParentsCateList,
  addCategories,
} from "../../network/goods";

//校验规则的引入
import { cat_name } from "../../utlis/rules";

export default {
  components: {
    breadCrumb,
  },
  data() {
    return {
      //商品分类的数组
      cateList: [],
      // 请求商品分类的参数
      params: {
        pagenum: 1,
        pagesize: 5,
      },
      //父级的请求参数
      parentsParams: {
        type: "2",
      },
      total: 0,
      column: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template", //指定当前列为模板列
          template: "order",
        },
        {
          label: "操作",
          type: "template", //指定当前列为模板列
          template: "opt",
        },
      ],
      // 分类框的显示与隐藏
      catedialogVisible: false,

      // 请求添加分类接收的数组
      categoriesList: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },

      // 验证规则
      rules: {
        cat_name: cat_name,
      },
      // 父级商品的列表
      parentsList: [],

      //联机选择器的配置项
      cascaderiopt: {
        value: "cat_id", //选中的是哪个值，选中被记录下来的
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: "true",
      },
      // 联级选择器已选择的数组
      selectdKeys: [],
    };
  },

  methods: {
    // 请求所有的数据
    async getCateLists() {
      const cateLists = await getCateList(this.params);
      this.cateList = cateLists.data.data.result;
      if (cateLists.data.meta.status !== 200) {
        this.$message.error("获取商品列表数据失败");
        return;
      }
      this.total = cateLists.data.data.total;
      console.log(this.cateList);
    },
    // 分页的相关功能
    //点击选择每一页有多少条的时候会触发
    //参数为显示的条数
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;
      this.getCateLists();
    },

    // 点击选择多少页的时候会促发
    handleCurrentChange(newNum) {
      this.params.pagenum = newNum;
      this.getCateLists();
    },
    //点击添加分类的按钮
    async opencatedialogVisible() {
      this.catedialogVisible = true;
      //获取父级的分类列表
      const parentsLists = await getParentsCateList(this.parentsParams);
      console.log(parentsLists);
      if (!parentsLists.data.meta.status == 200) {
        $message.error("请求父级分类失败");
        return;
      }
      this.parentsList = parentsLists.data.data;
      // console.log("成功");
    },
    // 点击分类框的取消
    addcatedialogVisible1() {
      this.catedialogVisible = false;
      this.selectdKeys = [];
      this.categoriesList.cat_pid = 0;
      this.categoriesList.cat_level = 0;
      this.$refs.cateruleForm.resetFields();
    },
    // 点击分类框的确定
    async addcatedialogVisible2() {
      this.catedialogVisible = false;
      if (this.selectdKeys.length == 0) {
        this.categoriesList.cat_pid = 0;
        this.categoriesList.cat_level = 0;
      } else {
        this.categoriesList.cat_pid = this.selectdKeys[
          this.selectdKeys.length - 1
        ];
        this.categoriesList.cat_level = this.selectdKeys.length;
      }

      this.$refs.cateruleForm.validate(async (valid) => {
        if (!valid) return;
        const addCategory = await addCategories(this.categoriesList);
      });
    },

    // 点击联级选择器触发的
    handleChange() {},
    //叉叉dialog弹框触发的
    dialogClose() {
      this.catedialogVisible = false;
      this.selectdKeys = [];
      this.categoriesList.cat_pid = 0;
      this.categoriesList.cat_level = 0;
      this.$refs.cateruleForm.resetFields();
    },
  },
  created() {
    this.getCateLists();
  },
};
</script>

<style scoped>
</style>