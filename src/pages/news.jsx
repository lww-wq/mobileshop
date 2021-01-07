import React,{useState,useEffect} from 'react'
import { NavBar ,Tabs,List,ListView ,Icon} from 'antd-mobile'
import { Link } from 'umi'
import PTabBar from '@/components/p-tabbar.jsx'
import './news.less'
// 引入连接函数，将本页面与news的model连接，与vuex中在store中注册model是一样的原理
import { connect } from 'dva';
function News(props){
  //使用了connect之后我们就可以从props中获取dispatch和news两个对象
  const {dispatch,news} = props;
  //定义条件查询对象
  const [queryForm,setQueryForm] = useState({
    name:'',
    pno:1,
    psize:10,
    newsTypeId:''
  })
  //定义设置条件查询对象的函数
  const handleSetQueryForm = (key,value) => {
    queryForm[key] = value;
    setQueryForm({...queryForm})
  }
  //tabs切换的事件
  const handleNewsTypeChange = async (v) => {
    handleSetQueryForm('newsTypeId',v.key)
    // 由于切换后需要从头开始查询所以我们这里直接将pno设置成第一页
    handleSetQueryForm('pno',1)
    // 这里查询原始数据
    let list = await dispatch({type:'news/getListForPage',payload:queryForm})
    //将结果同步到ListView的数据源中
    setDataSource(dataSource.cloneWithRows(list))
  }

  // news加载函数
  useEffect(() => {
    //useEffect的执行函数不可以使用async修饰所以我们想要执行异步流程同步化的时候
    //需要在useEffect中定义一个自执行函数通过async修饰就可以了
    (async function(){
      //dispatch执行newsmodel中的getNewsTypeListAll函数与vuex中的mapActions类似
      let newsTypeList = await dispatch({type: 'news/getNewsTypeListAll'})
      //注意这里的newsTypeList是接口直接返回的数据和news.newsTypeList是两个不同的对象
      //将第一个类型的id设置到queryForm中
      handleSetQueryForm('newsTypeId',newsTypeList[0].id)
      //调用getListForPage并将queryForm传入
      let res = await dispatch({type:'news/getListForPage',payload:queryForm})
      console.log('news loaded')
      setDataSource(dataSource.cloneWithRows(res))
    })()
  },[])
  // 定义ListView需要的dataSource
  const [dataSource,setDataSource] = useState(
    new ListView.DataSource({
      // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  )
  // 定义正在加载页面的状态
  const [loading,setLoading] = useState(false)
  // 当页面距离底部达到定义的距离时会触发
  const onEndReached = () => {
    // 如果正在加载，或者已经到最后一页了就不需要调用接口了
    if (loading||news.page.pno>news.page.pCount) {
      return
    }
    console.log(news.page,queryForm)
    //如果不是就设置状态为查询中，这样多次触发也不会出现重复添加页面的问题
    setLoading(true)
    // 触发分页，将页号设置为当前页号+1
    handleSetQueryForm('pno',queryForm.pno+1)
    // 调用分页查询的接口，这个接口不会直接改变model中的list我们通过返回值进行修改
    dispatch({
      type:'news/getListForPageMore',
      payload:queryForm
    }).then(res => {
      // 将带新页面数据的list同步到ListView的数据源中
      setDataSource(dataSource.cloneWithRows(res.list))
      //将加载状态设置为false
      setLoading(false)
    })

  }
  // 定义每行的对象
  const Row = (rowData, sectionID, rowID) => {
    // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
    return (
      <Link to={'/news-info?id='+rowData.id}>
        <List.Item
          key={rowID}
          thumb={
            <img src={rowData.logo} style={{width:'40px',height:'40px'}}/>
          }
          arrow="horizontal"
          >
          {rowData.name}
          <List.Item.Brief>
            {rowData.description}
          </List.Item.Brief>
        </List.Item>
      </Link>
    )
  }
  /**
   * ListView参数说明
   * dataSource：ListView的数据源，他需要通过这个对象来展示列表数据，这里参考上面的数据定义来记就可以，常用的分页都可以这样做
   * renderFooter：是ListView最底部的元素，用来提示当前正在加载新页面或已经到底部了，配合loading进行切换展示
   * renderRow:是一个Jsx对象，用决定每一行数据的展示样式参考Row对象的写法
   * useBodyScroll：代表使用body的滚动事件
   * onEndReachedThreshold：代表距离底部多少像素时触发onEndReached
   * onEndReached：当页面拉到onEndReachedThreshold位置时触发
   * pageSize：代表每页展示的数据条数
   */
  return (
    <div className="news-page">
      <div className="news-header">
        <NavBar mode="light">新闻</NavBar>
        <Tabs
          tabs={news.newsTypeList}
          onChange={handleNewsTypeChange}
          ></Tabs>
      </div>
      <ListView
        dataSource={dataSource}
        renderFooter={() => (<div className="footer">{loading ? '加载中...' : '暂无更多数据'}</div>)}
        renderRow={Row}
        useBodyScroll
        onEndReachedThreshold={100}
        onEndReached={onEndReached}
        pageSize={news.page.psize}
        >
      </ListView>
      <PTabBar path="/news"></PTabBar>
    </div>
  )
}
// 引入connect之后导出写法变成如下写法
//connect中的参数中的news就是在news的model定义的名字
//最下面括号的News是我们要整合的页面数据对象，
//通过这一步操作之后我们本页对象的props中就存在news和dispatch两个对象
//news中包括了在命名为news的model的所有state可以直接获取值
//dispatch可以执行model中的effects相当于vuex中的actions
export default connect(({news}) =>{
  return {
    news
  }
})(News);
