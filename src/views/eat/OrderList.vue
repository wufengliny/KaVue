<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" placeholder="点餐者" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.addTime_begin" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
      <el-date-picker v-model="listQuery.addTime_end" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <quick-time @queryByButtonTime="queryByButtonTime" />
    </div>
    <el-table ref="katable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.EatAcount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜名">
        <template slot-scope="scope">
          <span>{{ scope.row.FoodName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="点餐时间">
        <template slot-scope="scope">
          <span :title="scope.row.Memo">{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="随机数">
        <template slot-scope="scope">
          <span>{{ scope.row.RandomNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动号">
        <template slot-scope="scope">
          <span>{{ scope.row.SeriousNO }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{ scope.row.Price }}</span>
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
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkbuttonPermission('EatShouQian')&&row.GiveMoney === 0" type="primary" size="mini" @click="openShou(row)">
            收钱
          </el-button>
          <el-button v-if="checkbuttonPermission('EatShouQian')&&ishowzhaoLing(row)" type="warning" size="mini" @click="ZhaoLingPost(row)">
            找零
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="收钱" :visible.sync="dialogshou">
      <el-form ref="dataForm" :model="dialogshouData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
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
import { OrderList, ShouQian, ZhaoLing } from '@/api/eat'
import { dateVal } from '@/utils/index'
import QuickTime from '@/components/QuickTime'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkbuttonPermission } from '@/utils/permission'
import { MessageBox } from 'element-ui'
export default {
  name: 'EatOrderList',
  components: { Pagination, QuickTime },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
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
        addTime_begin: '',
        addTime_end: '',
        seriousNO: 0,
        account: ''
      },
      detailQuery: {
        ID: 0
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false,
      statuinfo: {
        true: '成功',
        false: '失败'
      },
      dialogshou: false,
      dialogshouData: {
        seriousNO: 0,
        eatAcount: '',
        receiveMoney: 0
      }
    }
  },
  // watch: {
  //   data() {
  //     // this.$nextTick(() => {
  //     //   this.$refs.katable.doLayout()
  //     // })
  //     this.$refs.katable.doLayout()
  //   }
  // },
  created() {
    this.getList()
    this.initTime()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      OrderList(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    queryByButtonTime(data) {
      this.listQuery.addTime_begin = data.begin
      this.listQuery.addTime_end = data.end
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    initTime() {
      if (this.listQuery.addTime_begin === '') {
        this.listQuery.addTime_begin = dateVal().day_start
        this.listQuery.addTime_end = dateVal().day_end
      }
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
    }
  }
}
</script>
<style scoped>
</style>

