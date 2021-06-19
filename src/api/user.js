import request from '@/utils/request'

export function Users(data) {
  return request({
    url: '/api/Users/Users',
    method: 'post',
    data
  })
}
export function getuserParentInfo(data) {
  return request({
    url: '/api/Users/GetUserParentInfo',
    method: 'post',
    data
  })
}
export function UsersAdd(data) {
  return request({
    url: '/api/Users/UsersAdd',
    method: 'post',
    data
  })
}
export function UsersEdit(data) {
  return request({
    url: '/api/Users/UsersEdit',
    method: 'post',
    data
  })
}
export function UsersState(data) {
  return request({
    url: '/api/Users/UsersState',
    method: 'post',
    data
  })
}
export function UserDetail(data) {
  return request({
    url: '/api/Users/UserDetail',
    method: 'post',
    data
  })
}
export function UserGroupSet(data) {
  return request({
    url: '/api/Users/UserGroupSet',
    method: 'post',
    data
  })
}
export function UserAgentSet(data) {
  return request({
    url: '/api/Users/UserAgentSet',
    method: 'post',
    data
  })
}
export function usergroups(data) {
  return request({
    url: '/api/Users/UserGroups',
    method: 'post',
    data
  })
}
export function addusergroups(data) {
  return request({
    url: '/api/Users/UserGroupsAdd',
    method: 'post',
    data
  })
}
export function editusergroups(data) {
  return request({
    url: '/api/Users/UserGroupsEdit',
    method: 'post',
    data
  })
}
export function deleteusergroups(data) {
  return request({
    url: '/api/Users/UserGroupsDelete',
    method: 'post',
    data
  })
}
