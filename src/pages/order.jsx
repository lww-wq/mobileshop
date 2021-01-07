import React,{useState,useEffect} from 'react'
import { connect } from 'dva'
import { NavBar ,Icon ,List,InputItem,Toast,Modal} from 'antd-mobile'
import {Link} from 'umi'
import './order.less'
function Order(props){
  const {order,shop,address,dispatch} = props
  //定义本页的表单对象用来绑定表单组件
  const [formData,setFormData] = useState({
    num:1,
    address:'',
    totalPrice:0
  })
  //定义快捷设置formData中key的函数
  const handleSetFormData = (key,value) => {
    formData[key] = value;
    setFormData({...formData})
  }
  const handelNumChange = (v) => {
    console.log(v)
    handleSetFormData('num',v)
  }
  useEffect(() => {
    (async ()=>{
      console.log('order loaded')
      let id = props.history.location.query.id;
      await dispatch({
        type:'shop/findById',
        payload:id
      })
      await dispatch({
        type:'address/getListForPage',
        payload:{
          pno:1,
          psize:1
        }
      })
    })()
  },[])

  useEffect(()=>{
    let list = address.list;
    if(list.length == 0){
      handleSetFormData('address','')
    }else if(list[0].default == 0){
      handleSetFormData('address','')
    }else{
      handleSetFormData('address',
        list[0].province+'/'+list[0].city+'/'+
        list[0].area+'/'+list[0].address)
    }
  },[address.list])

  useEffect(() => {
    handleSetFormData('totalPrice',Math.round(shop.formData.price*shop.formData.zheKou/10*formData.num*100)/100)
  },[formData.num])
  useEffect(() => {
    handleSetFormData('name',shop.formData.name)
    handleSetFormData('goodsId',shop.formData.id)
    handleSetFormData('singlePrice',Math.round((shop.formData.price*shop.formData.zheKou/10)*100)/100)
    handleSetFormData('singlePriceOld',shop.formData.price)
    handleSetFormData('zheKou',shop.formData.zheKou)
  },[shop.formData])
  const handleBuy = () => {
    if(formData.num == 0||formData.num==undefined){
      Toast.fail('请选择商品数量',1)
      return;
    }
    if(formData.address == ''){
      Toast.fail('请设置收货地址',1)
      return;
    }
    Modal.prompt(
      'Password',
      '请输入密码',
      password => {
        handleSetFormData('password',password)
        console.log(formData)
        dispatch({
          type:'order/insert',
          payload:formData
        })
      },
      'secure-text',
      '',
      '请输入密码'
    )
  }

  return (
    <div className="order-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
      >下单</NavBar>
      <List>
        <List.Item extra={formData.name}>
          商品名称
        </List.Item>
        <List.Item extra={formData.singlePriceOld}>
          商品原价
        </List.Item>
        <List.Item extra={formData.zheKou!=10?(formData.zheKou+'折'):'无'}>
          商品折扣
        </List.Item>
        <List.Item extra={formData.singlePrice}>
          商品价格
        </List.Item>
        <InputItem type="number"
          style={{textAlign:'right'}}
          placeholder="请输入购买数量"
          clear value={formData.num}
          onChange={handelNumChange}
           >
          购买数量
        </InputItem>
        {
          formData.address!= ''?
          (
            <Link to="/address">
              <List.Item
                extra={
                  formData.address
                }
                wrap
                >
                收货地址
              </List.Item>
            </Link>
          ):
          (
            <Link to="/address">
              <List.Item
                extra="点击设置"
                arrow="horizontal"
                >
                收货地址
              </List.Item>
            </Link>
          )
        }
      </List>
      <div class="tool-bar">
        <div className="sale">
          总价格:
            <span className="price-now">
              {formData.totalPrice}
            </span>
        </div>
        <div className="buy" onClick={handleBuy}>
          确认订单
        </div>
      </div>
    </div>
  )
}
export default connect(({order,shop,address}) => {
  return {order,shop,address}
})(Order)
