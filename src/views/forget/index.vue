<template>
  <div class="wrapper">
    <div class="wrap">
      <h2>EZ Monitor</h2>
      <h3>忘记密码了？</h3>
      <p>输入注册的电子邮件以重置密码</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" clearable />
        </el-form-item>
      </el-form>
      <el-button class="submit" type="primary" :loading="btnLoading" @click="onFormSubmit()">
        发送邮件
      </el-button>
      <p class="login">
        <span @click="onGoto">返回登录</span>
      </p>
    </div>
  </div>
</template>

<script>
import { sendEmail } from '@/api/user'
import { validEmail } from '@/utils/validate'

export default {
  name: 'Forget',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }

    return {
      btnLoading: false,
      form: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateEmail, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          sendEmail(this.form)
            .then(response => {
              this.$reset()
              this.$message.success('发送成功')
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onGoto() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  .wrap {
    width: 500px;
    height: 400px;
    padding: 0 80px;
    background-color: #fff;
    margin-top: -100px;
    h2 {
      color: #409EFF;
      margin-top: 40px;
    }
    h3 {
      margin-top: 40px;
    }
    .el-form {
      margin-top: 80px;
    }
    .submit {
      width: 100%;
    }
    .login {
      text-align: center;
      font-size: 14px;
      span {
        color: #409EFF;
        cursor: pointer;
      }
    }
  }
}
</style>
