<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="reflashdata">
        刷新
      </el-button>
    </div>
    <el-tag type="success">买入手续费：</el-tag>
    <el-tag> {{ SumInFee }}</el-tag>
    <el-tag type="success">卖出手续费：</el-tag>
    <el-tag> {{ SumOutFee }}</el-tag>
    <el-tag type="success">预计盈利：</el-tag>
    <el-tag> {{ SumProfit }}</el-tag>
    <el-tag type="success">总张数：</el-tag>
    <el-tag> {{ SumNum }}</el-tag>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="150" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.InstId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="260" label="订单号">
        <template slot-scope="scope">
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
          <el-tag type="success">
            {{ scope.row.InFee }}
          </el-tag>
          <el-tag type="info">
            {{ scope.row.OutFee }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="预计盈利">
        <template slot-scope="scope">
          <span>{{ scope.row.Profit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('OKXOrderCancel')" type="danger" size="mini" @click="Cancelorder(row, $index)">
            撤销挂单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { GetOKXOrderMyOrder, OKXOrderCancel } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
export default {
  name: 'OKXOrderMyOrder',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Statu: 1
      },
      SumInFee: 0,
      SumOutFee: 0,
      SumProfit: 0,
      SumNum: 0,
      rules: {
        foodName: [{ required: true, message: '请输入菜名', trigger: 'blur' }]
      },
      CamcelData: {
        instId: '',
        clOrdId: ''
      },
      summoney: 0,
      timer: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      GetOKXOrderMyOrder(this.listQuery).then(response => {
        this.list = response.Data.Data
        this.SumInFee = response.Data.SumData.SumInFee
        this.SumOutFee = response.Data.SumData.SumOutFee
        this.SumProfit = response.Data.SumData.SumProfit
        this.SumNum = response.Data.SumData.SumNum
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    reflashdata() {
      this.getList()
    },
    Cancelorder(row, index) {
      MessageBox.confirm('确定要撤单吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        this.CamcelData.instId = row.InstId
        this.CamcelData.clOrdId = row.OrderNO
        OKXOrderCancel(this.CamcelData).then(() => {
          this.$message({
            message: '撤单成功',
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

