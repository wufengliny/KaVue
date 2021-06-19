<template>
  <el-dialog title="编辑" :visible.sync="showeditdialog" :before-close="hidedialog" width="600px">
    <el-form ref="dialogForm" :model="subData" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
      <el-form-item label="查询账号" prop="SearchAccount">
        <el-input v-model="subData.SearchAccount" disabled />
      </el-form-item>
      <el-form-item label="姓名" prop="RealName">
        <el-input v-model="subData.RealName" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="QQ" prop="QQ">
        <el-input v-model="subData.QQ" placeholder="QQ" />
      </el-form-item>
      <el-form-item label="微信" prop="WeChat">
        <el-input v-model="subData.WeChat" placeholder="微信" />
      </el-form-item>
      <el-form-item label="邮箱" prop="Email">
        <el-input v-model="subData.Email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="subData.AdminMemo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hidedialog">
        取消
      </el-button>
      <el-button type="primary" @click="sub()">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { UsersEdit } from '@/api/user'
export default {
  props: {
    showeditdialog: {
      type: Boolean,
      default: false
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
      subData: {
        ID: 0,
        SearchAccount: '',
        RealName: '',
        QQ: '',
        WeChat: '',
        Email: '',
        AdminMemo: ''
      },
      isok: false
    }
  },
  watch: {
    editrow(val) {
      this.subData = val
    },
    showeditdialog(val) {
      if (val) {
        this.isok = false
      }
    }
  },
  methods: {
    sub() {
      UsersEdit(this.subData).then(() => {
        this.isok = true
        this.hidedialog()
        this.$notify({
          title: 'Success',
          message: '操作成功',
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
