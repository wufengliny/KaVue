<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.IP" placeholder="IP" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('PowerAdminWhiteIPAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP">
        <template slot-scope="scope">
          <span>{{ scope.row.IP }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="checkbuttonPermission('PowerAdminWhiteIPEdit')" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdminWhiteIPDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 350px; margin-left:50px;">
        <el-form-item label="IP" prop="IP">
          <el-input v-model="dialogData.IP" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.Memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetAdminWhiteIP, AdminWhiteIPAdd, AdminWhiteIPEdit, AdminWhiteIPDelete } from '@/api/power'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { MessageBox } from 'element-ui'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'PowerAdminWhiteIP',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        IP: ''
      },
      dialogData: {
        ID: 0,
        IP: '',
        Memo: ''
      },
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false,
      dialogpowerVisible: false,
      dialogPowerdata: {
        name: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkStrictly: false,
        chkeddata: [],
        expandedID: [],
        powers: []
      },
      menuRequestdata: {
        adminGroupID: 0
      },
      menupowerpostdata: {
        adminGroupID: 0,
        menuIDs: []
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
      GetAdminWhiteIP(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          AdminWhiteIPAdd(this.dialogData).then(() => {
            this.getList()
            this.dialogFormVisible = false
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          AdminWhiteIPEdit(this.dialogData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功',
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
        AdminWhiteIPDelete({ ID: row.ID }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetDialogData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.resetDialogData()
      this.dialogStatus = 'update'
      this.dialogData.ID = row.ID
      this.dialogData.IP = row.IP
      this.dialogData.Memo = row.Memo
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDialogData() {
      this.dialogData = {
        ID: 0,
        IP: '',
        Memo: ''
      }
    }
  }
}
</script>

