import Cookies from 'js-cookie'

export const QiniuUrl = 'https://up-z2.qiniup.com'

export const TokenKey = 'Admin-Token'
export const QiniuKey = 'Qiniu-Token'
export const DominKey = 'Domin-Token'

export function getToken(key = TokenKey) {
  return Cookies.get(key)
}

export function setToken(token, key = TokenKey) {
  return Cookies.set(key, token)
}

export function removeToken(key = TokenKey) {
  return Cookies.remove(key)
}
