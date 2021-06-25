import request from '@/utils/request'

// 用户列表
export function dataList(params) {
  return request.get('/users', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/users'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/users/${id}`)
}


// 注册
export function addRegister(data) {
  return request.post(`/users/register`, {
    ...data
  })
}

// 发送邮箱
export function sendEmail(data) {
  return request.post(`/users/email`, {
    ...data
  })
}