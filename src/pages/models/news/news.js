import { getNewsTypeList } from '@/api/news-type-api.js'
import { getNewsListForPage ,findNewsById} from '@/api/news-api.js'
//定义model模型
export default {
  // 命名空间，起名为news
  namespace: 'news',
  //state与vuex的state完全一样
  state: {
    newsTypeList:[],
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
    // 这里相当于mutations中的set方法主要用途就是用来设置state的值
    //参数为固定写法第一个为state根mutations中的state一样就是本页的state对象
    //第二个为{payload:参数}payload为固定名称，这里不能通过state.newsTypeList附值
    //必须通过return将state与newsTypeList合并成新的对象并返回才能设置到state上
    setNewsTypeList(state,{payload:newsTypeList} ) {
      newsTypeList = newsTypeList.map(item => {
        return {
          title:item.name,
          key:item.id
        }
      })
      return {...state,newsTypeList}
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
  // effects相当于vuex中的actions，用法类似
  //参数不同他的第一个参数中的payload是在页面组件中调用时传入的参数
  //第二个大参数中的put和call分别是
  //put代表vuex中的commit用来执行本页的reducers函数，执行格式与dispatch方法一样
  //call用来调用接口函数，第一个参数是接口函数名称，如果接口有参数就放在第二个参数里
  //由于本函数是通过yield控制延迟执行的，模式类似与async和await但是原理不同所以需要配合
  //put和call
  effects:{
    // *函数为异步函数生成器名称用来按照yield的顺序推入执行器执行，也可以将*理解为async yield理解为await
    //不过他们两个的本质是不同的
    //payload是从第一个参数对象中解析出来的代表调用getNewsTypeListAll时传入的参数
    *getNewsTypeListAll({payload},{put,call}){
      //call(函数名,参数),如call(getNewsTypeList,参数（可省略）)表示getNewsTypeList(参数)
      //通过call调用才能被yield修饰执行
      let res = yield call(getNewsTypeList);
      if(res.data.code == 200){
        //put相当于vuex中的commit用来执行本model中的reducers定义的函数，通过payload传入参数
        yield put({
          type:'setNewsTypeList',
          payload:res.data.data.list
        })
        //用于实现async和await的流程控制
        return yield Promise.resolve(res.data.data.list)
      }
      // return yield Promise.reject()
    },
    *getListForPage({payload},{put,call}){
      let res = yield call(getNewsListForPage,payload)
      if(res.data.code == 200){
        yield put({
          type:'setList',
          payload:res.data.data.list
        })
        yield put({
          type:'setPage',
          payload:res.data.data.page
        })
        return yield Promise.resolve(res.data.data.list)
      }
      // return yield Promise.reject()
    },
    //分页查询更多页时调用的函数，这里只改变分页数据不改变news.list,返回值也有变化
    *getListForPageMore({payload,state},{put,call,select}){
      let res = yield call(getNewsListForPage,payload)
      if(res.data.code == 200){
        yield put({
          type:'setPage',
          payload:res.data.data.page
        })
        // 获取当前model的list的值
        let list = yield select(({news}) => {
          return news.list
        })
        // 将分页结果与当前list的值拼接
        list = list.concat(res.data.data.list)
        // 将新的list放到news.list中
        yield put({
          type:'setList',
          payload:list
        })
        // 返回新的list
        return yield Promise.resolve({
          list:list,
          page:res.data.data.page
        })
      }
      // return yield Promise.reject()
    },
    *findById({payload},{put,call}){
      let res = yield call(findNewsById,payload)
      if(res.data.code == 200){
        yield put({
          type:'setFormData',
          payload:res.data.data
        })
        return yield Promise.resolve(res.data.data)
      }
      // return yield Promise.reject()
    }
  }
};
