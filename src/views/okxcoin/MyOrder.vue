<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-order v-if="activeName==item.key" :type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabOrder from './components/TabOrder'

export default {
  name: 'TabMy',
  components: { TabOrder },
  data() {
    return {
      tabMapOptions: [
        { label: '委托订单', key: '1' },
        { label: '持仓订单', key: '2' },
        { label: '历史订单', key: '3' },
        { label: '全部订单', key: '-1' }
      ],
      activeName: '1',
      createdTimes: 0 // 加载次数
    }
  },
  watch: {
    activeName: {
      handler(newname) {
        this.$router.push(`${this.$route.path}?Statu=${newname}`)
      },
      immediate: true
    }
  }
}
</script>

