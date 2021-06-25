<template>
  <el-dialog :title="`${form.id ? $t('table.edit') : $t('table.add')}节点`" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="节点主机名" prop="a">
        <el-input v-model="form.a" placeholder="节点主机名" clearable />
      </el-form-item>
      <el-form-item label="内网IP地址" prop="b">
        <el-input v-model="form.b" placeholder="内网IP地址" clearable />
      </el-form-item>
      <el-form-item label="内网 DEBUG 端口" prop="c">
        <el-input v-model="form.c" placeholder="内网 DEBUG 端口" clearable />
      </el-form-item>
      <el-form-item label="外网IP地址" prop="d">
        <el-input v-model="form.d" placeholder="外网IP地址" clearable />
      </el-form-item>
      <el-form-item label="外网 DEBUG 端口" prop="e">
        <el-input v-model="form.e" placeholder="外网 DEBUG 端口" clearable />
      </el-form-item>
      <el-form-item label="位置信息" prop="f">
        <el-select v-model="form.f" placeholder="请选择">
          <el-option
            v-for="item in addressOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="g">
        <el-input v-model="form.g" placeholder="备注" clearable />
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
import { addOrUpdate } from '@/api/swarm'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      addressOptions: [
        { label: '国内', value: '国内' },
        { label: '海外', value: '海外' }
      ],
      form: {
        id: 0,
        avatar: '',
        name: '',
        phone: ''
      },
      rules: {
        a: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        b: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        c: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        d: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        e: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        f: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  min-height: 100px;

  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  width: 100%;
  height: auto;
}
</style>
