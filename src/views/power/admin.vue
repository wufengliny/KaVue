<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('PowerAdminAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
      <el-button v-if="checkbuttonPermission('PowerAdminOperateLog')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-document" @click="DialogLog.showlog = true">
        操作日志
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.Account }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理员组">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上次登录">
        <template slot-scope="scope">
          <span>{{ scope.row.LastLoginTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="90" label="登陆次数">
        <template slot-scope="scope">
          <span>{{ scope.row.LoginCount }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.Enable | statusFilter">
            {{ statuinfo[row.Enable] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template v-if="row.ID!=1" slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('PowerAdminEdit')" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdminEnable')&&row.Enable === 2" size="mini" type="success" @click="updateEnable(row, 1)">
            启用
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdminEnable')&&row.Enable === 1" size="mini" type="info" @click="updateEnable(row, 2)">
            禁用
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdminDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdminSetGoogleAuthCode')" type="warning" size="mini" @click="Opendialoggoogle(row)">
            谷歌
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="管理员组" prop="adminGroupID">
          <el-select v-model="temp.adminGroupID" class="filter-item" placeholder="请选择">
            <el-option v-for="item in admingroups" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" placeholder="请输入账号" :readonly="accountReadonly" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd_password">
          <el-input v-show="true" v-model="temppwd" style="width:0;height:0" type="password" />
          <el-input v-model="temp.pwd_password" :type="passwordType" :placeholder="pwdplaceholder" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
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
    <google
      :showgoogledialog.sync="dialogGooglepropData.showgoogledialog"
      :adminid="dialogGooglepropData.adminID"
      @hidedialoggoogle="hidedialoggoogle"
    />
    <operatelog
      :showlog.sync="DialogLog.showlog"
      :controller-name="DialogLog.ControllerName"
      @HideDialogLog="HideDialogLog"
    />
  </div>
</template>
<script>
import { fetchadminList, fetchadminGroupALL, addAdminAccount, updateAdminAccount, updateAdminEnable, deleteAdmin } from '@/api/power'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { MessageBox } from 'element-ui'
import Google from './components/Google'
import operatelog from '../pubcompents/operatelog'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'PowerAdmin',
  components: { Pagination, Google, operatelog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'info'
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
        account: ''
      },
      statuinfo: {
        true: '正常',
        false: '禁用'
      },
      textMap: {
        update: '修改',
        create: '添加'
      },
      rules: {
        adminGroupID: [{ required: true, message: '请选择管理员组', trigger: 'change' }],
        pwd_password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }]
      },
      temp: {
        id: 0,
        account: '',
        pwd_password: '',
        memo: '',
        adminGroupID: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      admingroups: null,
      passwordType: 'password',
      pwdplaceholder: '请输入密码！',
      temppwd: '',
      accountReadonly: false,
      dialogGooglepropData: {
        showgoogledialog: false,
        adminID: 0
      },
      DialogLog: {
        showlog: false,
        ControllerName: 'Admin'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchadminList(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    getAll() {
      this.admingroups = null
      fetchadminGroupALL().then(response => {
        this.admingroups = response.Data
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAdminAccount(this.temp).then(() => {
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
          updateAdminAccount(this.temp).then(() => {
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
    updateEnable(row, enable) {
      updateAdminEnable({ ID: row.ID, Enable: enable }).then(() => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.Enable = enable
      })
    },
    deleteData(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        deleteAdmin({ ID: row.ID }).then(() => {
          this.$message({
            message: '操作Success',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {})
    },
    // 查询
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.rules.pwd_password[0].required = true
      if (this.admingroups === null) {
        this.getAll()
      }
      this.accountReadonly = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.resetTemp()
      if (this.admingroups === null) {
        this.getAll()
      }
      this.accountReadonly = true
      this.rules.pwd_password[0].required = false
      this.pwdplaceholder = '放空不修改'
      this.temp.id = row.ID
      this.temp.account = row.Account
      this.temp.memo = row.Memo
      this.temp.adminGroupID = row.AdminGroupID
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    Opendialoggoogle(row) {
      this.dialogGooglepropData.showgoogledialog = true
      this.dialogGooglepropData.adminID = row.ID
    },
    hidedialoggoogle() {
      this.dialogGooglepropData.showgoogledialog = false
    },
    HideDialogLog() {
      this.DialogLog.showlog = false
    },
    resetTemp() {
      this.temp = {
        id: 0,
        account: '',
        pwd_password: '',
        memo: '',
        adminGroupID: ''
      }
    },
    checkbuttonPermission
  }
}
</script>

