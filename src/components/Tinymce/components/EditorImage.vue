<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片/视频
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload
        ref="pictureUpload"
        :multiple="true"
        :data="dataObj"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :on-error="handleError"
        :on-change="handleChange"
        :http-request="uploadRequest"
        class="editor-slide-upload"
        :action="QiniuUrl"
        accept="image/*,video/*"
        list-type="picture-card"
      >
        <div slot="file" slot-scope="{ file }">
          <div v-if="file.url">
            <video v-if="file.type ? file.type.indexOf('video/') >= 0 : ''" class="el-upload-list__item-thumbnail" :src="file.url" />
            <img v-else class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          </div>
          <div v-else>
            <video v-if="file.response ? file.response.mime.indexOf('video/') >= 0 : ''" class="el-upload-list__item-thumbnail" :src="file.url" />
            <img v-else-if="file.response ? file.response.mime.indexOf('image/') >= 0 : ''" class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          </div>
          <span class="el-upload-list__item-actions">
<!--            <span class="el-upload-list__item-preview">
              <i class="el-icon-zoom-in" />
            </span>
            <span class="el-upload-list__item-delete">
              <i class="el-icon-download" />
            </span>-->
            <span class="el-upload-list__item-delete" @click="handleRemove1(file)">
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { DominKey, QiniuUrl, QiniuKey, getToken, setToken } from '@/utils/auth'
import { getQiniuToken } from '@/api/qiniu'
import axios from 'axios'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      QiniuUrl,
      dataObj: { 'token': getToken(QiniuKey), key: '' },
      domin: getToken(DominKey),
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      console.log(this.listObj)
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功。如果有网络问题，请刷新页面并重新上传!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = this.domin + response.filename
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    handleRemove1(file) {
      this.$refs.pictureUpload.handleRemove(file)
    },
    handleChange(file) {
      for (let i = 0, len = this.$refs.pictureUpload.uploadFiles.length; i < len; i++) {
        if (this.$refs.pictureUpload.uploadFiles[i].uid === file.uid) {
          this.$refs.pictureUpload.uploadFiles[i].type = file.raw.type
        }
      }
    },
    beforeUpload(file) {
      this.dataObj.token = getToken(QiniuKey)
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        if (file.type.indexOf('image/') >= 0) {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height, type: 'image' }
          }
        } else if (file.type.indexOf('video/') >= 0) {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: 0, height: 0, type: 'video' }
        }
        resolve(true)
      })
    },
    uploadRequest(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append('file', fileObj)
      form.append('key', `${String(+new Date()) + Math.random().toString(36).substr(2)}.${fileObj.name.split('.').pop()}`)
      form.append('token', this.dataObj.token)
      axios({
        url: QiniuUrl,
        method: 'post',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        this.handleSuccess(res.data, fileObj)
      }).catch(res => {
        this.handleError(res, fileObj)
        this.listObj = {}
        this.fileList = []
        this.dialogVisible = false
      })
    },
    handleError(err, file, fileList) {
      if (err.message.indexOf('token') !== -1 || err.message.indexOf('401')) {
        getQiniuToken()
          .then((data) => {
            setToken(data.data, QiniuKey)
          })
          .finally(() => {
            this.$message.error('上传失败，请重新上传')
          })
      } else {
        this.$message.error('上传失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    ::v-deep .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
