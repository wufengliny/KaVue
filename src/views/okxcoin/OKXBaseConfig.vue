<template>
  <div class="app-container">
    <el-table ref="katable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.EatAcount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="点餐次数">
        <template slot-scope="scope">
          <span>{{ scope.row.EatNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="中奖次数">
        <template slot-scope="scope">
          <span>{{ scope.row.ZJNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="中标概率（中奖次数/点餐次数）">
        <template slot-scope="scope">
          <span>{{ scope.row | rate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { EatRank } from '@/api/eat'
export default {
  name: 'OKXBaseConfig',
  filters: {
    rate(row) {
      let resrate = ''
      if (row.ZJNum === 0 || row.EatNum === 0) {
        resrate = '0'
      } else {
        resrate = ((row.ZJNum / row.EatNum) * 100).toFixed(2)
      }
      return resrate + '%'
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      EatRank().then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>
</style>

