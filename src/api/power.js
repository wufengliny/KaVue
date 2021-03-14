import request from '@/utils/request'

export function fetchadminList(data) {
  return request({
    url: 'http://localhost:8013/api/admin/pagelist',
    method: 'post',
    data
  })
}

export function fetchadminGroupALL() {
  return request({
    url: 'http://localhost:8013/api/AdminGroup/All',
    method: 'post'
  })
}

export function addAdminAccount(data) {
  return request({
    url: 'http://localhost:8013/api/Admin',
    method: 'post',
    data
  })
}
export function updateAdminAccount(data) {
  return request({
    url: 'http://localhost:8013/api/Admin/Edit',
    method: 'post',
    data
  })
}

export function updateAdminEnable(data) {
  return request({
    url: 'http://localhost:8013/api/Admin/SetEnable',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: 'http://localhost:8013/api/Admin/Delete',
    method: 'post',
    data
  })
}

export function fetchadminGroupList(data) {
  return request({
    url: 'http://localhost:8013/api/AdminGroup/PageList',
    method: 'post',
    data
  })
}

export function addAdminGroup(data) {
  return request({
    url: 'http://localhost:8013/api/AdminGroup',
    method: 'post',
    data
  })
}

export function updateAdminGroup(data) {
  return request({
    url: 'http://localhost:8013/api/AdminGroup/Edit',
    method: 'post',
    data
  })
}

export function deleteAdminGroup(data) {
  return request({
    url: 'http://localhost:8013/api/AdminGroup/Delete',
    method: 'post',
    data
  })
}
