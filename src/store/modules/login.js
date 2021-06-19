import { loginapi, logout } from '@/api/login'
import { GetAdminInfo } from '@/api/other'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '@/store'

const state = {
  token: getToken(),
  userinfo: {
    Account: '',
    AdminGUID: '',
    AdminGroupID: '',
    AdminGroupName: '',
    LastLoginIP: '',
    LastLoginTime: '',
    LoginCount: ''
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo.Account = userinfo.Account
    state.userinfo.AdminGUID = userinfo.AdminGUID
    state.userinfo.AdminGroupID = userinfo.AdminGroupID
    state.userinfo.AdminGroupName = userinfo.AdminGroupName
    state.userinfo.LastLoginIP = userinfo.LastLoginIP
    state.userinfo.LastLoginTime = userinfo.LastLoginTime
    state.userinfo.LoginCount = userinfo.LoginCount
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginapi(userInfo).then(response => {
        const { Data } = response
        commit('SET_TOKEN', Data.Token)
        setToken(Data.Token)
        commit('SET_USERINFO', Data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  admininfo({ commit }) {
    return new Promise((resolve, reject) => {
      GetAdminInfo().then(response => {
        const { Data } = response
        commit('SET_USERINFO', Data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', '')
        store.dispatch('permission/SET_ISSET_false')
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
