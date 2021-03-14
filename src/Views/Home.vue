<template>
  <div>
    <span @click="dotest">{{ item }}</span>
    <HelloKa msg="123"></HelloKa>
    <hahak></hahak>
     <icok></icok>
  </div>
</template>
    <script>
    import HelloKa from '../components/HelloKa'
import hahak from '../components/HHKa'
import icok from '../components'
export default {
  components: { HelloKa,hahak,icok },
  name: "Home",
  data() {
    return {
      item: "Home:小卡测试哈",
    };
  },
  methods: {
    dotest() {
      var ss = this.$com.testToken();
      alert(ss);
    },
    docr()
    {
      console.log('ka56')
    }
  },
};
</script>