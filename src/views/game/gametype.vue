<template>
  <div class="app-container">
    <div class="filter-container" />
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="150" label="类型">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="游戏">
        <template slot-scope="scope">
          <span>{{ scope.row.Games }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GameTypeList } from '@/api/game'
export default {
  name: 'CPGameTypeList',
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
      GameTypeList().then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    reflashdata() {
      this.getList()
    }
    //
  }
}
</script>

