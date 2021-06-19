<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('EatCreateSerious')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAdd">
        点餐
      </el-button>
      <el-button v-show="false" class="filter-item" style="margin-left: 10px;" type="primary" @click="getList">
        刷新
      </el-button>
      <div>
        <el-image style="width: 100px; height: 100px" :src="urls[0]" :preview-src-list="urls" />
        <el-image style="width: 100px; height: 100px" :src="urls[1]" :preview-src-list="urls" />
        <el-image style="width: 100px; height: 100px" :src="urls[2]" :preview-src-list="urls" />
        <el-image style="width: 100px; height: 100px" :src="urls[3]" :preview-src-list="urls" />
        <el-image style="width: 100px; height: 100px" :src="urls[4]" :preview-src-list="urls" />
      </div>
      <el-alert v-if="activitystatu" title="点餐活动已结束" type="error" />
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="点餐者">
        <template slot-scope="scope">
          <span>{{ scope.row.EatAcount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜名">
        <template slot-scope="scope">
          <span>{{ scope.row.FoodName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{ scope.row.Price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160px" label="点餐时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="随机数">
        <template slot-scope="scope">
          <span>{{ scope.row.RandomNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收钱">
        <template slot-scope="scope">
          <span>{{ scope.row.GiveMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="找零">
        <template slot-scope="scope">
          <el-tag :type="zhaolingTag(scope.row)">
            {{ zhaoLinginfo(scope.row) }}
          </el-tag>
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
import { Current, AddOrder, EditOrder, eatuser, ShouQian, ZhaoLing } from '@/api/eat'
import { checkbuttonPermission } from '@/utils/permission'
import { MessageBox } from 'element-ui'
export default {
  name: 'EatCurrent',
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
    this.timer = setInterval(this.getList, 2000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      Current({ str: '' }).then(response => {
        this.list = response.Data
        this.summoney = 0
        this.list.forEach(element => {
          this.summoney += element.Price
        })
        this.listLoading = false
        if (response.Message === 'no') {
          this.activitystatu = false
        }
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
          AddOrder(this.dialogData).then(() => {
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
    editorder() {
      EditOrder(this.dialogData).then(() => {
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
      this.dialogStatus = 'create'
      this.dialogData.account = ''
      this.dialogData.foodName = ''
      this.dialogData.price = 0
      if (this.eatusers === null) {
        eatuser().then(response => {
          this.eatusers = response.Data
        })
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    openEdit(row) {
      this.dialogStatus = 'update'
      this.dialogData.account = row.EatAcount
      this.dialogData.foodName = row.FoodName
      this.dialogData.price = row.Price
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    openShou(row) {
      this.dialogshouData.seriousNO = row.SeriousNO
      this.dialogshouData.eatAcount = row.EatAcount
      this.dialogshouData.receiveMoney = row.ReceiveMoney
      this.dialogshou = true
    },
    shouqianPost() {
      ShouQian(this.dialogshouData).then(() => {
        this.getList()
        this.dialogshou = false
        this.$notify({
          title: 'Success',
          message: '收钱成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    ishowzhaoLing(row) {
      if (row.Price === row.GiveMoney) {
        return false
      }
      if (row.GiveMoney > row.Price && !row.IsReturn) {
        return true
      }
      if (row.GiveMoney > row.Price && row.IsReturn) {
        return false
      }
    },
    zhaolingTag(row) {
      if (row.Price === row.GiveMoney) {
        return 'success'
      }
      if (row.GiveMoney > row.Price && !row.IsReturn) {
        return 'warning'
      }
      if (row.GiveMoney > row.Price && row.IsReturn) {
        return 'success'
      }
      if (row.GiveMoney === 0) {
        return 'danger'
      }
    },
    zhaoLinginfo(row) {
      if (row.Price === row.GiveMoney) {
        return '无需找零'
      }
      if (row.GiveMoney > row.Price && !row.IsReturn) {
        return '需要找零：' + row.ReturnMoney
      }
      if (row.GiveMoney > row.Price && row.IsReturn) {
        return '已找零'
      }
      if (row.GiveMoney === 0) {
        return '未给钱'
      }
    },
    ZhaoLingPost(row) {
      MessageBox.confirm('确定已找零了嘛？', '提醒', {
        type: 'warning'
      }).then(() => {
        ZhaoLing({ seriousNO: row.SeriousNO, eatAcount: row.EatAcount }).then(() => {
          this.getList()
          this.$notify({
            title: 'Success',
            message: '找零成功',
            type: 'success',
            duration: 2000
          })
        })
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

