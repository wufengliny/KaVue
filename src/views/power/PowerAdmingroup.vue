<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.Name" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="checkbuttonPermission('PowerAdmingroupAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime | formatTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template v-if="row.ID!=1" slot-scope="{row,$index}">
          <el-button v-if="checkbuttonPermission('PowerAdmingroupPower')" type="success" size="mini" @click="handlepower(row)">
            权限
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdmingroupEdit')" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('PowerAdmingroupDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialogData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogpowerVisible" :title="dialogPowerdata.name">
      <el-form :model="dialogPowerdata" label-width="80px" label-position="left">
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :check-strictly="dialogPowerdata.checkStrictly"
            :data="dialogPowerdata.powers"
            :props="dialogPowerdata.defaultProps"
            :default-checked-keys="dialogPowerdata.chkeddata"
            :default-expanded-keys="dialogPowerdata.expandedID"
            show-checkbox
            node-key="ID"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogpowerVisible=false">取消</el-button>
        <el-button type="primary" @click="createpowers">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchadminGroupList, addAdminGroup, updateAdminGroup, deleteAdminGroup, menusAll, menuspowerupdate } from '@/api/power'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { MessageBox } from 'element-ui'
import { checkbuttonPermission } from '@/utils/permission'
export default {
  name: 'PowerAdmingroup',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Name: ''
      },
      dialogData: {
        ID: 0,
        name: '',
        memo: ''
      },
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false,
      dialogpowerVisible: false,
      dialogPowerdata: {
        name: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkStrictly: false,
        chkeddata: [],
        expandedID: [],
        powers: []
      },
      menuRequestdata: {
        adminGroupID: 0
      },
      menupowerpostdata: {
        adminGroupID: 0,
        menuIDs: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      fetchadminGroupList(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.Pageinfo.TotalCount
        this.listLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAdminGroup(this.dialogData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateAdminGroup(this.dialogData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        deleteAdminGroup({ ID: row.ID }).then(() => {
          this.$message({
            message: '操作Success',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {})
    },
    createpowers() {
      const chkdata = this.$refs.tree.getCheckedNodes(false, true)
      this.menupowerpostdata.menuIDs = []
      for (let i = 0; i < chkdata.length; i++) {
        this.menupowerpostdata.menuIDs.push(chkdata[i].ID)
      }
      this.menupowerpostdata.adminGroupID = this.menuRequestdata.adminGroupID
      menuspowerupdate(this.menupowerpostdata).then(() => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        this.dialogpowerVisible = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetDialogData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.resetDialogData()
      this.dialogStatus = 'update'
      this.dialogData.ID = row.ID
      this.dialogData.name = row.Name
      this.dialogData.memo = row.Memo
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlepower(row) {
      this.dialogPowerdata.name = row.Name
      this.dialogpowerVisible = true
      this.menuRequestdata.adminGroupID = row.ID
      menusAll(this.menuRequestdata).then(response => {
        const menus = response.Data
        const parentnodes = menus.filter(x => x.ParentID === 0)
        this.dialogPowerdata.powers = []
        this.dialogPowerdata.chkeddata = []
        this.dialogPowerdata.expandedID = []
        for (let i = 0; i < parentnodes.length; i++) {
          const tempParent = { ID: parentnodes[i].ID, label: parentnodes[i].Name, children: [] }
          const childPage = menus.filter(x => x.ParentID === parentnodes[i].ID)
          this.dialogPowerdata.expandedID.push(parentnodes[i].ID)
          if (childPage.length > 0) {
            for (let i2 = 0; i2 < childPage.length; i2++) {
              const temppage = { ID: childPage[i2].ID, label: childPage[i2].Name, children: [] }
              const cbuttons = menus.filter(x => x.ParentID === childPage[i2].ID)
              if (cbuttons.length > 0) {
                for (let i3 = 0; i3 < cbuttons.length; i3++) {
                  const tempButton = { ID: cbuttons[i3].ID, label: cbuttons[i3].Name, children: [] }
                  temppage.children.push(tempButton) // 往页面里加button 节点
                  if (cbuttons[i3].AdminGroupID > 0) {
                    this.dialogPowerdata.chkeddata.push(cbuttons[i3].ID)
                  }
                }
              } else { // 页面没有按钮
                if (childPage[i2].AdminGroupID > 0) {
                  this.dialogPowerdata.chkeddata.push(childPage[i2].ID)
                }
              }
              tempParent.children.push(temppage) // 将页面添加到节点下
            }
          } else {
            // 节点  没有页面 如果选中AdminGroupID》0  则选中
            if (parentnodes[i].AdminGroupID > 0) {
              this.dialogPowerdata.chkeddata.push(parentnodes[i].ID)
            }
          }
          this.dialogPowerdata.powers.push(tempParent)
        }
      })
    },
    resetDialogData() {
      this.dialogData = {
        ID: 0,
        name: '',
        memo: ''
      }
    }
  }
}
</script>

