<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('OKXConfigAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAdd">
        添加规则
      </el-button>
    </div>
    <el-table ref="katable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="170" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.InstId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="模式">
        <template slot-scope="scope">
          <span>模式 {{ scope.row.TradeMode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row |showtxt }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="180">
        <template slot-scope="{row}">
          <el-switch
            v-if="checkbuttonPermission('OKXConfigEnable')"
            v-model="row.Enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            @change="setcloseopen(row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('OKXConfigEdit')" type="success" size="mini" @click="openEdit(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('OKXConfigDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 600px; margin-left:50px;">
        <el-form-item label="模式" prop="userGroupID">
          <el-select v-model="dialogData.TradeMode" class="filter-item" placeholder="请选择" @change="showTip">
            <el-option
              v-for="item in TradeModes"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
          <el-alert :title="TipTradeMode" type="success" :closable="false" class="okxalert" />
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="dialogData.InstId" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in InstIds"
              :key="item.key"
              :label="item.key"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogData.TradeMode===1" label="买入价格">
          <el-col :span="9">
            <el-input v-model="dialogData.InPrice" type="number" />
          </el-col>
          <el-col class="text-center" :span="5" style="margin: 0 0.5rem">卖出价格</el-col>
          <el-col :span="9">
            <el-input v-model="dialogData.OutPrice" type="number" />
          </el-col>
        </el-form-item>
        <el-form-item label="购买张数">
          <el-input v-model="dialogData.InNum" type="number" />
        </el-form-item>

        <el-form-item v-if="dialogData.TradeMode===2" label="跌多少加仓">
          <el-input v-model="dialogData.DownPoint" type="number" />
        </el-form-item>

        <el-form-item v-if="dialogData.TradeMode===2" label="总张数">
          <el-input v-model="dialogData.TotalNum" type="number" />
        </el-form-item>
        <el-form-item v-if="dialogData.TradeMode===2" label="涨多少卖出">
          <el-input v-model="dialogData.UPOutPoint" type="number" />
        </el-form-item>
        <el-form-item v-if="dialogData.TradeMode===3" label="做T下区间">
          <el-input v-model="dialogData.AreaDown" type="number" />
        </el-form-item>
        <el-form-item v-if="dialogData.TradeMode===3" label="做T上区间">
          <el-input v-model="dialogData.AreaUP" type="number" />
        </el-form-item>
        <el-form-item v-if="(dialogData.TradeMode===1)" label="是否重复">
          <el-switch
            v-model="dialogData.IsReapt"
            active-color="#13ce66"
            inactive-color="gray"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetOKXConfigList, OKXConfigAdd, OKXConfigEdit, OKXConfigDelete, OKXConfigEnable } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
import { MessageBox } from 'element-ui'
export default {
  name: 'OKXConfig',
  filters: {
    showtxt(row) {
      var str = ''
      if (row.TradeMode === 1) {
        str = '买入价格：' + row.InPrice + ',卖出价格：' + row.OutPrice + ',买入' + row.InNum + '张,结束后是否重复:' + ((row.IsReapt) ? '是' : '否')
      } else if (row.TradeMode === 2) {
        str = '每跌' + row.DownPoint + '点,购买' + row.InNum + '张数 涨了' + row.UPOutPoint + '点之后卖出'
      } else if (row.TradeMode === 3) {
        str = '做T区间：' + row.AreaDown + '到' + row.AreaUP + ',买入张数：' + row.InNum + '张'
      }
      return str
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      rules: {
        Name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }]
      },
      dialogData: {
        TradeMode: 1,
        InstId: 'ETH-USDT-SWAP',
        InPrice: 0,
        OutPrice: 0,
        IsReapt: false,
        DownPoint: 20,
        InNum: 1,
        TotalNum: 1,
        UPOutPoint: 10,
        AreaDown: 0,
        AreaUP: 0,
        ID: 0

      },
      TradeModes: [
        { 'key': 1, 'name': '模式1', 'tip': '设定一个买入价格，卖出价格，购买张数（=总张数）， 挂单   订单结束后是否重复' },
        { 'key': 2, 'name': '模式2', 'tip': '获取当前持仓订单的最低价格，如果当前没有仓位，则按最新市价算 每跌破多少 点 购买张数   涨了多少点之后卖出' },
        { 'key': 3, 'name': '模式3', 'tip': '指定价位区间做T  比如13-20  ，低于13买入 高于20卖出  购买张数（=总张数）' }
      ],
      TipTradeMode: '',
      InstIds: [
        { 'key': 'ETH-USDT-SWAP' }
      ]
    }
  },
  created() {
    this.getList()
    this.TipTradeMode = this.TradeModes.filter(x => x.key === this.dialogData.TradeMode)[0].tip
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      GetOKXConfigList().then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    setcloseopen(row) {
      OKXConfigEnable(row).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    showTip() {
      var msg = this.TradeModes.filter(x => x.key === this.dialogData.TradeMode)[0]
      this.TipTradeMode = msg.tip
    },
    openAdd() {
      this.dialogFormVisible = true
      this.dialogData.ID = 0
    },
    openEdit(row) {
      this.dialogFormVisible = true
      this.dialogData.ID = row.ID
      this.dialogData.TradeMode = row.TradeMode
      this.dialogData.InstId = row.InstId
      this.dialogData.InPrice = row.InPrice
      this.dialogData.OutPrice = row.OutPrice
      this.dialogData.IsReapt = row.IsReapt
      this.dialogData.DownPoint = row.DownPoint
      this.dialogData.InNum = row.InNum
      this.dialogData.TotalNum = row.TotalNum
      this.dialogData.UPOutPoint = row.UPOutPoint
      this.dialogData.AreaDown = row.AreaDown
      this.dialogData.AreaUP = row.AreaUP
      //
    },
    createData() {
      if (this.dialogData.ID > 0) {
        OKXConfigEdit(this.dialogData).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        OKXConfigAdd(this.dialogData).then(() => {
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
    },
    deleteData(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        OKXConfigDelete({ ID: row.ID }).then(() => {
          this.$message({
            message: '删除成功',
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
.okxalert{
  padding: 0px;
  line-height: 22px;
  margin-top: 5px;
}
</style>

