<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="postGameID.gameID" class="filter-item" filterable placeholder="请选择" @change="reloadCategory">
        <el-option
          v-for="item in Gamedata"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID"
        />
      </el-select>
      <el-select v-model="postCagetgoryID.categoryID" class="filter-item" filterable placeholder="请选择" @change="reloadMethd">
        <el-option
          v-for="item in Categorydata"
          :key="item.ID"
          :label="item.CategoryName"
          :value="item.ID"
        />
      </el-select>
      <br>
      <el-radio-group v-model="postmethodRate.methodID" @change="reloadRate">
        <el-radio v-for="item in MethodData" :key="item.ID" :label="item.ID">{{ item.MethodName }}</el-radio>
      </el-radio-group>
    </div>
    <el-button type="primary" @click="saveRate">保存</el-button>
    <el-table v-loading="listLoading" :data="RateData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="赔率" width="170px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.Rate" type="number" placeholder="请输入赔率" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="反水" width="180px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.FanShuiPercent" type="number" placeholder="请输入赔率">
            <template slot="append">%</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.Sort" type="number" placeholder="请输入赔率" />
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="saveRate">保存</el-button>
  </div>
</template>
<script>
import { GetGamesFromCache, GetGameCategory, GetMethod, GetRate, EditRate } from '@/api/game'
export default {
  name: 'GameGameRateList',
  data() {
    return {
      Gamedata: [],
      Categorydata: [],
      MethodData: [],
      RateData: [],
      postGameID: {
        gameID: 1
      },
      postCagetgoryID: {
        categoryID: 0
      },
      postmethodRate: {
        methodID: 0
      },
      listLoading: true
    }
  },
  created() {
    this.getGame()
    this.getCategory()
  },
  methods: {
    getGame() {
      GetGamesFromCache().then(response => {
        this.Gamedata = response.Data
      })
    },
    getCategory() {
      GetGameCategory(this.postGameID).then(response => {
        this.Categorydata = response.Data
        this.postCagetgoryID.categoryID = this.Categorydata[0].ID
        this.reloadMethd()
      })
    },
    getMethod() {
      GetMethod(this.postCagetgoryID).then(response => {
        this.MethodData = response.Data
        this.postmethodRate.methodID = this.MethodData[0].ID
        this.reloadRate()
      })
    },
    getRate() {
      this.listLoading = true
      GetRate(this.postmethodRate).then(response => {
        this.RateData = response.Data
        this.listLoading = false
      })
    },
    reloadCategory() {
      this.Categorydata = []
      this.getCategory()
    },
    reloadMethd() {
      this.MethodData = []
      this.getMethod()
    },
    reloadRate() {
      this.RateData = []
      this.getRate()
    },
    saveRate() {
      EditRate(this.RateData).then(() => {
        this.$notify({
          title: 'Success',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
