import {insertOrder,getOrderListForPage,reciveGoods} from '../../../api/order-api.js'
import {history} from 'umi'
import {Toast} from 'antd-mobile'
//定义model模型
export default {
  namespace: 'order',
  //state与vuex的state完全一样
  state: {
    list:[],
    page:{
      pno:1,
      psize:10,
      pCount:0,
      totalElements:0
    }
  },
  // reducers相当于vuex中的mutations用法类似，按照下列语法即可
  reducers: {
    setList(state,{payload:list}){
      console.log(list)
      return {...state,list}
    },
    setPage(state,{payload:page}){
      return {...state,page}
    }
  },
  effects:{
    //查询第一页的时候
    *getListForPage({payload},{put,call}){
      let res = yield call(getOrderListForPage,payload)
      if(res.data.code == 200){
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
      let res = yield call(getOrderListForPage,payload)
      if(res.data.code == 200){
        let list = yield select(({order}) => order.list)
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
    *insert({payload},{call,put}){
      let res = yield call(insertOrder,payload);
      if(res.data.code ==200){
        Toast.success('购买成功',1)
        history.push('/buy-info')
      }
    },
    *recive({payload},{call,put}){
      let res = yield reciveGoods(payload)
      if(res.data.code ==200){
        Toast.success('收货成功',1)
      }
    }
  }
};
