import { getGoodsTypeList } from '@/api/goods-type-api.js'
import { getGoodsListForPage,findGoodsById } from '@/api/goods-api.js'
import { addLikeGoods } from '../../../api/user-api.js'
import { Toast } from 'antd-mobile'
//定义model模型
export default {
  // 命名空间，起名为news
  namespace: 'shop',
  //state与vuex的state完全一样
  state: {
    goodsTypeList:[],
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
    setGoodsTypeList(state,{payload:goodsTypeList} ) {
      goodsTypeList = goodsTypeList.map(item => {
        return {
          title:item.name,
          key:item.id
        }
      })
      return {...state,goodsTypeList}
    },
    setList(state,{payload:list}){
      return {...state,list}
    },
    setPage(state,{payload:page}){
      return {...state,page}
    },
    setFormData(state,{payload:formData}){
      return {...state,formData}
    }
  },
  effects:{
    *getGoodsTypeListAll({payload},{put,call}){
      let res = yield call(getGoodsTypeList)
      if(res.data.code == 200 ){
        yield put({
          type:'setGoodsTypeList',
          payload:res.data.data.list
        })
        return Promise.resolve(res.data.data.list)
      }
      // return Promise.reject()
    },
    *getListForPage({payload},{put,call}){
      let res = yield call(getGoodsListForPage,payload)
      if(res.data.code == 200){
        yield put({
          type:'setList',
          payload:res.data.data.list
        })
        yield put({
          type:'setPage',
          payload:res.data.data.page
        })
        return Promise.resolve(res.data.data.list)
      }
      // return Promise.reject()
    },
    *getListForPageMore({payload},{put,call,select}){
      let res = yield call(getGoodsListForPage,payload)
      if(res.data.code == 200){
        //获取当前list中的数据
        let list = yield select(({shop}) => shop.list)
        //将新老数据连接成新数组
        list = list.concat(res.data.data.list)
        //将新数组设置回当前的list
        yield put({
          type:'setList',
          payload:list
        })
        //设置分页对象
        yield put({
          type:'setPage',
          payload:res.data.data.page
        })
        //返回数据
        return Promise.resolve(res.data.data.list)
      }
      // return Promise.reject()
    },
    *findById({payload},{call,put}){
      let res = yield call(findGoodsById,payload)
      if(res.data.code == 200){
        yield put({
          type:'setFormData',
          payload:res.data.data
        })
        return Promise.resolve(res.data.data)
      }
    },
    //调用收藏接口
    *addLike({payload},{call,put}){
      let res = yield call(addLikeGoods,payload)
      //这里需要对收藏成功生成提示语
      if(res.data.code == 200){
        Toast.success('收藏成功',1)
      }
    }
  }
};
