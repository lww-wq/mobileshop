import React,{useState,useEffect} from 'react';
import styles from './index.less';
import PTabBar from '@/components/p-tabbar.jsx'
import { NavBar,Icon ,Popover,Carousel,Grid,List} from 'antd-mobile'
import lb1 from '@/static/imgs/lb1.jpg'
import lb2 from '@/static/imgs/lb2.jpg'
import lb3 from '@/static/imgs/lb3.jpg'
import { Link } from 'umi'
import { history } from 'umi'
import { connect } from 'dva'
const RenderIcon = (props) => {
  const [show,setShow] = useState(false)

  const handleVisiableChange = (v) => {
    setShow(v)
  }
  const handleSelect = (v) =>{
    setShow(false)
    history.push('/me')
  }
  return (
    <Popover
      visible={show}
      overlay={[
        <Popover.Item
          icon={<Icon type="check-circle-o"></Icon>}>
          我的
        </Popover.Item>
      ]}
      onVisibleChange={handleVisiableChange}
      onSelect={handleSelect}
      >
      <Icon type="ellipsis" size="xs"></Icon>
    </Popover>
  )
}

function Index (props) {
  const {shop,dispatch} = props

  const [items,setItems] = useState([
    {
      text:'商城',
      icon:lb1,
      path:'/shop'
    },
    {
      text:'新闻',
      icon:lb2,
      path:'/news'
    },
    {
      text:'我的',
      icon:lb3,
      path:'/me'
    }
  ])
  // index加载函数
  useEffect(() => {
    console.log('index loaded')
    dispatch({
      type:'shop/getListForPage',
      payload:{pno:1,psize:10}
    })
  },[])
  return (
    <div style={{paddingBottom:'45px'}}>

      <NavBar mode="light"
      rightContent={
        <RenderIcon ></RenderIcon>
      }>首页</NavBar>
      <Carousel
        autoplay={true}
        infinite>
        <img src={lb1} style={{height:'200px',objectFit:'cover'}}/>
        <img src={lb2} style={{height:'200px',objectFit:'cover'}}/>
        <img src={lb3} style={{height:'200px',objectFit:'cover'}}/>
      </Carousel>
      <Grid
        data={items}
        renderItem={dataItem => (
          <Link to={dataItem.path}>
            <div style={{ padding: '5px' }}>
              <img src={dataItem.icon} style={{ width: '65px', height: '65px',borderRadius:'50%' }} alt="" />
              <div style={{ color: '#888', fontSize: '14px', marginTop: '12px' }}>
                <span>{dataItem.text}</span>
              </div>
            </div>
          </Link>
        )}
        columnNum={3} />
      <List>
        {
          shop.list.map(item => {
            return (
              <Link to={'/shop-info?id='+item.id} key={item.id}>
                <List.Item
                  arrow="horizontal"
                  thumb={
                    <img src={item.logo} style={{width:'40px',height:'40px'}}/>
                  }
                  >
                  {item.name}
                  <List.Item.Brief>
                    {item.description}
                  </List.Item.Brief>

                </List.Item>
              </Link>

            )
          })
        }
      </List>
      <PTabBar></PTabBar>
    </div>
  );
}
export default connect(({shop}) => {
  return {shop}
})(Index)
