import React,{useState,useEffect} from 'react'
import { connect } from 'dva'
import { NavBar ,Icon ,Carousel,WhiteSpace} from 'antd-mobile'
import './shop-info.less'
function ShopInfo(props){
  const {shop,dispatch} = props
  useEffect(() => {
    (async ()=>{
      console.log('shop-info loaded')
      let id = props.history.location.query.id
      await dispatch({
        type:'shop/findById',
        payload:id
      })
    })()
  },[])
  useEffect(() => {
    console.log(shop.formData)
  },[shop.formData])
  //调用收藏接口，这里由于没有涉及到同步处理的地方所以不需要使用async
  const handleAddLike = () => {
    console.log(shop.formData.id)
    dispatch({
      type:'shop/addLike',
      payload:shop.formData.id
    })
  }
  const handleBuy = () => {
    props.history.push({pathname:'/order',query:{id:shop.formData.id}})
  }
  return (
    <div className="shop-info-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
      >商品详情</NavBar>
      <Carousel
        autoplay={true}
        style={{height:'200px'}}
        infinite>
        {
          shop.formData.pics?
          shop.formData.pics.map(item => {
            return (
              <img
                key={item}
                src={item}
                style={{
                   objectFit:'cover',
                   height:'200px',
                   backgroundColor:'#ddd'
                }}
              />
            )
          })
          :''
        }
      </Carousel>
      <WhiteSpace size="md"></WhiteSpace>
      <div className="goods-info">
        <div className="title">
          商品名称:{shop.formData.name}
        </div>
        <div className="description">
          商品描述:{shop.formData.description}
        </div>
        <div className="description">
          库存:{shop.formData.count}
        </div>
        <div className="sale">
          价格:
            <span className="price-now">
              {shop.formData.price*shop.formData.zheKou/10}
            </span>/
            <span className="price-old">
              {shop.formData.price}
            </span>
        </div>
      </div>
      <WhiteSpace size="md"></WhiteSpace>
      {
        shop.formData.pics?
        shop.formData.pics.map(item => {
          return (
            <img
              key={item}
              src={item}
              style={{
                 objectFit:'cover',
                 width:'100%',
                 height:'200px',
                 backgroundColor:'#ddd'
              }}
            />
          )
        })
        :''
      }
      <div class="tool-bar">
        <div className="sale">
          价格:
            <span className="price-now">
              {shop.formData.price*shop.formData.zheKou/10}
            </span>/
            <span className="price-old">
              {shop.formData.price}
            </span>
        </div>
        <div className="like" onClick={handleAddLike}>
          收藏
        </div>
        <div className="buy" onClick={handleBuy}>
          立即购买
        </div>
      </div>
    </div>
  )
}
export default connect(({shop}) => {
  return {shop}
})(ShopInfo)
