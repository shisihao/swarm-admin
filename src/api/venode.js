import request from '@/utils/request'

// 节点列表
export function dataList(params) {
  return request.get('/venode', {
    params
  })
}