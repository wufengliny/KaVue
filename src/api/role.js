import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/api/menu/AdminAccessMenu',
    method: 'get'
  })
}
