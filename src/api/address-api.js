import http from '@/http'


export const insertAddress = (data) => {
  return http({
    url:'/address/insert',
    method:'put',
    data
  })
}

export const getAddressListForPage = (params) => {
  return http({
    url:'/address/list/page',
    method:'get',
    params
  })
}

export const updateAddress = (data) => {
  return http({
    url:'/address/update',
    method:'put',
    data
  })
}


export const findAddressById = (id) => {
  return http({
    url:`/address/find/id/${id}`,
    method:'get',
  })
}

export const deleteAddressById = (id) => {
  return http({
    url:`/address/delete/id/${id}`,
    method:'delete',
  })
}


export const setAddressDefault = (id) => {
  return http({
    url:`/address/default/id/${id}`,
    method:'post',
  })
}