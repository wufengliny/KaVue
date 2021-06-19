<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkbuttonPermission('EatShopAdd')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openAdd">
        添加
      </el-button>
    </div>
    <el-table ref="katable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="商家名称">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.Image1" width="80px" :src="imgServerIP+ scope.row.Image1" class="imglists" @click="showImg(imgServerIP+ scope.row.Image1)">
          <img v-if="scope.row.Image2" width="80px" :src="imgServerIP+ scope.row.Image2" class="imglists" @click="showImg(imgServerIP+ scope.row.Image2)">
          <img v-if="scope.row.Image3" width="80px" :src="imgServerIP+ scope.row.Image3" class="imglists" @click="showImg(imgServerIP+ scope.row.Image3)">
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.AddTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.Memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="checkbuttonPermission('EatShopEdit')" type="success" size="mini" @click="openEdit(row)">
            编辑
          </el-button>
          <el-button v-if="checkbuttonPermission('EatShopDelete')" size="mini" type="danger" @click="deleteData(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dialogData" label-position="left" label-width="90px" style="width: 600px; margin-left:50px;">
        <el-form-item label="名称" prop="Name">
          <el-input v-model="dialogData.Name" placeholder="请输入商家名称" />
          <!-- // https://localhost:44374/api/home  http://192.168.11.2:8033/api/home/img -->
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :action="imgAPI"
            list-type="picture-card"
            :on-success="UpSuccess"
            :on-remove="removeImg"
            :limit="3"
            :on-exceed="overup"
            :before-upload="checkImg"
            accept=".gif,.jpg,.jpeg,.png"
            :file-list="filelist"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.Memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { EatShopList, EatShopAdd, EatShopDelete } from '@/api/eat'
import { checkbuttonPermission } from '@/utils/permission'
import { MessageBox } from 'element-ui'
export default {
  name: 'EatShopList',
  filters: {
    rate(row) {
      let resrate = ''
      if (row.ZJNum === 0 || row.EatNum === 0) {
        resrate = '0'
      } else {
        resrate = ((row.ZJNum / row.EatNum) * 100).toFixed(2)
      }
      return resrate + '%'
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      rules: {
        Name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }]
      },
      dialogData: {
        Name: '',
        Image1: '',
        Image2: '',
        Image3: '',
        Memo: ''
      },
      imgPlusSHow: false,
      imgServerIP: '',
      imgAPI: '',
      dialogImageVisible: false,
      dialogImageUrl: '',
      filelist: ''
    }
  },
  created() {
    this.getList()
    this.imgServerIP = this.GlobalVar.imgServerIP
    this.imgAPI = this.imgServerIP + '/api/home/img'
  },
  methods: {
    checkbuttonPermission,
    getList() {
      this.listLoading = true
      EatShopList().then(response => {
        this.list = response.Data
        this.listLoading = false
      })
    },
    openAdd() {
      this.dialogFormVisible = true
      this.filelist = []
    },
    UpSuccess(response, file, fileList) {
      if (file.response.statu === 1) {
        this.dealImgs(fileList)
      } else {
        this.$message.error(file.response.message)
      }
    },
    removeImg(file, fileList) {
      this.dealImgs(fileList)
    },
    overup(files, fileList) {
      this.$message.error('最多上传三张')
    },
    dealImgs(fileList) {
      if (fileList.length >= 1) {
        this.dialogData.Image1 = fileList[0].response.data
      }
      if (fileList.length >= 2) {
        this.dialogData.Image2 = fileList[1].response.data
      }
      if (fileList.length >= 3) {
        this.dialogData.Image3 = fileList[2].response.data
      }
    },
    createData() {
      EatShopAdd(this.dialogData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    showImg(url) {
      this.dialogImageVisible = true
      this.dialogImageUrl = url
    },
    checkImg(file) {
      const chkL = file.size / 1024 / 1024 < 1
      if (!chkL) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return chkL
    },
    deleteData(row, index) {
      MessageBox.confirm('确定要删除吗？', '提醒', {
        type: 'warning'
      }).then(() => {
        EatShopDelete({ ID: row.ID }).then(() => {
          this.$message({
            message: '操作Success',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.imglists{
  margin: 5px;
}
</style>

