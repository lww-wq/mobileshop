import http from '@/http'
export const getCode = () => {
  return http({
    url:'/user/code',
    method:'get'
  })
}

export const register = (params) => {
  return http({
    url:'/user/register',
    method:'get',
    params
  })
}

export const login = (data) => {
  return http({
    url:'/user/login/shop',
    method:'post',
    data
  })
}

export const updateUser = (data) => {
  return http({
    url:'/shop-user/update',
    method:'put',
    data
  })
}

export const addLikeGoods = (id) => {
  return http({
    url:`/shop-user/add/like/${id}`,
    method:'put',
  })
}

export const getLikeListForPage = (params) => {
  return http({
    url:`/shop-user/like/list`,
    method:'get',
    params
  })
}

export const deleteLikeGoods = (id) => {
  return http({
    url:`/shop-user/delete/like/${id}`,
    method:'delete',
  })
}

export const changePass = (params) => {
  return http({
    url:`/user/change/pass`,
    method:'get',
    params
  })
}
