import request from '@/utils/request'

export function fetchadminList(data) {
  return request({
    url: '/api/admin/pagelist',
    method: 'post',
    data
  })
}

export function fetchadminGroupALL() {
  return request({
    url: '/api/AdminGroup/All',
    method: 'post'
  })
}

export function addAdminAccount(data) {
  return request({
    url: '/api/Admin',
    method: 'post',
    data
  })
}
export function updateAdminAccount(data) {
  return request({
    url: '/api/Admin/Edit',
    method: 'post',
    data
  })
}

export function updateAdminEnable(data) {
  return request({
    url: '/api/Admin/SetEnable',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/api/Admin/Delete',
    method: 'post',
    data
  })
}

export function fetchadminGroupList(data) {
  return request({
    url: '/api/AdminGroup/PageList',
    method: 'post',
    data
  })
}

export function addAdminGroup(data) {
  return request({
    url: '/api/AdminGroup',
    method: 'post',
    data
  })
}

export function updateAdminGroup(data) {
  return request({
    url: '/api/AdminGroup/Edit',
    method: 'post',
    data
  })
}

export function deleteAdminGroup(data) {
  return request({
    url: '/api/AdminGroup/Delete',
    method: 'post',
    data
  })
}
