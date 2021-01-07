import React,{useState,useEffect} from 'react'
import { connect } from 'dva';
import { NavBar,Icon,Tag } from 'antd-mobile'
import './news-info.less'
function NewsInfo(props){
  const {news,dispatch} = props;
  
  useEffect(() => {
    (async () => {
      let id = props.history.location.query.id
      await dispatch({
        type:'news/findById',
        payload:id
      })
    })()
  },[])
  
  
  const formatTime = () => {
    let time = new Date(news.formData.insertTime)
    return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} `
  }
  return (
    <div className="news-info-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.push('/news')}
      >新闻详情</NavBar>
      <div className="title">
        {news.formData.name}
      </div>
      <div className="info">
        作者:{news.formData.author} | 日期:{formatTime()}
      </div>
      <div className="description">
        摘要:{news.formData.description}
      </div>
      <div className="content">
        <div dangerouslySetInnerHTML={{__html: news.formData.content}}></div>
      </div>
    </div>
  )
}
export default connect(({news}) => {
  return {news}
})(NewsInfo)
