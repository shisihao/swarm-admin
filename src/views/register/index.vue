<template>
  <div class="wrapper">
    <div class="wrap">
      <h2>EZ Monitor</h2>
      <h3>新用户注册!</h3>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" :type="pwdType ? 'text' : 'password'" placeholder="密码" />
          <span class="show-pwd" @click="pwdType = !pwdType">
            <svg-icon :icon-class="pwdType ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号" maxlength="11" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" clearable />
        </el-form-item>
         <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名" clearable />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="年龄" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="备注" clearable />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期至" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="true"
            :picker-options="pickerDayOptions"
          />
        </el-form-item>
      </el-form>
      <el-button class="submit" type="primary" :loading="btnLoading" @click="onFormSubmit()">
        注 册
      </el-button>
      <p class="login">
        已经拥有账户? <span @click="onGoto">登 录</span>
      </p>
    </div>
  </div>
</template>

<script>
import { pickerDayOptions } from '@/utils/explain'
import { addRegister } from '@/api/user'
import { validPhone, validName, validAccount, validEmail } from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!validAccount(value)) {
        callback(new Error('只能是英文及数字'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (/\s/.test(value)) {
        callback(new Error('不能包含空格'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('只能是6-20位'))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }

    return {
      btnLoading: false,
      pwdType: false,
      pickerDayOptions,
      sexOptions: [
        { label: '女', value: 0 },
        { label: '男', value: 1 },
      ],
      form: {
        username: '',
        password: '',
        phone: '',
        email: '',
        name: '',
        age: '',
        remark: '',
        sex: '',
        date: `${new Date(new Date().getTime() + 3 * 24 * 60 *60 * 1000).getFullYear()}-${new Date(new Date().getTime() + 3 * 24 * 60 *60 * 1000).getMonth() + 1}-${new Date(new Date().getTime() + 3 * 24 * 60 *60 * 1000).getDate()}`
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateAccount, trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validatePassword, trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateEmail, trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        date: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
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
          addRegister(this.form)
            .then(response => {
              this.$reset()
              this.$message.success('注册成功')
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
    width: 600px;
    height: 600px;
    padding: 0 80px;
    background-color: #fff;
    margin-top: -100px;
    h2 {
      color: #409EFF;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      cursor: pointer;
      user-select: none;
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
