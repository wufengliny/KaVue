<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('EatCreateSerious')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAdd">
        开启一个新的点餐活动
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.BeginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.EndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最大">
        <template slot-scope="scope">
          <span>{{ scope.row.MaxRandom }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="冠军">
        <template slot-scope="scope">
          <span>{{ scope.row.ZJAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row | tagFilter">
            {{ scope.row | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('EatEndAcivity')&&showopenEndButto(row,'open', $index)" type="primary" size="mini" @click="endActivity(false)">
            开启
          </el-button>
          <el-button v-if="checkbuttonPermission('EatEndAcivity')&&showopenEndButto(row,'end', $index)" type="danger" size="mini" @click="endActivity(true)">
            关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="开启一个新的点餐活动" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="时间/分钟" prop="expMinute">
          <el-input v-model="dialogData.expMinute" placeholder="单位分钟" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Acivity, CreateSerious, EndAcivity } from '@/api/eat'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'EatAcivity',
  components: { Pagination },
  filters: {
    statusFilter(row) {
      const date = new Date()
      const dateBegin = new Date(row.BeginTime)
      const dateEnd = new Date(row.EndTime)
      let isended = true
      if (dateBegin < date && dateEnd > date && row.IsEnd === false) {
        isended = false
      } else {
        isended = true
      }
      if (isended) {
        return '结束'
      } else {
        return '进行中'
      }
    },
    tagFilter(row) {
      const date = new Date()
      const dateBegin = new Date(row.BeginTime)
      const dateEnd = new Date(row.EndTime)
      let isended = true
      if (dateBegin < date && dateEnd > date && row.IsEnd === false) {
        isended = false
      } else {
        isended = true
      }
      if (isended) {
        return 'danger'
      } else {
        return 'success'
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogData: {
        expMinute: 10
      },
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      Acivity(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    checkIsEnd(row) {
      const date = new Date()
      const dateBegin = new Date(row.BeginTime)
      const dateEnd = new Date(row.EndTime)
      if (dateBegin < date && dateEnd > date && row.IsEnd === false) {
        return false
      } else {
        return true
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          CreateSerious(this.dialogData).then(() => {
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
    endActivity(type) {
      EndAcivity({ isEed: type }).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    openAdd() {
      this.dialogFormVisible = true
    },
    showopenEndButto(row, type, i) {
      if (this.listQuery.page !== 1) {
        return false
      }
      if (i !== 0) {
        return false
      }
      const date = new Date()
      const dateBegin = new Date(row.BeginTime)
      const dateEnd = new Date(row.EndTime)
      let isended = true
      if (dateBegin < date && dateEnd > date && row.IsEnd === false) {
        isended = false
      } else {
        isended = true
      }
      if (isended) {
        if (type === 'open') {
          return true
        } else {
          return false
        }
      } else {
        if (type === 'open') {
          return false
        } else {
          return true
        }
      }
    },
    handleUpdate(row) {
      this.resetDialogData()
      this.dialogStatus = 'update'
      this.dialogData.ID = row.ID
      this.dialogData.name = row.Name
      this.dialogData.memo = row.Memo
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDialogData() {
      this.dialogData = {
        ID: 0,
        name: '',
        memo: ''
      }
    }
  }
}
</script>

