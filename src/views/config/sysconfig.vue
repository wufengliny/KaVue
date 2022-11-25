<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('ConfigOperateLog')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-document" @click="DialogLog.showlog = true">
        操作日志
      </el-button>
    </div>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <operatelog
      :showlog.sync="DialogLog.showlog"
      :controller-name="DialogLog.ControllerName"
      @HideDialogLog="HideDialogLog"
    />
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import operatelog from '../pubcompents/operatelog'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'ConfigSysConfig',
  components: { TabPane, operatelog },
  data() {
    return {
      tabMapOptions: [
        { label: '系统安全', key: 'SafeConfig' },
        { label: 'OKX配置', key: 'OKXConfig' },
        { label: '测试', key: 'TestConfig' }
      ],
      activeName: 'SafeConfig',
      createdTimes: 0, // 加载次数
      DialogLog: {
        showlog: false,
        ControllerName: 'Config'
      }
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
    },
    HideDialogLog() {
      this.DialogLog.showlog = false
    },
    checkbuttonPermission
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
