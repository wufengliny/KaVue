import request from '@/utils/request'
export function RecentLogin() {
  return request({
    url: '/api/Other/RecentLogin',
    method: 'post'
  })
}
export function ModPwd(data) {
  return request({
    url: '/api/Other/ModPwd',
    method: 'post',
    data
  })
}
export function GetAdminInfo(data) {
  return request({
    url: '/api/Other/GetAdminInfo',
    method: 'post',
    data
  })
}

export function OperateLogType(ControllerName) {
  return request({
    url: '/api/' + ControllerName + '/OperateLogType',
    method: 'post'
  })
}
export function OperateLog(data, ControllerName) {
  return request({
    url: '/api/' + ControllerName + '/OperateLog',
    method: 'post',
    data
  })
}
