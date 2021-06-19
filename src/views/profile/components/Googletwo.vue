<template>
  <el-form>
    <el-form-item label="谷歌秘钥">
      <el-input v-model.trim="pwds.userKey_password" readonly="readonly" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="makekey">生成一个新秘钥</el-button>
    </el-form-item>
    <el-form-item label="登陆密码">
      <el-input v-model.trim="pwds.login_password" placeholder="请输入登录密码查看或者修改秘钥" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="lookmygoogleKey">查看</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
    <el-form-item v-show="false">
      <el-input v-model.trim="pwds.serverKey_password" type="password" />
    </el-form-item>
  </el-form>
</template>

<script>
import { MakeGoogleKey, LookMyGoogleKey, UpdateMyGoogleKey } from '@/api/power'
export default {
  data() {
    return {
      pwds: {
        userKey_password: '',
        login_password: '',
        serverKey_password: ''
      }
    }
  },
  methods: {
    submit() {
      UpdateMyGoogleKey(this.pwds).then(response => {
        this.pwds.userKey_password = ''
        this.pwds.serverKey_password = ''
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    makekey() {
      MakeGoogleKey().then(response => {
        this.pwds.serverKey_password = response.Data.ServerKey
        this.pwds.userKey_password = response.Data.UserKey
      })
    },
    lookmygoogleKey() {
      LookMyGoogleKey(this.pwds).then(response => {
        this.pwds.serverKey_password = response.Data.ServerKey
        this.pwds.userKey_password = response.Data.UserKey
      })
    }
  }
}
</script>
