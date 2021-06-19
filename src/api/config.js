import request from '@/utils/request'

export function SysConfig(data) {
  return request({
    url: '/api/Config/SysConfig',
    method: 'post',
    data
  })
}
export function UpdateSysConfig(data) {
  return request({
    url: '/api/Config/UpdateSysConfig',
    method: 'post',
    data
  })
}
