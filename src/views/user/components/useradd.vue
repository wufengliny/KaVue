<template>
  <el-dialog title="添加" :visible.sync="showadddialog" :before-close="hidedialog" width="600px">
    <el-form ref="dialogForm" :model="adddata" :rules="rules" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
      <el-form-item label="手机号" prop="Account">
        <el-input style="width:0;height:0" />
        <el-input show-password style="width:0;height:0" />
        <el-input v-model="adddata.Account" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="登录密码" prop="login_password">
        <el-input v-model="adddata.login_password" show-password placeholder="请输入登录密码" />
      </el-form-item>
      <el-form-item label="会员组" prop="userGroupID">
        <el-select v-model="adddata.userGroupID" class="filter-item" filterable placeholder="请选择">
          <el-option
            v-for="item in userGroups"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上级代理" prop="parentID">
        <el-input v-show="false" v-model="adddata.parentID" placeholder="为空则无上级代理" />
        <el-input v-model="parentSearchVal" placeholder="上级代理查询账号，为空则无上级代理" @change="searchParent()" />
        <el-input v-model="parentInfo" :disabled="true" />
      </el-form-item>
      <el-form-item label="代理" prop="parentID">
        <el-checkbox v-model="adddata.isAgent" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="adddata.adminMemo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
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
import { usergroups, getuserParentInfo, UsersAdd } from '@/api/user'
export default {
  props: {
    showadddialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      adddata: {
        Account: '',
        login_password: '',
        parentID: 0,
        userGroupID: 0,
        isAgent: false,
        adminMemo: ''
      },
      userGroups: null,
      isok: false,
      parentSearchVal: '',
      parentInfo: '无',
      rules: {
        Account: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        login_password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
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
        if (this.userGroups === null) {
          usergroups({ name: '' }).then(response => {
            this.userGroups = response.Data
            this.adddata.userGroupID = this.userGroups[0].ID
          })
        }
      }
    }
  },
  methods: {
    add() {
      UsersAdd(this.adddata).then(() => {
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
    searchParent() {
      if (this.parentSearchVal !== '') {
        getuserParentInfo({ searchAccount: this.parentSearchVal }).then(response => {
          this.parentInfo = '查询账号:' + response.Data.SearchAccount + ',姓名:' + response.Data.RealName
        })
      }
    },
    hidedialog() {
      this.$emit('hideaddDialog', this.isok)
    }
  }
}
</script>
