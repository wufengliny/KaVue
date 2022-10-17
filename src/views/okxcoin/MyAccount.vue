<template>
  <div class="app-container">
    <div class="components-container board">
      <Kanban :money="moneyData.totalBal" group="'mission" class="kanban todo" header-text="总资产" />
      <Kanban :money="moneyData.funding" group="'mission" class="kanban working" header-text="资金账户" />
      <Kanban :money="moneyData.trading" group="'mission" class="kanban done" header-text="交易账户" />
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.instId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开仓均价">
        <template slot-scope="scope">
          <span>{{ scope.row.avgPx }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="初始化保证金">
        <template slot-scope="scope">
          <span>{{ scope.row.imr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预估强平价">
        <template slot-scope="scope">
          <span>{{ scope.row.liqPx }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="杠杆倍数">
        <template slot-scope="scope">
          <span>{{ scope.row.lever }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标记价格">
        <template slot-scope="scope">
          <span>{{ scope.row.markPx }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="保证金率">
        <template slot-scope="scope">
          <span>{{ scope.row.mgnRatio| numpad }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="盈亏">
        <template slot-scope="scope">
          <span>{{ scope.row.upl| numpad }} ({{ scope.row.uplRatio| numRate }}%)</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Kanban from './components/zichan'
import { GetValuation, GetPositions } from '@/api/okx'
export default {
  name: 'OkxcoinMyAccount',
  components: {
    Kanban
  },
  filters: {
    numpad(numdata) {
      if (numdata) {
        return Number(numdata).toFixed(2)
      } else {
        return 0
      }
    },
    numRate(numdata) {
      if (numdata) {
        var num = numdata * 100
        return num.toFixed(2)
      } else {
        return 0
      }
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      moneyData: {
        funding: 0,
        trading: 0,
        totalBal: 0
      },
      listQuery: {
        instType: ''
      }
    }
  },
  created() {
    this.getValuation()
    this.getList()
  },
  methods: {
    getValuation() {
      GetValuation({ Txt: 'USDT' }).then(response => {
        this.moneyData.funding = response.Data.data[0].details.funding
        this.moneyData.trading = response.Data.data[0].details.trading
        this.moneyData.totalBal = response.Data.data[0].totalBal
      })
    },
    getList() {
      this.listLoading = true
      GetPositions(this.listQuery).then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>
