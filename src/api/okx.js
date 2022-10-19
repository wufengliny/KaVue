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

export function GetOKXConfigList(data) {
  return request({
    url: '/api/OKXConfig/PageList',
    method: 'post',
    data
  })
}

export function OKXConfigAdd(data) {
  return request({
    url: '/api/OKXConfig/Add',
    method: 'post',
    data
  })
}
export function OKXConfigEdit(data) {
  return request({
    url: '/api/OKXConfig/Edit',
    method: 'post',
    data
  })
}
export function OKXConfigDelete(data) {
  return request({
    url: '/api/OKXConfig/Delete',
    method: 'post',
    data
  })
}
export function OKXConfigEnable(data) {
  return request({
    url: '/api/OKXConfig/Enable',
    method: 'post',
    data
  })
}

export function GetOKXOrderMyOrder(data) {
  return request({
    url: '/api/OKXOrder/MyOrder',
    method: 'post',
    data
  })
}
