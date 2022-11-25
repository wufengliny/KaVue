<template>
  <div>
    <el-dialog
      title="操作日志"
      :visible.sync="showlog"
      :modal-append-to-body="false"
      :before-close="hidedialog"
      width="75%"
    >
      <div class="app-container">
        <div class="filter-container">
          <el-select v-model="listQuery.LogType" class="filter-item" style="width:235px;">
            <el-option key="0" label="全部" value="0" />
            <el-option
              v-for="item in logTypes"
              :key="item.FieldValue"
              :label="item.FieldDec"
              :value="item.FieldValue"
            />
          </el-select>
          <el-date-picker
            v-model="listQuery.BeginTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="filter-item"
            placeholder="开始时间"
          /> ~
          <el-date-picker
            v-model="listQuery.EndTime"
            value-format="yyyy-MM-dd 23:59:59"
            format="yyyy-MM-dd 23:59:59"
            type="datetime"
            class="filter-item"
            placeholder="结束时间"
          />
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
          <el-table-column align="center" label="类型" width="210">
            <template slot-scope="scope">
              <span>{{ scope.row.LogType | typeFilter(logTypes) }}</span>
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
          <el-table-column align="center" label="时间" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="内容">
            <template slot-scope="scope">
              <div class="txtmessage">
                <svg-icon icon-class="search" @click="showDetailMsg(scope.row.Message)" />
                <span>{{ scope.row.Message }}</span>
              </div>
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
    <el-dialog title="详情" :append-to-body="true" :visible.sync="showDetailDialog" width="500px">
      <div>{{ dMsg }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDetailDialog = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { OperateLog, OperateLogType } from '@/api/other'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  filters: {
    typeFilter(type, logTypes) {
      var res = logTypes.filter(x => x.FieldValue === type.toString())
      if (res.length !== 0) {
        return res[0].FieldDec
      } else {
        return type
      }
    }
  },
  props: {
    showlog: {
      type: Boolean,
      default: false
    },
    ControllerName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      listLoading: false,
      logTypes: null,
      list: null,
      listQuery: {
        LogType: '0',
        page: 1,
        limit: 20,
        BeginTime: '',
        EndTime: ''
      },
      showDetailDialog: false,
      dMsg: ''
    }
  },
  watch: {
    showlog(cur) {
      if (cur) {
        if (this.logTypes === null) {
          this.getlogTypes()
        }
        this.getList()
      }
    }
  },
  created() {
    // 这里不能在这里直接查询，否则在主页面还未点击按钮弹出的时候，就开始执行了，如果没有权限会提示权限不足
    // if (showlog) {
    //   this.getlogTypes()
    //   this.getList()
    // }
  },
  methods: {
    hidedialog() {
      this.$emit('HideDialogLog')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      OperateLog(this.listQuery, this.ControllerName).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    getlogTypes() {
      OperateLogType(this.ControllerName).then(response => {
        this.logTypes = response.Data
      })
    },
    showDetailMsg(msg) {
      this.dMsg = msg
      this.showDetailDialog = true
    }
  }
}
</script>
<style>
/* 文字过长显示省略号 */
.txtmessage {
  overflow: hidden;
  width: 500px;  /* 一定要加宽度 */
  text-overflow: ellipsis;   /* 溢出用省略号  */
  white-space: nowrap;  /*  溢出不换行 */
  text-align: left;
}
</style>
