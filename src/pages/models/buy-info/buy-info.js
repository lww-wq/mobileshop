//定义model模型
export default {
  namespace: 'buyInfo',
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
      return {...state,list}
    },
    setPage(state,{payload:page}){
      return {...state,page}
    }
  },
  effects:{
    //查询第一页的时候
    *getListForPage({payload},{put,call}){
    },
    //分页查询更多的时候
    *getListForPageMore({payload},{put,call,select}){
    },

  }
};
