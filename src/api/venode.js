import request from '@/utils/request'

// ่็นๅ่กจ
export function dataList(params) {
  return request.get('/venode', {
    params
  })
}