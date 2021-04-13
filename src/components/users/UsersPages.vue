<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 3, 5, 8]"
      :page-size="currentPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
    >
    </el-pagination>
  </div>
</template>


<script>
export default {
  props: {
    pageInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    //当前为多少页
    currentPage() {
      return this.pageInfo.pagenum;
    },
    //当前页显示多少条
    currentPageSize() {
      return this.pageInfo.pagesize;
    },
    //总共多少条
    totalNum() {
      return this.pageInfo.total;
    },
  },

  methods: {
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);

      this.$emit("changePageSize", newSize);
    },
    //监听页码值的改变
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.$emit("changePageNum", newPage);
    },
  },
  updated() {},
};
</script>

<style scoped>
</style>