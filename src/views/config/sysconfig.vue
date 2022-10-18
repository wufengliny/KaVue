<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '系统安全', key: 'SafeConfig' },
        { label: 'OKX配置', key: 'OKXConfig' },
        { label: '测试', key: 'TestConfig' }
      ],
      activeName: 'SafeConfig',
      createdTimes: 0 // 加载次数
    }
  },
  watch: {
    activeName: {
      handler(newname) {
        this.$router.push(`${this.$route.path}?Category=${newname}`)
      },
      immediate: true
    }
  },
  created() {
    // init the default selected tab
    const Category = this.$route.query.Category
    if (Category) {
      this.activeName = Category
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
