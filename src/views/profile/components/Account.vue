<template>
  <el-form>
    <el-form-item label="原密码">
      <el-input v-model.trim="pwds.old_password" type="password" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="pwds.new_password" type="password" />
    </el-form-item>
    <el-form-item label="确认信密码">
      <el-input v-model.trim="pwds.confirm_password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ModPwd } from '@/api/other'
export default {
  data() {
    return {
      pwds: {
        old_password: '',
        new_password: '',
        confirm_password: ''
      }
    }
  },
  methods: {
    submit() {
      ModPwd(this.pwds).then(response => {
        this.pwds = {}
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
