<template>
  <div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="listQuery"
      label-position="left"
      label-width="90px"
      style="width: 400px; margin-left:50px;margin-top: 30px; "
    >
      <el-form-item label="订单号" prop="clOrdId">
        <el-input v-model="listQuery.clOrdId" placeholder="请输入订单号" />
      </el-form-item>
      <el-button type="primary" @click="searchOrder">
        查询
      </el-button>
    </el-form>
    <el-input v-model="resdata" class="mulput" :rows="5" type="textarea" />
    <div style="margin:10px 50px">
      <div>
        <el-tag type="success">px:</el-tag>
        <el-tag> 委托价格</el-tag>
      </div>
      <div>
        <el-tag type="success">state:</el-tag>
        <el-tag> canceled：撤单成功,live：等待成交,partially_filled：部分成交
          filled：完全成交</el-tag>
      </div>
      <div>
        <el-tag type="success">Fee:</el-tag>
        <el-tag> 单交易手续费，平台向用户收取的交易手续费，手续费扣除为负数。如： -0.01</el-tag>
      </div>
      <div>
        <el-tag type="success">sz:</el-tag>
        <el-tag> 委托数量</el-tag>
      </div>
      <div>
        <el-tag type="success">pnl:</el-tag>
        <el-tag> 收益</el-tag>
      </div>
      <div>
        <el-tag type="success">side:</el-tag>
        <el-tag> 订单方向</el-tag>
      </div>
      <div>
        <el-tag type="success">posSide:</el-tag>
        <el-tag> 持仓方向</el-tag>
      </div>
      <div>
        <el-tag type="success">lever:</el-tag>
        <el-tag> 杠杆倍数，0.01到125之间的数值，仅适用于 币币杠杆/交割/永续</el-tag>
      </div>
    </div>

  </div>
</template>
<script>
import { GetOrder } from '@/api/okx'
export default {
  name: 'OKXOrderSearch',
  data() {
    return {
      resdata: null,
      total: 0,
      listLoading: true,
      listQuery: {
        instId: 'ETH-USDT-SWAP',
        clOrdId: ''
      },
      dialogData: {
        expMinute: 10
      },
      dialogStatus: '',
      rules: {
        clOrdId: [{ required: true, message: '请输入订单号', trigger: 'blur' }]
      },
      dialogFormVisible: false
    }
  },
  created() {
  },
  methods: {
    searchOrder() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          GetOrder(this.listQuery).then((response) => {
            this.resdata = JSON.stringify(response.Data)
          })
        }
      })
      //
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
<style scoped>
.mulput{
  width: 700px;
  margin: 10px 50px;
}
</style>
