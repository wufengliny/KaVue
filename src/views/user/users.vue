<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.SearchAccount" placeholder="查询账号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.UserGroupID" class="filter-item" filterable placeholder="请选择">
        <el-option
          v-for="item in userGroupsData"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID"
        />
      </el-select>
      <el-input v-model="listQuery.RegIP" placeholder="注册IP" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ParentSearchAccount" placeholder="上级代理查询账号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.RegBeginTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="filter-item" placeholder="开始时间" /> ~
      <el-date-picker v-model="listQuery.RegEndTime" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="datetime" class="filter-item" placeholder="结束时间" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('UsersAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="OpenAdd">
        添加
      </el-button>
      <el-button v-if="checkbuttonPermission('UserGroupSet')" :disabled="chkChecked.length === 0" class="filter-item" style="margin-left: 10px;" type="primary" @click="OpenUserGroupSet">
        设置会员组
      </el-button>
      <el-button v-if="checkbuttonPermission('UserAgentSet')" :disabled="chkChecked.length === 0" class="filter-item" style="margin-left: 10px;" type="primary" @click="OpenUserAgentSet">
        设置代理线
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="chkChange">
      <el-table-column type="selection" />
      <el-table-column align="center" label="查询账号">
        <template slot-scope="scope">
          <span>{{ scope.row.SearchAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员组名称">
        <template slot-scope="scope">
          <span>{{ scope.row.AdminGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理">
        <template slot-scope="{row}">
          <el-tag :type="row.IsAgent | userFilter">
            {{ userinfo[row.IsAgent] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录次数">
        <template slot-scope="scope">
          <span>{{ scope.row.LoginCount }}</span>
        </template>
      </el-table-column>
      <el-table-column key="Statu" align="center" label="总入款">
        <template slot-scope="scope">
          <span>{{ scope.row.InSumMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.Statu | statuFilter">
            {{ statuinfo[row.Statu] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="checkbuttonPermission('UsersEdit')" type="primary" size="mini" @click="OpenEdit(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('UsersState')" size="mini" type="danger" @click="OpenStatuDialog(row, $index)">
            状态
          </el-button>
          <el-button v-if="checkbuttonPermission('UserDetail')" size="mini" type="default" @click="openDetail(row)">
            详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <useradd
      :showadddialog.sync="addDialog.showdialog"
      @hideaddDialog="hideaddDialog"
    />
    <useredit
      :showeditdialog.sync="editDialog.showdialog"
      :editrow="editDialog.editRow"
      @hideeditDialog="hideeditDialog"
    />
    <el-dialog title="状态编辑" :visible.sync="dialogStateVisible">
      <el-form ref="dataForm" :model="userStatuData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="查询账号">
          <el-input v-model="userStatuData.SearchAccount" disabled />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userStatuData.RealName" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userStatuData.Statu"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="userStatuData.AdminMemo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="UserStatePost">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="详细">
      <el-table :data="detailData" border fit highlight-current-row style="width: 100%">
        <el-table-column width="100px" prop="key" label="名称" />
        <el-table-column prop="con" label="内容" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置会员组" :visible.sync="dialogGroupVisible">
      <el-form ref="dataForm" :model="UserGroupSetPostData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="查询账号">
          <el-input v-model="UserGroupSetPostData.SearchAccounts" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" disabled />
        </el-form-item>
        <el-form-item label="会员组" prop="NewGroupID">
          <el-select v-model="UserGroupSetPostData.NewGroupID" class="filter-item" filterable placeholder="请选择">
            <el-option
              v-for="item in userGroupsData"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="UserGroupSetPOst">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置代理线" :visible.sync="dialogAgentVisible">
      <el-form ref="dataForm" :model="UserAgentSetPostData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="查询账号">
          <el-input v-model="UserAgentSetPostData.SearchAccounts" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" disabled />
        </el-form-item>
        <el-form-item label="上级代理">
          <el-input v-show="false" v-model="UserAgentSetPostData.NewAgentID" />
          <el-input v-model="UserAgentSetPostData.NewAgentAcount" placeholder="上级代理查询账号，为空则无上级代理" @change="searchParent()" />
          <el-input v-model="UserAgentSetPostData.tempChk" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAgentVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="UserAgentSetPOst">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Users, UsersState, UserDetail, usergroups, UserGroupSet, getuserParentInfo, UserAgentSet } from '@/api/user'
import { checkbuttonPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import useradd from './components/useradd'
import useredit from './components/useredit'
export default {
  name: 'Users',
  components: { Pagination, useradd, useredit },
  filters: {
    userFilter(status) {
      const statusMap = {
        true: 'success',
        false: ''
      }
      return statusMap[status]
    },
    statuFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        SearchAccount: '',
        UserGroupID: 0,
        RegIP: '',
        ParentSearchAccount: '',
        RegBeginTime: '',
        RegEndTime: ''
      },
      addDialog: {
        showdialog: false
      },
      editDialog: {
        showdialog: false,
        editRow: null
      },
      userinfo: {
        true: '代理',
        false: '会员'
      },
      statuinfo: {
        1: '正常',
        2: '禁用'
      },
      chkChecked: [],
      dialogStateVisible: false,
      userStatuData: {
        ID: 0,
        SearchAccount: '',
        RealName: '',
        Statu: 0,
        AdminMemo: ''
      },
      editRow: null,
      dialogDetailVisible: false,
      detailData: [],
      dialogGroupVisible: false,
      userGroupsData: null,
      UserGroupSetPostData: {
        IDs: '',
        NewGroupID: 0,
        SearchAccounts: ''
      },
      dialogAgentVisible: false,
      UserAgentSetPostData: {
        IDs: '',
        SearchAccounts: '',
        NewAgentID: 0,
        NewAgentAcount: '',
        tempChk: ''
      }
    }
  },
  created() {
    this.getList()
    if (this.userGroupsData === null) {
      usergroups({ name: '' }).then(response => {
        // this.userGroupsData = response.Data
        const tempc = [{ ID: 0, Name: '请选择' }]
        this.userGroupsData = tempc.concat(response.Data)
      })
    }
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      Users(this.listQuery).then(response => {
        this.list = response.Data
        this.listLoading = false
        this.total = response.Pageinfo.TotalCount
      })
    },
    chkChange(val) {
      this.chkChecked = val
    },
    handleFilter() {
      this.getList()
    },
    OpenAdd() {
      this.addDialog.showdialog = true
    },
    hideaddDialog(isok) {
      this.addDialog.showdialog = false
      if (isok) {
        this.getList()
      }
    },
    hideeditDialog(isok) {
      this.editDialog.showdialog = false
      if (isok) {
        this.getList()
      }
    },
    OpenEdit(row) {
      this.editDialog.showdialog = true
      this.editDialog.editRow = row
    },
    OpenStatuDialog(row, index) {
      this.dialogStateVisible = true
      this.userStatuData.ID = row.ID
      this.userStatuData.SearchAccount = row.SearchAccount
      this.userStatuData.RealName = row.RealName
      this.userStatuData.Statu = row.Statu
      this.userStatuData.AdminMemo = row.AdminMemo
    },
    UserStatePost() {
      UsersState(this.userStatuData).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        // this.list.map(item => {
        //   if (item.ID === this.userStatuData.ID) {
        //     item.Statu = this.userStatuData.Statu
        //     item.AdminMemo = this.userStatuData.AdminMemo
        //     return this.list
        //   }
        // })
        this.list.forEach(element => {
          const position = this.list.indexOf(element)
          if (element.ID === this.userStatuData.ID) {
            element.Statu = this.userStatuData.Statu
            element.AdminMemo = this.userStatuData.AdminMemo
            this.$set(this.list, position, element)
          }
        })
        this.dialogStateVisible = false
      })
    },
    openDetail(row) {
      UserDetail({ ID: row.ID }).then(response => {
        this.detailData = [
          { key: '账号', con: response.Data.Account },
          { key: '查询账号', con: response.Data.SearchAccount },
          { key: '创建时间', con: response.Data.AddTime },
          { key: '会员组', con: response.Data.AdminGroupName },
          { key: '备注', con: response.Data.AdminMemo },
          { key: '系统备注', con: response.Data.SysMemo },
          { key: '余额', con: response.Data.Balance },
          { key: '邮箱', con: response.Data.Email },
          { key: '总入款', con: response.Data.InSumMoney },
          { key: '总出款', con: response.Data.OutSumMoney },
          { key: '上级', con: response.Data.ParentSearchAccount },
          { key: '姓名', con: response.Data.RealName },
          { key: '注册IP', con: response.Data.RegIP }
        ]
        this.dialogDetailVisible = true
      })
    },
    OpenUserGroupSet() {
      this.dialogGroupVisible = true
      if (this.chkChecked.length === 1) {
        this.UserGroupSetPostData.NewGroupID = this.chkChecked[0].UserGroupID
      } else {
        this.UserGroupSetPostData.NewGroupID = this.userGroupsData[0].ID
      }
      let idsStr = ''
      let accounts = ''
      this.chkChecked.forEach(function(e) {
        idsStr += e.ID + ','
        accounts += e.SearchAccount + ','
      })
      idsStr = idsStr.substring(0, idsStr.length - 1)
      accounts = accounts.substring(0, accounts.length - 1)
      this.UserGroupSetPostData.IDs = idsStr
      this.UserGroupSetPostData.SearchAccounts = accounts
    },
    OpenUserAgentSet() {
      this.dialogAgentVisible = true
      if (this.chkChecked.length === 1) {
        this.UserAgentSetPostData.NewAgentAcount = this.chkChecked[0].ParentSearchAccount
        this.UserAgentSetPostData.NewAgentID = this.chkChecked[0].ParentID
        this.UserAgentSetPostData.tempChk = '查询账号:' + this.chkChecked[0].ParentSearchAccount + ',姓名:' + this.chkChecked[0].RealName
      }
      let idsStr = ''
      let accounts = ''
      this.chkChecked.forEach(function(e) {
        idsStr += e.ID + ','
        accounts += e.SearchAccount + ','
      })
      idsStr = idsStr.substring(0, idsStr.length - 1)
      accounts = accounts.substring(0, accounts.length - 1)
      this.UserAgentSetPostData.IDs = idsStr
      this.UserAgentSetPostData.SearchAccounts = accounts
    },
    UserGroupSetPOst() {
      const userGroupName = this.userGroupsData.filter(x => { return x.ID === this.UserGroupSetPostData.NewGroupID })[0].Name
      UserGroupSet(this.UserGroupSetPostData).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        const temp = this.UserGroupSetPostData
        this.list.forEach(item => {
          const position = this.list.indexOf(item)
          const accounts = temp.SearchAccounts.split(',')
          accounts.forEach(element => {
            if (item.SearchAccount === element) {
              item.UserGroupID = temp.NewGroupID
              item.AdminGroupName = userGroupName
              this.$set(this.list, position, item)
            }
          })
        })
        this.dialogGroupVisible = false
      })
    },
    UserAgentSetPOst() {
      UserAgentSet(this.UserAgentSetPostData).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        const temp = this.UserAgentSetPostData
        this.list.forEach(item => {
          const position = this.list.indexOf(item)
          const accounts = temp.SearchAccounts.split(',')
          accounts.forEach(element => {
            if (item.SearchAccount === element) {
              item.ParentID = temp.NewAgentID
              item.ParentSearchAccount = temp.NewAgentAcount
              this.$set(this.list, position, item)
            }
          })
        })
        this.dialogAgentVisible = false
      })
    },
    searchParent() {
      if (this.UserAgentSetPostData.NewAgentAcount !== '') {
        this.UserAgentSetPostData.NewAgentID = -1
        getuserParentInfo({ searchAccount: this.UserAgentSetPostData.NewAgentAcount }).then(response => {
          this.UserAgentSetPostData.tempChk = '查询账号:' + response.Data.SearchAccount + ',姓名:' + response.Data.RealName
          this.UserAgentSetPostData.NewAgentID = response.Data.ID
        })
      } else {
        this.UserAgentSetPostData.NewAgentID = 0
      }
    }
  }
}
</script>
<style scoped>
</style>

