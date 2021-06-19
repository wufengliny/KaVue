<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="180">
        <template slot-scope="{row}">
          <el-tag :type="row | statusFilter">
            {{ row| statusinfoFilter }}
          </el-tag>
          <el-switch
            v-if="checkbuttonPermission('GameSetOpenClose')"
            v-model="row.OpenClose"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="setcloseopen(row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="维护时间">
        <template slot-scope="scope">
          <span>{{ scope.row.MaintainBeginTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <br>
          <span>{{ scope.row.MaintainEndTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('GameEdit')" size="mini" type="primary" @click="openEditDialog(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="维护开始时间">
          <el-date-picker
            v-model="temp.MaintainBeginTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="dateclearable"
          />
        </el-form-item>
        <el-form-item label="维护结束时间">
          <el-date-picker
            v-model="temp.MaintainEndTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="dateclearable"
          />
        </el-form-item>
        <el-form-item label="维护信息">
          <el-input v-model="temp.MaintainMsg" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" placeholder="维护信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="subData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { gamelist, SetOpenClose, GameEdit } from '@/api/game'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'GameList',
  filters: {
    statusFilter(row) {
      if (row.OpenClose === 0) {
        return 'danger'
      }
      if (row.OpenClose === 1) {
        const datenow = new Date()
        // begin  end
        if (datenow > new Date(row.MaintainBeginTime) && datenow < new Date(row.MaintainEndTime)) {
          return 'warning'
        } else {
          return 'success'
        }
      }
    },
    statusinfoFilter(row) {
      if (row.OpenClose === 0) {
        return '关闭'
      }
      if (row.OpenClose === 1) {
        const datenow = new Date()
        // begin  end
        if (datenow > new Date(row.MaintainBeginTime) && datenow < new Date(row.MaintainEndTime)) {
          return '维护中'
        } else {
          return '正常'
        }
      }
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogFormVisible: false,
      dateclearable: false,
      statuinfo: {
        1: '正常',
        0: '关闭'
      },
      temp: {
        ID: 0,
        MaintainBeginTime: '',
        MaintainEndTime: '',
        MaintainMsg: ''
      }
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.listLoading = true
      gamelist().then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    checkbuttonPermission,
    setcloseopen(row) {
      SetOpenClose(row).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    subData() {
      GameEdit(this.temp).then(() => {
        this.dialogFormVisible = false
        this.getdata()
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    openEditDialog(row) {
      this.temp.ID = row.ID
      this.temp.MaintainBeginTime = row.MaintainBeginTime
      this.temp.MaintainEndTime = row.MaintainEndTime
      if (row.MaintainMsg === '') {
        this.temp.MaintainMsg = '游戏维护中...'
      } else {
        this.temp.MaintainMsg = row.MaintainMsg
      }
      this.dialogFormVisible = true
    }
  }
}
</script>

