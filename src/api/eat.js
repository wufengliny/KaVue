import request from '@/utils/request'

export function Current(data) {
  return request({
    url: '/api/Eat/Current',
    method: 'post',
    data
  })
}
export function eatuser() {
  return request({
    url: '/api/Eat/EatUsers',
    method: 'post'
  })
}
export function ShouQian(data) {
  return request({
    url: '/api/Eat/ShouQian',
    method: 'post',
    data
  })
}
export function ZhaoLing(data) {
  return request({
    url: '/api/Eat/ZhaoLing',
    method: 'post',
    data
  })
}
export function OrderList(data) {
  return request({
    url: '/api/Eat/OrderList',
    method: 'post',
    data
  })
}
export function Acivity(data) {
  return request({
    url: '/api/Eat/Acivity',
    method: 'post',
    data
  })
}
export function CreateSerious(data) {
  return request({
    url: '/api/Eat/CreateSerious',
    method: 'post',
    data
  })
}
export function EndAcivity(data) {
  return request({
    url: '/api/Eat/EndAcivity',
    method: 'post',
    data
  })
}
export function AddOrder(data) {
  return request({
    url: '/api/Eat/AddOrder',
    method: 'post',
    data
  })
}
export function EditOrder(data) {
  return request({
    url: '/api/Eat/EditOrder',
    method: 'post',
    data
  })
}

export function EatRank() {
  return request({
    url: '/api/Eat/Rank',
    method: 'post'
  })
}

export function EatShopList() {
  return request({
    url: '/api/Eat/EatShopList',
    method: 'post'
  })
}
export function EatShopAdd(data) {
  return request({
    url: '/api/Eat/EatShopAdd',
    method: 'post',
    data
  })
}
export function EatShopEdit(data) {
  return request({
    url: '/api/Eat/EatShopEdit',
    method: 'post',
    data
  })
}
export function EatShopDelete(data) {
  return request({
    url: '/api/Eat/EatShopDelete',
    method: 'post',
    data
  })
}
