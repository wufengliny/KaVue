<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.operaterAccount" placeholder="账号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.clientIP" placeholder="IP" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.initTime_begin" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
      <el-date-picker v-model="listQuery.initTime_end" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
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

      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.OperaterAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览器">
        <template slot-scope="scope">
          <span>{{ scope.row.RequestBrowser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ClientIP }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求API">
        <template slot-scope="scope">
          <span>{{ scope.row.RequestUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目">
        <template slot-scope="scope">
          <span>{{ scope.row.Project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
        <el-table-column width="100px" prop="key" label="名称" />
        <el-table-column prop="con" label="内容" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { logrequestList, logrequestDetail } from '@/api/log'
import { dateVal } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Request',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
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
        clientIP: '',
        initTime_begin: '',
        initTime_end: '',
        seriesGUID: '',
        source: ''
      },
      detailQuery: {
        ID: 0
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false,
      statuinfo: {
        true: '成功',
        false: '失败'
      },
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
      logrequestList(this.listQuery).then(response => {
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
      logrequestDetail(this.detailQuery).then(response => {
        this.detailData = [
          { key: '账号', con: response.Data.OperaterAccount },
          { key: '请求时间', con: response.Data.AddTime },
          { key: 'RefererUrl', con: response.Data.RefererUrl },
          { key: '请求API', con: response.Data.RequestUrl },
          { key: '浏览器', con: response.Data.RequestBrowser },
          { key: 'UserAgent', con: response.Data.RequestUserAgent },
          { key: 'SeriesGUID', con: response.Data.SeriesGUID },
          { key: '请求数据', con: response.Data.RequestData }
        ]
        this.dialogFormVisible = true
      })
    },
    initTime() {
      if (this.listQuery.initTime_begin === '') {
        this.listQuery.initTime_begin = dateVal().day_start
        this.listQuery.initTime_end = dateVal().day_end
      }
    },
    setQueryTimePre() {
      this.listQuery.initTime_begin = dateVal().preday_start
      this.listQuery.initTime_end = dateVal().preday_end
      this.handleFilter()
    },
    setQueryTimetoday() {
      this.listQuery.initTime_begin = dateVal().day_start
      this.listQuery.initTime_end = dateVal().day_end
      this.handleFilter()
    },
    setQueryTimepreweek() {
      this.listQuery.initTime_begin = dateVal().preweek_start
      this.listQuery.initTime_end = dateVal().preweek_end
      this.handleFilter()
    }
  }
}
</script>
<style scoped>
</style>

