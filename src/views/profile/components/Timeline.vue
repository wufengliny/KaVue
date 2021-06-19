<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of logindata" :key="index" :timestamp="item.LoginTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}')" placement="top">
        <el-card>
          <p>登陆信息：<el-tag :type="item.IsSuccess | tagfilger ">
            {{ item.Message }}</el-tag></p>
          <!-- <h4>登陆信息：{{ item.Message }}</h4> -->
          <p>浏览器：{{ item.RequestBrowser }}</p>
          <p>登陆IP：{{ item.ClientIP }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { RecentLogin } from '@/api/other'
export default {
  filters: {
    tagfilger(statu) {
      const statumap = {
        true: 'success',
        false: 'danger'
      }
      return statumap[statu]
    }
  },
  data() {
    return {
      logindata: []
    }
  },
  created() {
    this.getloginData()
  },
  methods: {
    getloginData() {
      RecentLogin().then(response => {
        this.logindata = response.Data
      })
    }
  }
}
</script>
