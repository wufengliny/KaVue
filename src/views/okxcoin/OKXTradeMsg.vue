<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.Category" class="filter-item" placeholder="">
        <el-option
          v-for="item in CategoryList"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
      <el-select v-model="listQuery.TradeProduct" class="filter-item" placeholder="">
        <el-option key="" label="全部产品" value="" />
        <el-option
          v-for="item in InstIds"
          :key="item.TradeProduct"
          :label="item.TradeProduct"
          :value="item.TradeProduct"
        />
      </el-select>
      <el-input v-model="listQuery.ConfigID" placeholder="模式ID" style="width: 160px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="reflashdata">
        刷新
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="150" label="类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Category|CategoryTag">
            {{ scope.row.Category |filCategory }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="信息">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Category|CategoryTag">
            {{ scope.row.Message }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { GetOKXTradeMsg, OKXGetConfigBase } from '@/api/okx'
import Pagination from '@/components/Pagination'
export default {
  name: 'OKXTradeMsg',
  filters: {
    filCategory(Category) {
      if (Category === 'guabuy') {
        return '挂单买入'
      } else if (Category === 'guasell') {
        return '挂单卖出'
      } else if (Category === 'sell') {
        return '卖出成交'
      } else if (Category === 'buy') {
        return '买入成交'
      }
    },
    CategoryTag(Category) {
      if (Category === 'guabuy') {
        return 'info'
      } else if (Category === 'guasell') {
        return 'warning'
      } else if (Category === 'sell') {
        return 'success'
      } else if (Category === 'buy') {
        return 'danger'
      }
    }
  },

  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Category: '',
        ConfigID: '',
        TradeProduct: ''
      },
      summoney: 0,
      CategoryList: [
        { 'key': '', 'name': '全部' },
        { 'key': 'sell', 'name': '卖出成交' },
        { 'key': 'buy', 'name': '买入成交' },
        { 'key': 'guabuy', 'name': '挂单买入' },
        { 'key': 'guasell', 'name': '挂单卖出' }
      ],
      InstIds: null
    }
  },
  created() {
    this.getList()
    this.getProducts()
  },
  methods: {
    getList() {
      this.listLoading = true
      GetOKXTradeMsg(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    getProducts() {
      OKXGetConfigBase().then(response => {
        this.InstIds = response.Data
      })
    },
    reflashdata() {
      this.getList()
    }
    //
  }
}
</script>

