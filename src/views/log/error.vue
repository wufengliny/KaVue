<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.operaterAccount" placeholder="账号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.clientIP" placeholder="IP" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.addTime_begin" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
      <el-date-picker v-model="listQuery.addTime_end" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="default" @click="setQueryTimetoday()">
        今天
      </el-button>
      <el-button class="filter-item" type="default" @click="setQueryTimePre()">
        昨天
      </el-button>
      <el-button class="filter-item" type="default" @click="setQueryTimepreweek()">
        上周
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.OperaterAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览器" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.RequestBrowser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求API" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.RequestUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.Project }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.Message | txtfilter(100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="default" size="mini" @click="handleDetail(row)">
            详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :visible.sync="dialogFormVisible" title="详细">
      <el-table :data="detailData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="con" align="center" label="信息" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { logerrortList } from '@/api/log'
import { dateVal } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Error',
  components: { Pagination },
  filters: {
    txtfilter(con, num) {
      if (con.length > num) {
        con = con.slice(0, num) + '......'
      }
      return con
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        operaterAccount: '',
        project: '',
        addTime_begin: '',
        addTime_end: '',
        seriesGUID: ''
      },
      detailQuery: {
        ID: 0
      },
      dialogStatus: '',
      dialogFormVisible: false,
      chksourceOptions: [{ label: '全部', key: '' }, { label: '电脑', key: 'PC' }, { label: '移动端', key: 'Wap' }],
      detailData: []
    }
  },
  created() {
    this.getList()
    this.initTime()
  },
  methods: {
    getList() {
      this.listLoading = true
      logerrortList(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.detailQuery.ID = row.ID
      this.detailData = [
        { key: '详细', con: row.Message }
      ]
      this.dialogFormVisible = true
    },
    initTime() {
      if (this.listQuery.addTime_begin === '') {
        this.listQuery.addTime_begin = dateVal().day_start
        this.listQuery.addTime_end = dateVal().day_end
      }
    },
    setQueryTimePre() {
      this.listQuery.addTime_begin = dateVal().preday_start
      this.listQuery.addTime_end = dateVal().preday_end
      this.handleFilter()
    },
    setQueryTimetoday() {
      this.listQuery.addTime_begin = dateVal().day_start
      this.listQuery.addTime_end = dateVal().day_end
      this.handleFilter()
    },
    setQueryTimepreweek() {
      this.listQuery.addTime_begin = dateVal().preweek_start
      this.listQuery.addTime_end = dateVal().preweek_end
      this.handleFilter()
    }
  }
}
</script>
<style scoped>
</style>

