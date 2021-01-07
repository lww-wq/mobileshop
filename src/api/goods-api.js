import http from '@/http'
export const getGoodsListForPage = (params) => {
  return http({
    url:'/goods/list/page',
    method:'get',
    params
  })
}

export const findGoodsById = (id) => {
  return http({
    url:`/goods/find/id/${id}`,
    method:'get'
  })
}
