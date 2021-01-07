import http from '@/http'
export const getNewsListForPage = (params) => {
  return http({
    url:'/news/list/page',
    method:'get',
    params
  })
}

export const findNewsById = (id) => {
  return http({
    url:`/news/find/id/${id}`,
    method:'get',
  })
}