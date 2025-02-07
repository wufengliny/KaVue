<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">管理员登陆</h3>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          placeholder="账号"
          name="userName"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="login_password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="login_password"
            v-model="loginForm.login_password"
            :type="passwordType"
            placeholder="密码"
            name="login_password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item v-if="isGoogleCode" prop="googleAuthCode">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="googleAuthCode"
          v-model="loginForm.googleAuthCode"
          placeholder="授权码"
          name="googleAuthCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item v-if="isImgCode" prop="imgAuthCode" class="aab">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="imgAuthCode"
          v-model="loginForm.imgAuthCode"
          placeholder="图片验证码"
          name="imgAuthCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
        <img :src="codeImg" @click="getImgCode">
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { LoginConfig, GetCodeImg } from '@/api/login'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少六个字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        login_password: '',
        googleAuthCode: '',
        imgAuthCode: '',
        uuid: ''
      },
      loginRules: {
        userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        login_password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        googleAuthCode: [{ required: true, message: '请输入授权码', trigger: 'blur' }],
        imgAuthCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      loginConfigData: {},
      isGoogleCode: false,
      isImgCode: false,
      codeImg: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getLoginConfig()
    this.getImgCode()
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.userName.focus()
    } else if (this.loginForm.login_password === '') {
      this.$refs.login_password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.login_password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: '/' || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    getLoginConfig() {
      LoginConfig().then(response => {
        response.Data.forEach(element => {
          if (element.Key === 'AdminLoginIsOpenGoogleCodeVerify') {
            if (element.Value === '1') {
              this.isGoogleCode = true
            } else {
              this.isGoogleCode = false
            }
          }
          if (element.Key === 'AdminLoginIsOpenImageCodeVerify') {
            if (element.Value === '1') {
              this.isImgCode = true
            } else {
              this.isImgCode = false
            }
          }
        })
      })
    },
    getImgCode() {
      var data = { txt: this.loginForm.uuid }
      GetCodeImg(data).then(response => {
        this.codeImg = 'data:image/png;base64,' + response.Data.img
        this.loginForm.uuid = response.Data.uuid
      })
    }
  }
}
</script>

<style lang="scss">
.aab  .el-form-item__content {
  display: flex;
}

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
