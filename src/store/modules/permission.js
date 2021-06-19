import { katestRoutes } from '@/router'
import { getMenus } from '@/api/role'
import store from '@/store'
const state = {
  routes: [],
  addRoutes: [],
  isSetmenu: false,
  buttons: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  },
  SET_ISSET: (state, isSetmenu) => {
    state.isSetmenu = isSetmenu
  },
  SET_BUTTON: (state, button) => {
    state.buttons = button
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = katestRoutes
      getMenus().then(response => {
        const ms = response.Data
        for (let index = 0; index < accessedRoutes.length; index++) {
          let valid_child_num = 0
          const res = ms.filter(item => item.Mark === accessedRoutes[index].name)
          if (res.length === 0) {
            accessedRoutes[index].hidden = true
          } else {
            accessedRoutes[index].hidden = false
            const childs = accessedRoutes[index].children
            for (let j = 0; j < childs.length; j++) {
              let childItemName = childs[j].name
              if (childItemName.indexOf('child_') >= 0) {
                childItemName = childItemName.replace('child_', '')
              }
              const res_child = ms.filter(item => item.Mark === childItemName)
              if (res_child.length === 0) {
                childs[j].hidden = true
              } else {
                childs[j].hidden = false
                valid_child_num = valid_child_num + 1
              }
            }
          }
          if (valid_child_num === 0) {
            accessedRoutes[index].hidden = true
          }
        }
        // 取出所有的按钮
        const msbutton = ms.filter(x => x.MenuType === 'Button')
        commit('SET_BUTTON', msbutton)
      })
      store.dispatch('login/admininfo')
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_ISSET', true)
      resolve(accessedRoutes)
    })
  },
  SET_ISSET_false({ commit }) {
    commit('SET_ISSET', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
