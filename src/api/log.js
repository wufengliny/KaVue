import request from '@/utils/request'

export function logloginList(data) {
  return request({
    url: '/api/LogLogin/PageList',
    method: 'post',
    data
  })
}

export function logloginDetail(data) {
  return request({
    url: '/api/LogLogin/GetByID',
    method: 'post',
    data
  })
}
export function logrequestList(data) {
  return request({
    url: '/api/LogRequest/PageList',
    method: 'post',
    data
  })
}
export function logrequestDetail(data) {
  return request({
    url: '/api/LogRequest/GetByID',
    method: 'post',
    data
  })
}
