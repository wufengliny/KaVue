<template>
  <el-dialog title="操作日志" :visible.sync="showgoogledialog" :before-close="hidedialog" width="75%">
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.LogType" class="filter-item">
          <el-option key="0" label="全部" value="0" />
          <el-option v-for="item in logTypes" :key="item.FieldValue" :label="item.FieldDec" :value="item.FieldValue" />
        </el-select>
        <el-date-picker v-model="listQuery.RegBeginTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
        <el-date-picker v-model="listQuery.RegEndTime" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.ID }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.LogType }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作员" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.OperaterAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="IP" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.ClientIP }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内容">
          <template slot-scope="scope">
            <span>{{ scope.row.Message }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>

<script>
import { OperateLog, OperateLogType } from '@/api/power'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    showgoogledialog: {
      type: Boolean,
      default: false
    },
    adminid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      total: 0,
      listLoading: true,
      googledata: {
        serverKey_password: '',
        userKey_password: '',
        id: 0, // 管理员ID
        title: '',
        QrCodeGoogleAPIImg: '',
        isSet: false
      },
      logTypes: null,
      list: null,
      listQuery: {
        LogType: '0',
        page: 1,
        limit: 20
      }
    }
  },
  watch: {
    adminid(val) {
      this.googledata.id = val
    },
    showgoogledialog(val) {
    }
  },
  created() {
    this.getList()
    this.getlogTypes()
  },
  methods: {
    hidedialog() {
      this.$emit('hidedialoOperateLog')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      OperateLog(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    getlogTypes() {
      OperateLogType().then(response => {
        this.logTypes = response.Data
      })
    }
  }
}
</script>
<style>

</style>
