import {insertAddress,getAddressListForPage,updateAddress,findAddressById,deleteAddressById,setAddressDefault} from '../../../api/address-api.js'
import {history} from 'umi'
//定义model模型
export default {
  namespace: 'address',
  //state与vuex的state完全一样
  state: {
    list:[],
    page:{
      pno:1,
      psize:10,
      pCount:0,
      totalElements:0
    },
    formData:{}
  },
  // reducers相当于vuex中的mutations用法类似，按照下列语法即可
  reducers: {
    setList(state,{payload:list}){
      return {...state,list}
    },
    setPage(state,{payload:page}){
      return {...state,page}
    },
    setFormData(state,{payload:formData}){
      return {...state,formData}
    },
  },
  effects:{
    //查询第一页的时候
    *getListForPage({payload},{put,call}){
      let res = yield call(getAddressListForPage,payload)
      if(res.data.code ==200){
        yield put({
          type:'setList',
          payload:res.data.data.list
        })
        yield put({
          type:'setPage',
          payload:res.data.data.page
        })
      }
    },
    //分页查询更多的时候
    *getListForPageMore({payload},{put,call,select}){
      let res = yield call(getAddressListForPage,payload)
      if(res.data.code ==200){
        let list = yield select(({address}) => address.list)
        list = list.concat(res.data.data.list)
        yield put({
          type:'setList',
          payload:list
        })
        yield put({
          type:'setPage',
          payload:res.data.data.page
        })
      }
    },
    *insert({payload},{put,call}){
      let res = yield call(insertAddress,payload)
      if(res.data.code == 200){
        history.go(-1)
      }
    },
    *update({payload},{put,call}){
      let res = yield call(updateAddress,payload)
      if(res.data.code == 200){
        history.go(-1)
      }
    },
    *deleteById({payload},{put,call}){
      yield call(deleteAddressById,payload)

    },
    *findById({payload},{put,call}){
      let res = yield call(findAddressById,payload)
      if(res.data.code == 200){
        yield put({
          type:'setFormData',
          payload:res.data.data
        })
      }
    },
    *setDefault({payload},{call,put}){
      yield call(setAddressDefault,payload)
    }
  }
};
