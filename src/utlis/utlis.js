export function isNetSuccess(that, datas, num, call) {
  if (datas.status !== num) {
    that.$message.error("请求失败")
    return
  } else {
    call()
    that.$message.success("请求成功")
    return
  }
}