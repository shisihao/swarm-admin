<template>
  <el-dialog title="批量添加" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上传文件" prop="url">
        <el-upload
          :action="QiniuUrl"
          :data="{'token': qiniu}"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { QiniuUrl, DominKey, getToken } from '@/utils/auth'
import { addmore } from '@/api/swarm'
import store from '@/store'

export default {
  name: 'AddMore',
  data() {
    return {
      visible: false,
      btnLoading: false,
      QiniuUrl,
      qiniu: getToken(DominKey),
      form: {
        url: ''
      },
      fileList: [],
      rules: {
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(data)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(({ msg = '操作失败！' }) => {
              this.btnLoading = false
              this.$message.error(msg)
            })
        }
      })
    },
    onClose() {
      this.$reset('form', false)
    },
    // 上传文件
    beforeUpload(file) {
      const type = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      // const isLt50M = file.size / 1024 / 1024 < 50
      const time = 60

      if (!type.includes(file.type)) {
        this.$message.error('上传文件只能是 xlsx 格式')
        return false
      }

      /* if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50M')
        return false
      }*/

      return true

    },
    handleRemove(file, fileList) {
      this.form.url = ''
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件,请移除后再上传`)
    },
    handleSuccess(response, file, fileList) {
      this.form.url = response.filename
    },
    handleError(err, file, fileList) {
      if (err.toString().indexOf('token') >= 0) {
        this.$alert('登录已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          showClose: false,
          callback: action => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        })
      } else {
        this.$message.error(`上传失败`)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
