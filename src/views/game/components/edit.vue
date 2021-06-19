<template>
  <el-dialog title="添加" :visible.sync="showeditdialog" :before-close="hidedialog" width="600px">
    <el-form ref="dialogForm" :model="editdata" :rules="rules" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
      <el-form-item label="彩票类型" prop="adminGroupID">
        <el-select v-model="editdata.GameID" disabled class="filter-item" filterable placeholder="请选择">
          <el-option
            v-for="item in gamedatas"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="期号" prop="CaseNumber">
        <el-input v-model="editdata.CaseNumber" disabled placeholder="请输入期号" />
      </el-form-item>
      <el-form-item label="开奖号码" prop="OpenNumber">
        <el-input v-model="editdata.OpenNumber" placeholder="请输入开奖号码，号码之间用英文逗号隔开" />
      </el-form-item>
      <el-form-item label="开奖时间" prop="OpenTime">
        <el-date-picker v-model="editdata.OpenTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开奖时间" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="editdata.Memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hidedialog">
        取消
      </el-button>
      <el-button type="primary" @click="edit()">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { CPOpenResultEdit } from '@/api/game'
export default {
  props: {
    showeditdialog: {
      type: Boolean,
      default: false
    },
    gamedatas: {
      type: Array,
      default: function() {
        return []
      }
    },
    editrow: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      editdata: {},
      isok: false,
      rules: {
        CaseNumber: [{ required: true, message: '期号不能为空', trigger: 'blur' }],
        OpenNumber: [{ required: true, message: '开奖号码不能为空', trigger: 'blur' }],
        OpenTime: [{ required: true, message: '开奖时间不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    editrow(val) {
      this.editdata = val
    },
    showeditdialog(val) {
      if (val) {
        this.isok = false
      }
    }
  },
  methods: {
    edit() {
      CPOpenResultEdit(this.editdata).then(() => {
        this.isok = true
        this.hidedialog()
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    hidedialog() {
      this.$emit('hideeditDialog', this.isok)
    }
  }
}
</script>
