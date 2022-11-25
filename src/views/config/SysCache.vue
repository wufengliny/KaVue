<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-if="checkbuttonPermission('ClearCache')"
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete-solid"
        @click="Clearche('all')"
      >
        清楚全部缓存
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('ClearCache')" class="el-icon-delete-solid" size="mini" type="warning" @click="Clearche(row.Key)">
            清楚缓存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <operatelog
      :showlog.sync="DialogLog.showlog"
      :controller-name="DialogLog.ControllerName"
      @HideDialogLog="HideDialogLog"
    />
  </div>
</template>
<script>
import { ClearCache } from '@/api/other'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'SysCache',
  data() {
    return {
      list: [
        { 'ID': 1, 'Name': '权限菜单', 'Key': 'AdminAccessMenu' },
        { 'ID': 2, 'Name': '系统参数', 'Key': 'SysConfigs' }
      ],
      total: 0,
      listLoading: false,
      DialogLog: {
        showlog: false,
        ControllerName: 'AdminWhiteIP'
      }
    }
  },
  created() {

  },
  methods: {
    checkbuttonPermission,
    HideDialogLog() {
      this.DialogLog.showlog = false
    },
    Clearche(key) {
      ClearCache({ Key: key }).then(() => {
        this.$message({
          message: '清楚成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

