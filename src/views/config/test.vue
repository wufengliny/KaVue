<template>
  <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.ID }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="名称">
      <template slot-scope="scope">
        <span>{{ scope.row.Name }}</span>
      </template>
    </el-table-column>

    <el-table-column label="备注">
      <template slot-scope="{row}">
        <span>{{ row.Memo }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="值">
      <template slot-scope="{row}">
        <el-tag v-if="row.DataType==='Bool'" :type="row.TValue | statusFilter">
          {{ statuinfo[row.TValue] }}
        </el-tag>
        <template v-else-if="row.DataType==='String'&&row.edit">
          <el-input v-model="row.TValue" class="edit-input" type="text" size="small" maxlength="30" show-word-limit />
          <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
            取消
          </el-button>
        </template>
        <template v-else-if="row.DataType==='DateTime'&&row.edit">
          <el-date-picker
            v-model="row.TValue"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="dateclearable"
            size="medium"
          />
          <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
            取消
          </el-button>
        </template>
        <template v-else-if="(row.DataType==='Int'||row.DataType==='Decimal')&&row.edit">
          <el-input v-model="row.TValue" type="number" class="edit-input" size="small" />
          <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
            取消
          </el-button>
        </template>
        <template v-else-if="(row.DataType==='RichString')&&row.edit">
          <el-input v-model="row.TValue" type="textarea" class="edit-input" :rows="5" maxlength="300" show-word-limit size="small" />
          <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
            取消
          </el-button>
        </template>
        <span v-else>{{ row.TValue }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
      <template v-if="checkbuttonPermission('ConfigUpdateSysConfig')" slot-scope="{row}">
        <el-switch
          v-if="row.DataType==='Bool'"
          v-model="row.TValue"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0"
          @change="updateconfig(row)"
        />
        <el-button
          v-if="(row.DataType==='String'||row.DataType==='DateTime'||row.DataType==='Int'||row.DataType==='Decimal'||row.DataType==='RichString')&&row.edit"
          type="success"
          size="small"
          icon="el-icon-circle-check-outline"
          @click="updateconfig(row)"
        >
          保存
        </el-button>
        <el-button
          v-if="(row.DataType==='String'||row.DataType==='DateTime'||row.DataType==='Int'||row.DataType==='Decimal'||row.DataType==='RichString')&&!row.edit"
          type="primary"
          size="small"
          icon="el-icon-edit"
          @click="row.edit=!row.edit"
        >
          编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { SysConfig, UpdateSysConfig } from '@/api/config'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'ConfigSysConfig',
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        isSwitch: true
      },
      loading: false,
      statuinfo: {
        '1': '开',
        '0': '关'
      },
      dateclearable: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      SysConfig(this.listQuery).then(response => {
        const item = response.Data
        this.list = item.map(v => {
          this.$set(v, 'edit', false) // 和下面的以行都是添加新字段  $set 可以和视图实时更新吧 好像
          v.beforeValue = v.TValue
          return v
        })
        this.loading = false
      })
    },
    checkbuttonPermission,
    updateconfig(row) {
      UpdateSysConfig(row).then(() => {
        row.beforeValue = row.TValue
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        row.edit = false
      }).catch(() => {
        row.TValue = row.beforeValue
      })
    },
    cancelEdit(row) {
      row.edit = false
      row.TValue = row.beforeValue
    }
  }
}
</script>

  <style scoped>
  .edit-input {
    width: 80%;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  </style>

