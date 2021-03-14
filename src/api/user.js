import request from '@/utils/request'

export function loginapi(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/api/Login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api/Admin/LogOut',
    method: 'get'
  })
}
