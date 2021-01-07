import http from '@/http'
export const getOrderListForPage = (params) => {
  return http({
    url:'/order/list/page',
    method:'get',
    params
  })
}

export const insertOrder = (data) => {
  return http({
    url:`/order/insert`,
    method:'put',
    data
  })
}

export const reciveGoods = (params) => {
  return http({
    url:`/order/recive`,
    method:'get',
    params
  })
}
