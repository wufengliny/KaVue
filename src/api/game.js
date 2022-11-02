import request from '@/utils/request'

export function gamelist(data) {
  return request({
    url: '/api/game/list',
    method: 'post',
    data
  })
}
export function GetGamesFromCache() {
  return request({
    url: '/api/game/GetGamesFromCache',
    method: 'post'
  })
}
export function SetOpenClose(data) {
  return request({
    url: '/api/Game/SetOpenClose',
    method: 'post',
    data
  })
}
export function GameEdit(data) {
  return request({
    url: '/api/Game/Edit',
    method: 'post',
    data
  })
}
export function GetGameCategory(data) {
  return request({
    url: '/api/Game/GetGameCategoryByGameID',
    method: 'post',
    data
  })
}
export function GetMethod(data) {
  return request({
    url: '/api/Game/GetGameMethosByCategoryID',
    method: 'post',
    data
  })
}
export function GetRate(data) {
  return request({
    url: '/api/Game/GameRateList',
    method: 'post',
    data
  })
}
export function EditRate(data) {
  return request({
    url: '/api/Game/EditRate',
    method: 'post',
    data
  })
}
export function CPOpenResult(data) {
  return request({
    url: '/api/Game/CPOpenResult',
    method: 'post',
    data
  })
}
export function CPOpenResultAdd(data) {
  return request({
    url: '/api/Game/CPOpenResultAdd',
    method: 'post',
    data
  })
}
export function CPOpenResultEdit(data) {
  return request({
    url: '/api/Game/CPOpenResultEdit',
    method: 'post',
    data
  })
}
export function CPOpenResultDetail(data) {
  return request({
    url: '/api/Game/CPOpenResultDetail',
    method: 'post',
    data
  })
}
export function CPOpenResultDelete(data) {
  return request({
    url: '/api/Game/CPOpenResultDelete',
    method: 'post',
    data
  })
}

export function GameTypeList() {
  return request({
    url: '/api/Game/CPGameTypeList',
    method: 'post'
  })
}

export function GameTypeGameList(data) {
  return request({
    url: '/api/Game/GameTypeGameList',
    method: 'post',
    data
  })
}
export function GameTypeGameAdd(data) {
  return request({
    url: '/api/Game/GameTypeGameAdd',
    method: 'post',
    data
  })
}

export function GameTypeGameDelete(data) {
  return request({
    url: '/api/Game/GameTypeGameDelete',
    method: 'post',
    data
  })
}
