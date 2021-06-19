<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.gameID" class="filter-item" filterable placeholder="请选择">
        <el-option
          v-for="item in Gamedata"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID"
        />
      </el-select>
      <el-input v-model="listQuery.caseNumber" placeholder="期号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.beginTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
      <el-date-picker v-model="listQuery.endTime" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('GameCPOpenResultAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAddDialog">
        添加
      </el-button>
      <quick-time @queryByButtonTime="queryByButtonTime" />
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="游戏名称">
        <template slot-scope="scope">
          <span>{{ scope.row.GameName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="期号">
        <template slot-scope="scope">
          <span>{{ scope.row.CaseNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖号码">
        <template slot-scope="scope">
          <el-tag type="danger">
            {{ scope.row.OpenNumber }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖时间">
        <template slot-scope="scope">
          <span>{{ scope.row.OpenTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('GameCPOpenResultEdit')" type="primary" size="mini" @click="openeditDialog(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('GameCPOpenResultDetail')" type="default" size="mini" @click="openDetail(row)">
            详细
          </el-button>
          <el-button v-if="checkbuttonPermission('GameCPOpenResultDelete')" type="danger" size="mini" @click="Deletedata(row, $index)">
            删除
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
    <add
      :showadddialog.sync="addDialog.showdialog"
      :gamedatas="Gamedata"
      :gameid="listQuery.gameID"
      @hideaddDialog="hideaddDialog"
    />
    <edit
      :showeditdialog.sync="editdialog.showdialog"
      :gamedatas="Gamedata"
      :editrow="editrow"
      @hideeditDialog="hideeditDialog"
    />
  </div>
</template>
<script>
import { CPOpenResult, GetGamesFromCache, CPOpenResultDetail, CPOpenResultDelete } from '@/api/game'
import { dateVal } from '@/utils/index'
import { MessageBox } from 'element-ui'
import QuickTime from '@/components/QuickTime'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import add from './components/add'
import edit from './components/edit'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'GameCPOpenResult',
  components: { Pagination, QuickTime, add, edit },
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
      Gamedata: [],
      listQuery: {
        page: 1,
        limit: 20,
        gameID: 1,
        beginTime: '',
        endTime: '',
        caseNumber: ''
      },
      dialogFormVisible: false,
      addDialog: {
        showdialog: false
      },
      editdialog: {
        showdialog: false
      },
      editrow: {},
      detailData: [],
      detailQuery: {
        ID: 0
      }
    }
  },
  created() {
    this.getGame()
    this.getList()
    this.initTime()
  },
  methods: {
    checkbuttonPermission,
    getGame() {
      GetGamesFromCache().then(response => {
        this.Gamedata = response.Data
      })
    },
    getList() {
      this.listLoading = true
      CPOpenResult(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    queryByButtonTime(data) {
      this.listQuery.beginTime = data.begin
      this.listQuery.endTime = data.end
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    initTime() {
      if (this.listQuery.beginTime === '') {
        this.listQuery.beginTime = dateVal().day_start
        this.listQuery.endTime = dateVal().day_end
      }
    },
    openAddDialog() {
      this.addDialog.showdialog = true
    },
    hideaddDialog(isok) {
      this.addDialog.showdialog = false
      if (isok) {
        this.getList()
      }
    },
    openeditDialog(row) {
      this.editdialog.showdialog = true
      this.editrow = row
    },
    hideeditDialog(isok) {
      this.editdialog.showdialog = false
      if (isok) {
        this.getList()
      }
    },
    openDetail(row) {
      this.detailQuery.ID = row.ID
      CPOpenResultDetail(this.detailQuery).then(response => {
        this.detailData = [
          { key: '彩种', con: response.Data.GameName },
          { key: '期号', con: response.Data.CaseNumber },
          { key: '开奖号码', con: response.Data.OpenNumber },
          { key: '开奖时间', con: response.Data.OpenTime },
          { key: '添加时间', con: response.Data.AddTime },
          { key: '备注', con: response.Data.Memo },
          { key: '系统备注', con: response.Data.SysMemo },
          { key: '来源地址', con: response.Data.FromUrl },
          { key: '来源', con: response.Data.FromAPP }
        ]
      })
      this.dialogFormVisible = true
    },
    Deletedata(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        CPOpenResultDelete({ ID: row.ID }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
</style>

