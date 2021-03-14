<template>
    <div >
        <p >num: {{count}}</p>
        </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store=new Vuex.Store({
    state:{
        num:20,
        name:'小卡'
    },
    mutations:{
        add(state){
           state.num++
        }
    }
})
store.commit("add")
console.log(store.state.num)
console.log(JSON.stringify(store.state))
export default {
    name:'icok',
    data() {
        return {
            count:store.state.num
        }
    },
}


</script>