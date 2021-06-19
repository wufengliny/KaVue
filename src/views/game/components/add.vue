<template>
  <el-dialog title="添加" :visible.sync="showadddialog" :before-close="hidedialog" width="600px">
    <el-form ref="dialogForm" :model="adddata" :rules="rules" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
      <el-form-item label="彩票类型" prop="adminGroupID">
        <el-select v-model="adddata.gameID" class="filter-item" filterable placeholder="请选择">
          <el-option
            v-for="item in gamedatas"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="期号" prop="caseNumber">
        <el-input v-model="adddata.caseNumber" placeholder="请输入期号" />
      </el-form-item>
      <el-form-item label="开奖号码" prop="openNumber">
        <el-input v-model="adddata.openNumber" placeholder="请输入开奖号码，号码之间用英文逗号隔开" />
      </el-form-item>
      <el-form-item label="开奖时间" prop="openTime">
        <el-date-picker v-model="adddata.openTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开奖时间" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="adddata.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hidedialog">
        取消
      </el-button>
      <el-button type="primary" @click="add()">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { CPOpenResultAdd } from '@/api/game'
export default {
  props: {
    showadddialog: {
      type: Boolean,
      default: false
    },
    gamedatas: {
      type: Array,
      default: function() {
        return []
      }
    },
    gameid: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      adddata: {
        gameID: 1,
        caseNumber: '',
        openNumber: '',
        openTime: '',
        memo: ''
      },
      isok: false,
      rules: {
        caseNumber: [{ required: true, message: '期号不能为空', trigger: 'blur' }],
        openNumber: [{ required: true, message: '开奖号码不能为空', trigger: 'blur' }],
        openTime: [{ required: true, message: '开奖时间不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    gameid(val) {
      this.adddata.gameID = val
    },
    showadddialog(val) {
      if (val) {
        this.isok = false
      }
    }
  },
  methods: {
    add() {
      CPOpenResultAdd(this.adddata).then(() => {
        this.isok = true
        this.hidedialog()
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    hidedialog() {
      this.$emit('hideaddDialog', this.isok)
    }
  }
}
</script>
