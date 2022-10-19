<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('OKXConfigAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAdd">
        添加规则
      </el-button>
    </div>
    <el-table ref="katable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="商家名称">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('EatShopEdit')" type="success" size="mini" @click="openEdit(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('EatShopDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 600px; margin-left:50px;">
        <el-form-item label="模式" prop="userGroupID">
          <el-select v-model="dialogData.TradeMode" class="filter-item" filterable placeholder="请选择" @change="showTip">
            <el-option
              v-for="item in TradeModes"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
          <el-alert :title="TipTradeMode" type="success" />
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="dialogData.Name" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.TradeMode" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
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
import { GetOKXConfigList } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'OKXConfig',
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      rules: {
        Name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }]
      },
      dialogData: {
        TradeMode: '',
        Image1: '',
        Image2: '',
        Image3: '',
        Memo: ''
      },
      TradeModes: [
        { 'key': 1, 'name': '模式1', 'tip': '设定一个买入价格，卖出价格，购买张数（=总张数）， 挂单   订单结束后是否重复' },
        { 'key': 2, 'name': '模式2', 'tip': '获取当前持仓订单的最低价格，如果当前没有仓位，则按最新市价算 每跌破多少 点 购买张数   涨了多少点之后卖出' },
        { 'key': 3, 'name': '模式3', 'tip': '指定价位区间做T  比如13-20  ，低于13买入 高于20卖出  购买张数（=总张数）' }
      ],
      TipTradeMode: 'ssssdd'
    }
  },
  created() {
    this.getList()
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
    showTip() {
      console.log(this.dialogData.TradeMode)
    },
    openAdd() {
      this.dialogFormVisible = true
    }
    // createData() {
    //   EatShopAdd(this.dialogData).then(() => {
    //     this.getList()
    //     this.dialogFormVisible = false
    //     this.$notify({
    //       title: 'Success',
    //       message: '添加成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //   })
    // },
    // deleteData(row, index) {
    //   MessageBox.confirm('确定要删除吗？', '提醒', {
    //     type: 'warning'
    //   }).then(() => {
    //     EatShopDelete({ ID: row.ID }).then(() => {
    //       this.$message({
    //         message: '操作Success',
    //         type: 'success'
    //       })
    //       this.list.splice(index, 1)
    //     })
    //   }).catch(() => {})
    // }
    //
  }
}
</script>
<style scoped>
.imglists{
  margin: 5px;
}
</style>

