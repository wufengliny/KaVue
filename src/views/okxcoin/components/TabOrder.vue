<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.InstId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="买入价">
        <template slot-scope="scope">
          <span>{{ scope.row.INPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="挂出价">
        <template slot-scope="scope">
          <span>{{ scope.row.WhenOut }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('EatEditOrder')" type="success" size="mini" @click="openEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-alert :title="'金额总计:'+ summoney" type="success" />
  </div>
</template>

<script>
import { GetOKXOrderMyOrder } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'OKXOrderMyOrder',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Statu: this.$route.query.Statu
      },
      dialogStatus: '',
      rules: {
        foodName: [{ required: true, message: '请输入菜名', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      activitystatu: false,
      dialogshou: false,
      dialogshouData: {
        seriousNO: 0,
        eatAcount: '',
        receiveMoney: 0
      },
      summoney: 0,
      timer: ''
    }
  },
  created() {
    console.log(this.$route.query.Statu)
    console.log(this.listQuery.Statu)
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      GetOKXOrderMyOrder(this.listQuery).then(response => {
        this.list = response.Data
        this.listLoading = false
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

