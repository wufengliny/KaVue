<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.GameTypeID" class="filter-item" filterable placeholder="">
        <el-option :key="-1" label="全部" :value="-1" />
        <el-option
          v-for="item in GameTypes"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('CPGameTypeGameAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAdd">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="150" label="类型">
        <template slot-scope="scope">
          {{ scope.row.GameTypeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="游戏名称">
        <template slot-scope="scope">
          <span>{{ scope.row.GameName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('CPGameTypeGameDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="dialogData" label-position="left" label-width="90px" style="width: 600px; margin-left:50px;">
        <el-form-item label="游戏类型" prop="GameTypeID">
          <el-select v-model="dialogData.GameTypeID" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in GameTypes"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏">
          <el-select v-model="dialogData.GameID" class="filter-item" filterable placeholder="请选择">
            <el-option
              v-for="item in games"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GameTypeList, GameTypeGameList, GameTypeGameAdd, GameTypeGameDelete, GetGamesFromCache } from '@/api/game'
import { checkbuttonPermission } from '@/utils/permission'
import { MessageBox } from 'element-ui'
export default {
  name: 'CPGameTypeList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        GameTypeID: -1
      },
      GameTypes: null,
      dialogFormVisible: false,
      dialogData: {
        GameTypeID: 0,
        GameID: 0
      },
      games: null
    }
  },
  created() {
    this.getGameTypes()
    this.getGames()
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      GameTypeGameList(this.listQuery).then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    getGameTypes() {
      GameTypeList().then(response => {
        this.GameTypes = response.Data
        this.dialogData.GameTypeID = response.Data[0].ID
      })
    },
    getGames() {
      GetGamesFromCache().then(response => {
        this.games = response.Data
      })
    },
    reflashdata() {
      this.getList()
    },
    openAdd() {
      this.dialogFormVisible = true
    },
    createData() {
      GameTypeGameAdd(this.dialogData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteData(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        GameTypeGameDelete({ ID: row.ID }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {})
    }
    //
  }
}
</script>

