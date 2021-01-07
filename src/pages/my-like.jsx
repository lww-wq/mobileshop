import  React,{useState,useEffect} from 'react'
import PTabBar from '@/components/p-tabbar.jsx'
import { NavBar,Icon ,ListView,List,Button} from 'antd-mobile'
import {Link} from 'umi'
import { connect } from 'dva'
function MyLike(props){
  //获取dva中的me对象和dispatch对象
  const {myLike,dispatch} = props

  //定义条件查询对象
  const [queryForm,setQueryForm] = useState({
    pno:1,
    psize:10
  })
  //定义设置条件查询对象的函数
  const handleSetQueryForm = (key,value) => {
    queryForm[key] = value;
    setQueryForm({...queryForm})
  }
  //定义dataSource
  const [dataSource,setDataSource] = useState(
    new ListView.DataSource({
      // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  )
  //监听myLike.list并同步到dataSource中
  useEffect(() => {
    console.log(myLike.list)
    setDataSource(dataSource.cloneWithRows(myLike.list))
  },[myLike.list])

  // 定义每行的对象
  const Row = (rowData, sectionID, rowID) => {
    //执行删除按钮
    const handleDeleteLike = async (event,id) => {
      //阻止默认事件，这里防止点击按钮时发生跳页
      event.preventDefault()
      //调用删除业务
      await dispatch({
        type:'myLike/deleteLikes',
        payload:id
      })
      //重新查询第一页收藏
      handleSetQueryForm('pno',1)
      await dispatch({
        type:'myLike/getListForPage',
        payload:queryForm
      })
    }
    // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
    return (
      <Link to={'/shop-info?id='+rowData.id}>
        <List.Item
          key={rowID}
          thumb={
            <img src={rowData.logo} style={{width:'40px',height:'40px'}}/>
          }
          extra={
            <Button size="small" inline type="primary"
              onClick={
                (event) => {
                  handleDeleteLike(event,rowData.id)
                }
              }
            >取消收藏</Button>
          }
          >
          {rowData.name}
          <List.Item.Brief>
            {rowData.description}
          </List.Item.Brief>
        </List.Item>
      </Link>
    )
  }
  // 加载函数
  useEffect(() => {
    (async () => {
      handleSetQueryForm('pno',1)
      await dispatch({
        type:'myLike/getListForPage',
        payload:queryForm
      })
    })()
  },[])

  const [loading,setLoading] = useState(false)

  // 当页面距离底部达到定义的距离时会触发
  const onEndReached = async () => {
    if(loading||myLike.page.pno>=myLike.page.pCount){
      return
    }
    setLoading(true)
    console.log('到达分页点')
    handleSetQueryForm('pno',queryForm.pno+1)
    await dispatch({
      type:'myLike/getListForPageMore',
      payload:queryForm
    })
    setLoading(false)
  }

  return (
    <div className="my-like-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
      >我的收藏</NavBar>
      <ListView
        dataSource={dataSource}
        renderRow={Row}
        useBodyScroll
        onEndReached={onEndReached}
        onEndReachedThreshold={20}
        pageSize={queryForm.psize}>
      </ListView>
    </div>
  )
}
export default connect(({myLike}) => {
  return {myLike}
})(MyLike);
