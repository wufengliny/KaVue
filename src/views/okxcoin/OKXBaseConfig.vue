<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('OKXBaseConfigAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="OpenAdd">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.TradeProduct }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总张数">
        <template slot-scope="scope">
          <span>{{ scope.row.TotalNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="是否默认">
        <template slot-scope="scope">
          <el-switch
            v-if="checkbuttonPermission('OKXBaseConfigEdit')"
            v-model="scope.row.IsDefault"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            @change="setDefault(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('OKXBaseConfigEdit')" type="primary" size="mini" @click="OpenEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加" :visible.sync="showdialog">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="产品" prop="TradeProduct">
          <el-input v-model="dialogData.TradeProduct" :readonly="TradeProductReadonly" placeholder="请输入欧意产品ID" />
        </el-form-item>
        <el-form-item label="总张数" prop="TotalNum">
          <el-input v-model="dialogData.TotalNum" type="number" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.Memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdialog = false">
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
import { OKXGetConfigBase, OKXConfigBaseAdd, OKXConfigBaseDefault, OKXConfigBaseEdit } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'OKXBaseConfig',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      showdialog: false,
      dialogStatus: 'create',
      dialogData: {
        ID: 0,
        TradeProduct: '',
        TotalNum: 0,
        Memo: ''
      },
      rules: {
        TradeProduct: [{ required: true, message: '请输入欧意产品ID', trigger: 'blur' }]
      },
      TradeProductReadonly: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      OKXGetConfigBase().then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    OpenAdd() {
      this.showdialog = true
      this.dialogStatus = 'create'
      this.dialogData.ID = 0
      this.TradeProductReadonly = false
    },
    OpenEdit(row) {
      this.showdialog = true
      this.TradeProductReadonly = true
      this.dialogStatus = 'edit'
      this.dialogData.ID = row.ID
      this.dialogData.TradeProduct = row.TradeProduct
      this.dialogData.TotalNum = row.TotalNum
      this.dialogData.Memo = row.Memo
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          OKXConfigBaseAdd(this.dialogData).then(() => {
            this.getList()
            this.showdialog = false
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
          OKXConfigBaseEdit(this.dialogData).then(() => {
            this.getList()
            this.showdialog = false
            this.$notify({
              title: 'Success',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    setDefault(row) {
      OKXConfigBaseDefault(row).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    }
    //
  }
}
</script>
<style scoped>
</style>

