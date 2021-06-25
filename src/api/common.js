import request from '@/utils/request'

// 登录
export function login(data) {
  return request.post('/login',
    data
  )
}

export function getInfo(token) {
  return request.get('/info', {
    params: { token }
  })
}

export function logout() {
  return request.put('/logout')
}

// 获取 菜单栏 Sidebar
export function getMenuNav() {
  return request.get('/nav')
}
