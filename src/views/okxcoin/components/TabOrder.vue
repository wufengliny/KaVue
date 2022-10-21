<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="150" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.InstId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="260" label="订单号">
        <template slot-scope="scope">
          <el-tag type="success">
            {{ scope.row.OrderOKX }}
          </el-tag>
          <el-tag type="info">
            {{ scope.row.OrderNO }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="买入价">
        <template slot-scope="scope">
          <span>{{ scope.row.INPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="挂出价">
        <template slot-scope="scope">
          <span>{{ scope.row.WhenOut }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="张数">
        <template slot-scope="scope">
          <span>{{ scope.row.Num }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="手续费">
        <template slot-scope="scope">
          <span>{{ scope.row.Profit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="预计盈利">
        <template slot-scope="scope">
          <span>{{ scope.row.Profit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('EatEditOrder')" type="success" size="mini" @click="openEdit(row)">
            撤销挂单
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

