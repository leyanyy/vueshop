import { request } from './request'
//权限列表的引入
export function getRightList(type) {
  return request({
    url: 'rights/' + type
  })
}
// 获取角色列表的请求
export function getRoleList() {
  return request({
    url: 'roles'
  })
}
// 删除权限的请求
export function delateRight(roleld, rightld) {
  return request({
    url: 'roles/' + roleld + '/rights/' + rightld,
    method: "delete"
  })
}
//添加角色请
export function addRolesNet(roleName, roleDesc) {
  return request({
    url: 'roles',
    method: "post",
    data: {
      roleName: roleName,
      roleDesc: roleDesc
    }
  })
}
//请求删除角色
export function delateRoles(delateId) {
  return request({
    url: "roles/" + delateId,
    method: "delete"
  })

}

//给角色添加权限的请求
export function addRightsById(rolesId, rid) {
  return request({
    url: "roles/" + rolesId + "/rights",
    method: "post",
    data: {
      rolesId: rolesId,
      rids: rid
    }
  })


}
//获取所有的树形权限
export function getRightsTree() {
  return request({
    url: 'rights/tree'
  })
}