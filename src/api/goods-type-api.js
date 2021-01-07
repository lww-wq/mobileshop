import http from '@/http'
export const getGoodsTypeList = () => {
  return http({
    url:'/goods-type/list/all',
    method:'get'
  })
}
