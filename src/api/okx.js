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

export function GetOrder(data) {
  return request({
    url: '/api/OKXSearch/GetOrder',
    method: 'post',
    data
  })
}

export function GetTicker(data) {
  return request({
    url: '/api/OKXSearch/GetTicker',
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
export function OKXOrderCancel(data) {
  return request({
    url: '/api/OKXOrder/Cancel',
    method: 'post',
    data
  })
}
export function OKXOrderEdit(data) {
  return request({
    url: '/api/OKXOrder/EditOrder',
    method: 'post',
    data
  })
}

export function OKXGetConfigBase() {
  return request({
    url: '/api/OKXConfig/GetConfigBase',
    method: 'post'
  })
}
export function OKXConfigBaseAdd(data) {
  return request({
    url: '/api/OKXConfig/ConfigBaseAdd',
    method: 'post',
    data
  })
}
export function OKXConfigBaseEdit(data) {
  return request({
    url: '/api/OKXConfig/ConfigBaseEdit',
    method: 'post',
    data
  })
}
export function OKXConfigBaseDefault(data) {
  return request({
    url: '/api/OKXConfig/ConfigBaseDefault',
    method: 'post',
    data
  })
}
