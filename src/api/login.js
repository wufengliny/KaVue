import request from '@/utils/request'

export function loginapi(data) {
  return request({
    // url: 'http://localhost:58545',
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

export function LoginConfig() {
  return request({
    url: '/api/Login/LoginConfig',
    method: 'post'
  })
}

export function GetCodeImg(data) {
  return request({
    url: '/api/Vcode',
    method: 'post',
    data
  })
}
