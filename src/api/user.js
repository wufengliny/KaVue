import request from '@/utils/request'

export function loginapi(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: 'http://localhost:8013/api/Login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'http://localhost:8013/api/Admin/LogOut',
    method: 'get'
  })
}
