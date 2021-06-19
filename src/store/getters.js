const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.login.token,
  userinfo: state => state.login.userinfo,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  isSetmenu: state => state.permission.isSetmenu,
  buttons: state => state.permission.buttons
}
export default getters
