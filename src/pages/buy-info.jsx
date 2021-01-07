import React,{useState,useEffect} from 'react'
import { connect } from 'dva'
import { NavBar ,Icon ,Carousel,WhiteSpace,Tabs,ListView,Button,Modal} from 'antd-mobile'
import './buy-info.less'
function BuyInfo(props){
  const {order,dispatch} = props
  const [orderStatusList,setOrderStatusList] = useState([
    {title:'已支付',key:'1'},
    {title:'已发货',key:'2'},
    {title:'确认收货',key:'3'}
  ])
  const handleStatusChange = async (v) => {
    handleSetQueryForm('status',v.key)
    await dispatch({
      type:'order/getListForPage',
      payload:queryForm
    })
  }
  //定义条件查询对象
  const [queryForm,setQueryForm] = useState({
    phone:'',
    pno:1,
    psize:10,
    status:'1'
  })
  //定义设置条件查询对象的函数
  const handleSetQueryForm = (key,value) => {
    queryForm[key] = value;
    setQueryForm({...queryForm})

  }

  useEffect(() => {
    (async ()=>{
      console.log('buyInfo loaded')
      let useInfo = JSON.stringify(sessionStorage.userInfo)
      handleSetQueryForm('phone',useInfo.phone)
      await dispatch({
        type:'order/getListForPage',
        payload:queryForm
      })
    })()
  },[])



  const [dataSource,setDataSource] = useState(
    new ListView.DataSource({
      // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  )
  useEffect(() => {
    console.log(order.list)
    setDataSource(dataSource.cloneWithRows(order.list))
  },[order.list])


  // 定义每行的对象
  const Row = (rowData, sectionID, rowID) => {
    const handleRecive = (id) => {
      let alert = Modal.alert('提示','正在确认收货，请确保已经收到货点击确认',[
        {
          text:'确认',
          onPress:async () => {
            await dispatch({
              type:'order/recive',
              payload:{
                id
              }
            })
            handleSetQueryForm('pno',1)
            await dispatch({
              type:'order/getListForPage',
              payload:queryForm
            })
            alert.close()
          }
        },{
          text:'取消',
          onPress:async () => {
            alert.close()
          }
        }
      ])
    }
    const formatTime = (time) => {
      let d = new Date(Number(time));
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    }
    // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
    return (
       <div className="order-item">
          <div className="order-title">
            <div className="order-no">订单号:{rowData.orderNo}</div>
            <div className="order-no">时间:{formatTime(rowData.insertTime)}</div>
          </div>
          <div className="goods-info">
            <div>
              商品名称:{rowData.name}
            </div>
            <div>
              商品原价:{rowData.singlePriceOld}
            </div>
            <div>
              商品价格:{rowData.singlePrice}
            </div>
            <div>
              购买数量:{rowData.num}
            </div>
            {
              rowData.status!=1?
              <div>
                物流编号:{rowData.postCode}
              </div>
              :[]
            }
            
          </div>
          <div className="tools">
            <span>总价:<span className="total">{rowData.totalPrice}</span></span>

            {
              rowData.status == 2?
              ( <Button inline type="warning" onClick={handleRecive.bind(this,rowData.id)} size="small">确认收货</Button>):
              rowData.status == 1?
                ( <Button inline type="primary"  size="small">已支付</Button>):
                ( <Button inline   size="small">确认收货</Button>)
            }
          </div>
       </div>
    )
  }
  const [loading,setLoading] = useState(false)

  // 当页面距离底部达到定义的距离时会触发
  const onEndReached = async () => {
    if(loading||order.page.pno>=order.page.pCount){
      return
    }
    setLoading(true)
    console.log('到达分页点')
    handleSetQueryForm('pno',queryForm.pno+1)
    await dispatch({
      type:'order/getListForPageMore',
      payload:queryForm
    })
    setLoading(false)
  }
  return (
    <div className="buy-info-page">
      <div className="buy-info-header">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => props.history.go(-1)}
        >已买到的商品</NavBar>
        <Tabs
          tabs={orderStatusList}
          onChange={handleStatusChange}>
        </Tabs>
      </div>
      <ListView
        dataSource={dataSource}
        renderRow={Row}
        renderFooter={() => (
          <div className="footer" style={{textAlign:'center'}}>
           { loading?'加载中':'没有更多数据了'}
          </div>
        )}
        useBodyScroll
        onEndReachedThreshold={20}
        onEndReached={onEndReached}
        pageSize={order.page.psize}>
      </ListView>
    </div>
  )
}
export default connect(({order}) => {
  return {order}
})(BuyInfo)
