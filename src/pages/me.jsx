import  React,{useState,useEffect} from 'react'
import PTabBar from '@/components/p-tabbar.jsx'
import { NavBar,Tag ,List,Modal} from 'antd-mobile'
import { connect } from 'dva'
import noImg from '@/static/imgs/no-img.png'
import {Link} from 'umi'
import './me.less'
function Me(props){
  //获取dva中的me对象和dispatch对象
  const {me,dispatch} = props

  // me加载函数
  useEffect(() => {
    (async () => {
      await dispatch({type:'me/getUserInfo'})
    })()
    console.log('me loaded')
  },[])

  //监听me.userInfo
  useEffect(() => {
    console.log(me.userInfo)
  },[me.userInfo])
  const handleLogout = () => {
    let alert = Modal.alert('提示','正在退出登录',[
      {
        text:'确认',
        onPress(){
          sessionStorage.clear()
          alert.close()
          props.history.push('/login')
        }
      },
      {
        text:'取消',
        onPress(){
          alert.close()
        }
      }
    ])
  }
  return (
    <div className="me-page">
      <NavBar mode="light">我的</NavBar>
      <div className="user-info">
        <div className="right-btn">
          <span onClick={handleLogout}>退出登录</span>
        </div>
        <div className="user-title">
          <img className="user-icon"
            src={me.userInfo.face}
            onError={
              event => {
                event.target.src = noImg
              }
            }/>
          {me.userInfo.nickname}
        </div>
      </div>
      <List>
        <Link to="/user-info">
          <List.Item arrow="horizontal">
            个人信息
          </List.Item>
        </Link>
        <Link to="/my-like">
          <List.Item arrow="horizontal">
            我的收藏
          </List.Item>
        </Link>
        <Link to="/buy-info">
          <List.Item arrow="horizontal">
            已买到的商品
          </List.Item>
        </Link>
        <Link to="/address">
          <List.Item arrow="horizontal">
            收货地址
          </List.Item>
        </Link>
        <Link to="/password">
          <List.Item arrow="horizontal">
            修改密码
          </List.Item>
        </Link>

      </List>

      <PTabBar path="/me"></PTabBar>


    </div>
  )
}
export default connect(({me}) => {
  return {me}
})(Me);
