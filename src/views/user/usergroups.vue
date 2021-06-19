<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.Name" placeholder="会员组名称" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('UserGroupsAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="OpenAdd">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="会员组名称">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="checkbuttonPermission('UserGroupsEdit')" type="primary" size="mini" @click="OpenEdit(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('UserGroupsDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle[dialogType]" :visible.sync="dialogShowStatu">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialogData.name" placeholder="请输入会员组名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowStatu = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogType==='add'?addData():editData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { usergroups, addusergroups, editusergroups, deleteusergroups } from '@/api/user'
import { checkbuttonPermission } from '@/utils/permission'
import { MessageBox } from 'element-ui'
export default {
  name: 'UserGroups',
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
      listLoading: true,
      listQuery: {
        Name: ''
      },
      dialogTitle: {
        edit: '修改',
        add: '添加'
      },
      dialogType: 'add',
      dialogShowStatu: false,
      dialogData: {
        ID: 0,
        name: '',
        memo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入会员组名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      usergroups(this.listQuery).then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    OpenAdd() {
      this.dialogType = 'add'
      this.dialogData.name = ''
      this.dialogData.memo = ''
      this.dialogShowStatu = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    OpenEdit(row) {
      this.dialogType = 'edit'
      this.dialogData.ID = row.ID
      this.dialogData.name = row.Name
      this.dialogData.memo = row.Memo
      this.dialogShowStatu = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addusergroups(this.dialogData).then(() => {
            this.getList()
            this.dialogShowStatu = false
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    editData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editusergroups(this.dialogData).then(() => {
            this.getList()
            this.dialogShowStatu = false
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        deleteusergroups({ ID: row.ID }).then(() => {
          this.$message({
            message: '操作Success',
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

