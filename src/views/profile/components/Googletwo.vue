<!-- 这个页面的逻辑：如果还没有生成谷歌验证码，则需要先配置谷歌验证码，然后保存。如果已配置谷歌验证码，则需要输入谷歌验证码才能查看和修改
如果忘记谷歌验证码，则联系管理员重置
-->
<template>
  <el-form>
    <el-form-item v-if="showGoogleInfo" label="名称">
      <el-input v-model.trim="pwds.gtitle" @change="nameChangemMakekey" />
    </el-form-item>
    <el-form-item v-if="showGoogleInfo" label="谷歌秘钥">
      <el-input v-model.trim="pwds.userKey_password" readonly="readonly" />
    </el-form-item>
    <el-form-item v-if="showGoogleInfo">
      <img :src="pwds.QrCodeGoogleAPIImg">
    </el-form-item>
    <el-form-item v-if="showGoogleInfo">
      <el-button type="primary" @click="makekey">重新生成</el-button>
    </el-form-item>
    <el-form-item v-if="isSet" label="谷歌验证码">
      <el-input v-model.trim="pwds.google_password" placeholder="请输入谷歌验证码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button v-if="!showGoogleInfo" type="success" @click="lookmygoogleKey">查看</el-button>
      <el-button v-if="showGoogleInfo" type="primary" @click="submit">保存</el-button>
    </el-form-item>
    <el-form-item v-show="false">
      <el-input v-model.trim="pwds.serverKey_password" type="password" />
    </el-form-item>
  </el-form>
</template>

<script>
import { MakeGoogleKey, LookMyGoogleKey, UpdateMyGoogleKey, CheckGoogleAuthSet } from '@/api/power'
export default {
  data() {
    return {
      pwds: {
        userKey_password: '',
        google_password: '',
        serverKey_password: '',
        gtitle: '',
        QrCodeOtpauth: '',
        QrCodeGoogleAPIImg: ''
      },
      showGoogleInfo: false,
      isSet: false, // 是否配置了谷歌验证码
      makeGooleData: {
        Title: '',
        ServerKey_password: ''
      }
    }
  },
  created() {
    CheckGoogleAuthSet().then(response => {
      if (!response.OtherData) {
        this.pwds.serverKey_password = response.Data.SecretKey
        this.pwds.userKey_password = response.Data.ManualEntryKey
        this.pwds.gtitle = response.Data.Title
        this.pwds.QrCodeOtpauth = response.Data.QrCodeOtpauth
        this.pwds.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
        this.showGoogleInfo = true
        this.isSet = false
      } else {
        this.showGoogleInfo = false
        this.isSet = true
      }
    })
  },
  methods: {
    submit() {
      UpdateMyGoogleKey(this.pwds).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.isSet = response.OtherData
      })
    },
    makekey() {
      this.makeGooleData.Title = ''
      this.makeGooleData.ServerKey_password = ''
      MakeGoogleKey(this.makeGooleData).then(response => {
        this.pwds.serverKey_password = response.Data.SecretKey
        this.pwds.userKey_password = response.Data.ManualEntryKey
        this.pwds.gtitle = response.Data.Title
        this.pwds.QrCodeOtpauth = response.Data.QrCodeOtpauth
        this.pwds.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
      })
    },
    nameChangemMakekey() {
      this.makeGooleData.Title = this.pwds.gtitle
      this.makeGooleData.ServerKey_password = this.pwds.serverKey_password
      MakeGoogleKey(this.makeGooleData).then(response => {
        this.pwds.serverKey_password = response.Data.SecretKey
        this.pwds.userKey_password = response.Data.ManualEntryKey
        this.pwds.gtitle = response.Data.Title
        this.pwds.QrCodeOtpauth = response.Data.QrCodeOtpauth
        this.pwds.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
      })
    },
    lookmygoogleKey() {
      LookMyGoogleKey(this.pwds).then(response => {
        this.showGoogleInfo = true
        this.pwds.serverKey_password = response.Data.SecretKey
        this.pwds.userKey_password = response.Data.ManualEntryKey
        this.pwds.gtitle = response.Data.Title
        this.pwds.QrCodeOtpauth = response.Data.QrCodeOtpauth
        this.pwds.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
        this.isSet = response.OtherData
      })
    }
  }
}
</script>
