<template>
  <el-dialog title="谷歌验证码秘钥配置" :visible.sync="showgoogledialog" :before-close="hidedialog">
    <el-form ref="dialogForm" :model="googledata" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
      <el-form-item label="标题" prop="title">
        <el-input v-model="googledata.title" @change="nameChangemMakekey" />
      </el-form-item>
      <el-form-item label="秘钥" prop="userKey_password">
        <el-input v-model="googledata.userKey_password" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" readonly="readonly" />
      </el-form-item>
      <el-form-item label="二维码" prop="title">
        <img :src="googledata.QrCodeGoogleAPIImg">
      </el-form-item>
      <el-form-item label="" prop="title">
        <el-button type="success" @click="makekey()">
          重新生成
        </el-button>
      </el-form-item>
      <el-input v-model="googledata.id" type="hidden" />
      <el-input v-model="googledata.serverKey_password" type="hidden" />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hidedialog()">
        取消
      </el-button>
      <el-button type="primary" @click="updategoogle()">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { MakeGoogleKey, UpdateGoogleKey, GetAdminGoogleTwo } from '@/api/power'
export default {
  props: {
    showgoogledialog: {
      type: Boolean,
      default: false
    },
    adminid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      googledata: {
        serverKey_password: '',
        userKey_password: '',
        id: 0, // 管理员ID
        title: '',
        QrCodeGoogleAPIImg: '',
        isSet: false
      }
    }
  },
  watch: {
    adminid(val) {
      this.googledata.id = val
    },
    showgoogledialog(val) {
      if (val) {
        GetAdminGoogleTwo({ ID: this.adminid }).then(response => {
          if (response.OtherData) {
            this.googledata.title = response.Data.Title
            this.googledata.userKey_password = response.Data.ManualEntryKey
            this.googledata.serverKey_password = response.Data.SecretKey
            this.googledata.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
            this.googledata.showGoogleInfo = true
            this.googledata.isSet = response.OtherData
            this.googledata.id = this.adminid
          } else {
            this.googledata.title = response.Data.Title
          }
        })
      } else {
        this.googledata.title = ''
        this.googledata.userKey_password = ''
        this.googledata.serverKey_password = ''
        this.googledata.QrCodeGoogleAPIImg = ''
      }
    }
  },
  created() {
  },
  methods: {
    makekey() {
      var postData = { ID: this.adminid, Title: this.googledata.title }
      MakeGoogleKey(postData).then(response => {
        this.googledata.title = response.Data.Title
        this.googledata.userKey_password = response.Data.ManualEntryKey
        this.googledata.serverKey_password = response.Data.SecretKey
        this.googledata.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
      })
    },
    updategoogle() {
      UpdateGoogleKey(this.googledata).then(() => {
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
      this.$emit('hidedialoggoogle')
    },
    nameChangemMakekey() {
      var postData = { ID: this.adminid, Title: this.googledata.title, ServerKey_password: this.googledata.serverKey_password }
      MakeGoogleKey(postData).then(response => {
        this.googledata.title = response.Data.Title
        this.googledata.userKey_password = response.Data.ManualEntryKey
        this.googledata.serverKey_password = response.Data.SecretKey
        this.googledata.QrCodeGoogleAPIImg = response.Data.QrCodeGoogleAPIImg
      })
    }
  }
}
</script>
