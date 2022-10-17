import request from '@/utils/request'

export function GetValuation(data) {
  return request({
    // url: 'http://localhost:58545',
    url: '/api/OKXSearch/GetValuation',
    method: 'post',
    data
  })
}

export function GetPositions(data) {
  return request({
    url: '/api/OKXSearch/GetPositions',
    method: 'post',
    data
  })
}

