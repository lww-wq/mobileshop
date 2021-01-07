import React,{useState,useEffect} from 'react'
import { connect } from 'dva'
import { NavBar ,Icon ,Carousel,WhiteSpace,ListView,List,Button} from 'antd-mobile'
import addImg from '@/static/imgs/add-circle.png'
import { Link,history } from 'umi'
function Address(props){
  const {address,dispatch} = props
  useEffect(() => {
    (async ()=>{
      console.log('address loaded')
      await dispatch({
        type:'address/getListForPage',
        payload:queryForm
      })
    })()
  },[])

  //定义条件查询对象
  const [queryForm,setQueryForm] = useState({
    pno:1,
    psize:15,
  })
  //定义设置条件查询对象的函数
  const handleSetQueryForm = (key,value) => {
    queryForm[key] = value;
    setQueryForm({...queryForm})
  }



  const handleAdd = () => {
    props.history.push('/address-add')
  }
  const [dataSource,setDataSource] = useState(
    new ListView.DataSource({
      // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  )
  useEffect(() => {
    console.log(address.list)
    setDataSource(dataSource.cloneWithRows(address.list))
  },[address.list])
  // 定义每行的对象
  const Row = (rowData, sectionID, rowID) => {
    const handleDelete = async (id) => {
      console.log(id)
      await dispatch({
        type:'address/deleteById',
        payload:id
      })
      handleSetQueryForm('pno',1)
      await dispatch({
        type:'address/getListForPage',
        payload:queryForm
      })
    }

    const handleSetDefault =async (id) => {
      await dispatch({
        type:'address/setDefault',
        payload:id
      })
      handleSetQueryForm('pno',1)
      await dispatch({
        type:'address/getListForPage',
        payload:queryForm
      })
    }
    // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
    return (
      <List.Item
        key={rowID}
        multipleLine
        >
        {
          rowData.default == 1?<div>默认地址</div>:''
        }
        地区:{rowData.province}/{rowData.city}/{rowData.area}<br/>
        详细地址:{rowData.address}
        <List.Item.Brief>
          <div style={{textAlign:'right'}}>
          {
            rowData.default == 0?
            <Button size="small" inline onClick={handleSetDefault.bind(this,rowData.id)} type="primary" >设置默认</Button>:''
          }
          <Link to={'/address-edit?id='+rowData.id}>
            <Button size="small" inline  type="deafult">修改</Button>
          </Link>

          <Button size="small" onClick={ handleDelete.bind(this,rowData.id)} inline  type="warning">删除</Button>
          </div>
        </List.Item.Brief>
      </List.Item>

    )
  }
  const [loading,setLoading] = useState(false)

  // 当页面距离底部达到定义的距离时会触发
  const onEndReached = async () => {
    if(loading||address.page.pno>=address.page.pCount){
      return
    }
    setLoading(true)
    console.log('到达分页点')
    handleSetQueryForm('pno',queryForm.pno+1)
    await dispatch({
      type:'address/getListForPageMore',
      payload:queryForm
    })
    setLoading(false)
  }

  return (
    <div className="address-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
        rightContent={
          <img src={addImg}
            style={{width:'20px'}}
            onClick={handleAdd}/>
        }
      >收货地址</NavBar>
      <ListView
        dataSource={dataSource}
        renderRow={Row}
        renderFooter={() => (
          <div className="footer" style={{textAlign:'center'}}>
           { loading?'加载中':'没有更多数据了'}
          </div>
        )}
        useBodyScroll
        initialListSize={address.page.psize}
        onEndReachedThreshold={20}
        onEndReached={onEndReached}
        pageSize={address.page.psize}>
      </ListView>

    </div>
  )
}
export default connect(({address}) => {
  return {address}
})(Address)
