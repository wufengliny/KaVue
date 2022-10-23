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
    <el-alert :title="'买入手续费：'+ SumInFee+',卖出手续费：'+SumOutFee+',预计盈利：'+SumProfit" type="success" />
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="150" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.InstId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="230" label="订单号">
        <template slot-scope="scope">
          <el-tag type="success">
            {{ scope.row.OrderNO }}
          </el-tag>
          <el-tag v-if="scope.row.OutOrderNO" type="info">
            {{ scope.row.OutOrderNO }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="90" label="买入价">
        <template slot-scope="scope">
          <span>{{ scope.row.INPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="90" label="挂出价">
        <template slot-scope="scope">
          <span>{{ scope.row.WhenOut }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="70" label="张数">
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
      <el-table-column align="center" width="100" label="当前价">
        <template>
          <span>{{ nowprice }}</span>
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
          <el-button
            v-if="checkbuttonPermission('OKXOrderCancel')&&row.OutOrderNO"
            type="danger"
            size="mini"
            @click="Cancelorder(row)"
          >
            撤销卖单
          </el-button>
          <el-button v-if="checkbuttonPermission('OKXOrderEdit')" type="primary" size="mini" @click="OpenEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑订单" :visible.sync="dialogShowStatu">
      <el-form ref="dataForm" :model="dialogData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="产品ID">
          <el-input v-model="dialogData.instId" readonly="readonly" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="dialogData.clOrdId" readonly="readonly" />
        </el-form-item>
        <el-form-item label="卖出价格">
          <el-input v-model="dialogData.WhenOut" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowStatu = false">
          取消
        </el-button>
        <el-button type="primary" @click="editData">
          保存
        </el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { GetOKXOrderMyOrder, GetTicker, OKXOrderCancel, OKXOrderEdit } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
export default {
  name: 'OKXOrderMyOrder2',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      nowprice: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Statu: 2
      },
      SumInFee: 0,
      SumOutFee: 0,
      SumProfit: 0,
      SumNum: 0,
      dialogFormVisible: false,
      summoney: 0,
      dialogShowStatu: false,
      CamcelData: {
        instId: '',
        clOrdId: ''
      },
      dialogData: {
        instId: '',
        clOrdId: '',
        WhenOut: 0
      }
    }
  },
  created() {
    this.getList()
    this.getTicket()
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
    getTicket() {
      this.listLoading = true
      GetTicker({ Txt: 'ETH-USDT-SWAP' }).then(response => {
        this.nowprice = response.Data.data[0].last
      })
    },
    reflashdata() {
      this.getList()
      this.getTicket()
    },
    Cancelorder(row) {
      MessageBox.confirm('确定要撤消买单挂单吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        this.CamcelData.instId = row.InstId
        this.CamcelData.clOrdId = row.OutOrderNO
        OKXOrderCancel(this.CamcelData).then(() => {
          this.$message({
            message: '撤单成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    OpenEdit(row) {
      this.dialogData.instId = row.InstId
      this.dialogData.clOrdId = row.OutOrderNO
      this.dialogData.WhenOut = row.WhenOut
      this.dialogShowStatu = true
    },
    editData() {
      OKXOrderEdit(this.dialogData).then(() => {
        this.getList()
        this.dialogShowStatu = false
        this.$notify({
          title: 'Success',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
      })
      //
    }
    //
  }
}
</script>

