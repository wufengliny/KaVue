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
          <el-button v-if="checkbuttonPermission('EatShouQian')&&row.GiveMoney === 0" type="primary" size="mini" @click="openShou(row)">
            收钱
          </el-button>
          <el-button v-if="checkbuttonPermission('EatShouQian')&&ishowzhaoLing(row)" type="warning" size="mini" @click="ZhaoLingPost(row)">
            找零
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-alert :title="'金额总计:'+ summoney" type="success" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='create'" label="点餐者" prop="account">
          <el-select v-model="dialogData.account" class="filter-item" filterable placeholder="请选择">
            <el-option v-for="item in eatusers" :key="item.Account" :label="item.Account+'---'+item.Memo" :value="item.Account" />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="点餐者" prop="account">
          <el-input v-model="dialogData.account" disabled />
        </el-form-item>
        <el-form-item label="菜名" prop="foodName">
          <el-input v-model="dialogData.foodName" :autosize="{ minRows: 3, maxRows: 4}" type="textarea" placeholder="请输入菜名" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="dialogData.price" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():editorder()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="收钱" :visible.sync="dialogshou">
      <el-form ref="dataForm" :rules="rules" :model="dialogshouData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="点餐者" prop="eatAcount">
          <el-input v-model="dialogshouData.eatAcount" disabled />
        </el-form-item>
        <el-form-item label="收钱" prop="price">
          <el-input v-model="dialogshouData.receiveMoney" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogshou = false">
          取消
        </el-button>
        <el-button type="primary" @click="shouqianPost()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetOKXOrderMyOrder } from '@/api/okx'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'OKXOrderMyOrder',
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
        limit: 20,
        Statu: -1
      },
      dialogData: {
        account: '',
        foodName: '',
        price: 0
      },
      dialogStatus: '',
      rules: {
        foodName: [{ required: true, message: '请输入菜名', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '点餐'
      },
      eatusers: null,
      activitystatu: false,
      dialogshou: false,
      dialogshouData: {
        seriousNO: 0,
        eatAcount: '',
        receiveMoney: 0
      },
      jccurl: 'http://192.168.11.133:8012/jcc.png',
      jueweiurl: 'http://192.168.11.133:8012/juewei.png',
      wuguiurl: 'http://192.168.11.133:8012/wugu.png',
      yipinxiangurl: 'http://192.168.11.133:8012/yipinxiang.png',
      urls: [
        'http://192.168.11.133:8012/jcc.png',
        'http://192.168.11.133:8012/juewei.png',
        'http://192.168.11.133:8012/wugu.png',
        'http://192.168.11.133:8012/yipinxiang.png',
        'http://192.168.11.133:8012/sbz.png'
      ],
      summoney: 0,
      timer: ''
    }
  },
  created() {
    this.getList()
    this.timer = setInterval(this.getList, 60000)
  },
  destroyed() {
    clearInterval(this.timer)
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

