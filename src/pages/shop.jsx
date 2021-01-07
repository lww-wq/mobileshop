import  React,{useState,useEffect} from 'react'
import PTabBar from '@/components/p-tabbar.jsx'
import { NavBar,Tabs,ListView,List } from 'antd-mobile'
// 引入连接对象
import { connect } from 'dva'
import {Link} from 'umi'

import './shop.less'
function Shop(props){
  //连接后我们就可以从props中得到shop和dispatch对象
  const {shop,dispatch} = props

  //定义条件查询对象
  const [queryForm,setQueryForm] = useState({
    name:'',
    pno:1,
    psize:10,
    goodsTypeId:'',
    isOnSale:1//这里需要只查询在架商品
  })
  //定义设置条件查询对象的函数
  const handleSetQueryForm = (key,value) => {
    queryForm[key] = value;
    setQueryForm({...queryForm})
  }

  const handleGoodsTypeChange = async (v) => {
    console.log(v)

    //设置页数为1
    handleSetQueryForm('pno',1)
    //设置查询的类型id
    handleSetQueryForm('goodsTypeId',v.key)
    //根据参数查询list
    await dispatch({
      type:'shop/getListForPage',
      payload:queryForm
    })
  }

// shop加载函数
  useEffect(() => {
    (async () => {
      let goodsTypeList = await dispatch({
        type:'shop/getGoodsTypeListAll'
      })
      //设置分页为商品类型为第一个类型的商品
      handleSetQueryForm('goodsTypeId',goodsTypeList[0].id)
      //查询商品列表
      let res =await dispatch({
        type:'shop/getListForPage',
        payload:queryForm
      })
      console.log(shop.list)
      console.log('shop loaded')
    })()

  },[])


  const [dataSource,setDataSource] = useState(
    new ListView.DataSource({
      // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  )
  useEffect(() => {
    console.log(shop.list)
    setDataSource(dataSource.cloneWithRows(shop.list))
  },[shop.list])
  // 定义每行的对象
  const Row = (rowData, sectionID, rowID) => {
    // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
    return (
      <Link to={'/shop-info?id='+rowData.id}>
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

  const [loading,setLoading] = useState(false)

  // 当页面距离底部达到定义的距离时会触发
  const onEndReached = async () => {
    if(loading||shop.page.pno>=shop.page.pCount){
      return
    }
    setLoading(true)
    console.log('到达分页点')
    handleSetQueryForm('pno',queryForm.pno+1)
    await dispatch({
      type:'shop/getListForPageMore',
      payload:queryForm
    })
    setLoading(false)
  }
  return (
    <div className="shop-page">
      <div className="shop-header">
        <NavBar mode="light"
          >商城</NavBar>
        <Tabs
          tabs={shop.goodsTypeList}
          onChange={handleGoodsTypeChange}
        ></Tabs>
      </div>
      <ListView
        dataSource={dataSource}
        renderRow={Row}
        renderFooter={() => (
          <div className="footer">
           { loading?'加载中':'没有更多数据了'}
          </div>
        )}
        useBodyScroll
        onEndReachedThreshold={20}
        onEndReached={onEndReached}
        pageSize={shop.page.psize}>
      </ListView>
      <PTabBar path="/shop"></PTabBar>
    </div>

  )
}
//连接shop.js
export default connect(({shop}) => {
  return {shop}
})(Shop)
