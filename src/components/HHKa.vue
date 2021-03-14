<template>
    <div >HHKA 组件22</div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store=new  Vuex.Store({
    state:{
        isopen:false,
        enName:'xioaka'
    }
})
console.log(JSON.stringify(store.state))
export default {
    name:'hahak',
    created(){
        console.log(123)
    },
    methods:{
        docr(){
             console.log(123)
        }
    }
}
</script>