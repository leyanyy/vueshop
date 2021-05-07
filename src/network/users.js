import { request } from './request'
export function getUserList(config) {
  return request({
    url: 'users',
    params: config
  })
}

//该便表单中的登录状态
export function changeStateNet(uid, type) {
  return request({
    method: "put",
    url: 'users/' + uid + 'state' + type
  })
}

//用户表单添加的请求
// export function addUsersNet(username, password, email, mobile) {
//   return request({
//     method: "post",
//     url: "users",
//     data: {
//       username: username,
//       password: password,
//       email: email,
//       mobile: mobile
//     }
//   })
// }
export function addUsersNet(config) {
  return request({
    method: "post",
    url: "users",
    data: config
  })
}
//根据id查询用户信息
export function formIdGetInfo(id) {
  return request({
    url: "users/" + id
  })
}

//编辑用户提交的请求
export function editFormNet(id, email, mobile) {
  return request({
    url: 'users/' + id,
    method: "put",
    data: {
      id: id,
      email: email,
      mobile: mobile
    }
  })
}

//删除用户的请求
export function delateUser(id) {
  return request({
    url: "users/" + id,
    method: 'delete'
  })
}
//获取所有角色列表
export function getRoles() {
  return request({
    url: 'roles'
  })
}