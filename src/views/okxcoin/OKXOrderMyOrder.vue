<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="委托订单" name="1">
        <keep-alive>
          <wei-tuo />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="持仓订单" name="2">
        <keep-alive>
          <tab-haveorder />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="历史订单" name="3">
        <keep-alive>
          <his-order />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WeiTuo from './components/WeiTuo'
import TabHaveorder from './components/TabHaveorder'
import HisOrder from './components/HisOrder'
export default {
  name: 'OKXOrderMyOrder',
  components: { WeiTuo, TabHaveorder, HisOrder },
  data() {
    return {
      tabMapOptions: [
        { label: '委托订单', key: '1' },
        { label: '持仓订单', key: '2' },
        { label: '历史订单', key: '3' }
      ],
      activeName: '1',
      createdTimes: 0 // 加载次数
    }
  },
  watch: {
    activeName: {
      handler(newname) {
      },
      immediate: true
    }
  }
}
</script>

