import Vue from 'vue'
import Router from 'vue-router'
import Login from './Views/Login.vue'
import Home from './Views/Home.vue'
import Test from './Views/Test.vue'

Vue.use(Router);
const routes=[
    {
        path:'/',
        redirect:'/Home'
    },
    {
        //  //动态路径参数，以冒号开头，如果有多个参数则继续往后面追加  http://localhost:8080/#/test/:sss/:ss
        path:'/Test/:id/:name',
        name:'Test',
        component:Test
    },
    {
        path:'/Login',
        name:'Login',
        component:Login
    },
    {
        path:'/Home',
        name:'Home',
        component:Home
    },
]
export default new Router({
    routes
});