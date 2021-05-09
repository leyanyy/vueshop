import { request } from './request'
//获取商品分类的数据
export function getCateList(param) {
  return request({
    url: 'categories',
    params: param
  })
}
// 获取父级分类的商品列表
export function getParentsCateList(params) {
  return request({
    url: 'categories',
    params: params
  })
}

// dialog弹框的添加分类
export function addCategories(data) {
  return request({
    url: 'categories',
    method: 'post',
    data: data
  })
}