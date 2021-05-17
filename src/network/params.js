import { attr_name } from '../utlis/rules'
import { request } from './request'

//参数列表的请求
export function getParamsList(id, sel) {
  return request({
    url: 'categories/' + id + '/attributes',
    params: {
      sel: sel
    }
  })
}

//添加动态参数或者静态参数的请求
export function addParams(id, attr_name, attr_sel) {
  return request({
    url: "categories/" + id + "/attributes",
    method: "post",
    data: {
      attr_name: attr_name,
      attr_sel: attr_sel,
      // attr_vals: attr_vals
    }
  })
}
//根据id查询参数
export function getParams(id, attrid, attr_sel) {
  return request({
    url: "categories/" + id + '/attributes/' + attrid,
    params: {
      attr_sel: attr_sel
    }
  })

}

//编辑提交参数
export function handleParams(id, attrid, attr_name, attr_sel) {
  return request({
    url: "categories/" + id + "/attributes/" + attrid,
    method: "put",
    data: {
      attr_name: attr_name,
      attr_sel: attr_sel
    }
  })
}

//删除参数的请求
export function deleteParam(id, attrid) {
  return request({
    url: "categories/" + id + '/attributes/' + attrid,
    method: 'delete'
  })
}
//编辑提交参数
export function sumbitParam(id, attrid, attr_name, attr_sel, attr_vals) {
  return request({
    url: "categories/" + id + '/attributes/' + attrid,
    method: "put",
    data: {
      attr_name: attr_name,
      attr_sel: attr_sel,
      attr_vals: attr_vals
    }
  })
}