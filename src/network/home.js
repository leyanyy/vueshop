import { request } from './request'
//获取左侧总的菜单
export function getMenuList() {
  return request({
    url: 'menus'
  })
}