<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.operaterAccount" placeholder="账号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.APIInfo" placeholder="路由模糊查询" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.APIType" style="width: 160px" class="filter-item">
        <el-option v-for="item in chkapitype" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.clientIP" placeholder="IP" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.initTime_begin" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
      <el-date-picker v-model="listQuery.initTime_end" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <quick-time @queryByButtonTime="queryByButtonTime" />
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
      <el-table-column align="center" label="操作路由">
        <template slot-scope="scope">
          <span>{{ scope.row.APIInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作类型">
        <template slot-scope="scope">
          <span>{{ chkapitype.find((item) => item.key==scope.row.APIType).label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ClientIP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('LogRequestDetail')" type="default" size="mini" @click="handleDetail(row)">
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
import QuickTime from '@/components/QuickTime'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'LogRequest',
  components: { Pagination, QuickTime },
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
        source: '',
        APIInfo: '',
        APIType: '0'
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
      chkapitype: [{ label: '==操作类型==', key: '0' },
        { label: '页面加载', key: '1' },
        { label: '数据编辑', key: '2' },
        { label: '数据删除', key: '3' },
        { label: '其它', key: '4' }
      ],
      detailData: []
    }
  },
  created() {
    this.getList()
    this.initTime()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      logrequestList(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    queryByButtonTime(data) {
      this.listQuery.initTime_begin = data.begin
      this.listQuery.initTime_end = data.end
      this.handleFilter()
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
          { key: '操作路由', con: response.Data.APIInfo },
          { key: '浏览器', con: response.Data.RequestBrowser },
          { key: '项目', con: response.Data.Project },
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
    }
  }
}
</script>
<style scoped>
</style>

