import {history} from 'umi'
import {Toast} from 'antd-mobile'
import {updateUser} from '../../../api/user-api.js'
export default {
  namespaced:'me',
  state:{
    userInfo:{}
  },
  reducers:{
    setUserInfo(state,{payload:userInfo}){
      return {...state,userInfo}
    }
  },
  effects:{
    //从sessionStorage中获取用户信息
    *getUserInfo({payload},{call,put}){
      let userInfo = {}
      try{
        userInfo = JSON.parse(sessionStorage.userInfo)
      }catch(e){
        userInfo = {}
      }
      if(Object.keys(userInfo).length == 0){
        Toast.fail('您的登录已过期',2)
        history.push('/login')
      }
      yield put({
        type:'setUserInfo',
        payload:userInfo
      })

    },
    *update({payload},{call,put}){
      let res =  yield call(updateUser,payload)
      if(res.data.code == 200){
        yield put({
          type:'setUserInfo',
          payload
        })
        sessionStorage.userInfo = JSON.stringify(payload)
        history.go(-1)
      }
    }
  }
}
