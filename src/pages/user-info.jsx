import  React,{useState,useEffect} from 'react'
import PTabBar from '@/components/p-tabbar.jsx'
import { Icon ,NavBar ,List ,InputItem ,DatePicker,Picker,ImagePicker,Modal,Toast,Button} from 'antd-mobile'
import { connect } from 'dva'
import http from '@/http'
import './me.less'
function UserInfo(props){
  //获取dva中的me对象和dispatch对象
  const {me,dispatch} = props
  //定义本页的表单对象用来绑定表单组件
  const [formData,setFormData] = useState({})

  //声明存放文件的数组
  const [files,setFiles] = useState([])

  //定义快捷设置formData中key的函数
  const handleSetFormData = (key,value) => {
    formData[key] = value;
    setFormData({...formData})
  }
  // me加载函数
  useEffect(() => {
    (async () => {
      await dispatch({type:'me/getUserInfo'})
    })()
    console.log('me loaded')
  },[])

  //监听me.userInfo
  useEffect(() => {
    //这里由于state中的数据是不可直接更改的所以我们监听userInfo并且将他的值设置到
    //我们在本页定义的formData中
    //这里由于后台返回的生日是数字格式我们需要把它处理成日期
    let formData = { ...me.userInfo }
    formData.birthday = new Date(formData.birthday)
    //这里处理头像，将默认头像放入files
    if(formData.face&&formData.face!= ''){
      setFiles([{
        url:formData.face
      }])
    }
    setFormData(formData)
  },[me.userInfo])
  //处理昵称
  const handleNickNameChange = (v) =>{
    handleSetFormData('nickname',v)
  }
  //处理生日
  const handleBirthdayChange = (v) => {
    handleSetFormData('birthday',v)
  }
  // 处理性别
  const handleSexChange = (v) => {
    console.log(v)
    handleSetFormData('sex',v[0])
  }
  //当选择完文件之后
  const handleFaceChange = (v,operationType) =>{
    //如果执行的是增加文件
    if(operationType == 'add'){
      //我们就创造一个上传文件的对象，将文件上传的参数添加进去
      let f = new FormData();
      f.append('file',v[0].file)
      f.append('folder','face')
      //调用上传接口，这里采用直接使用http对象的方式
      http({
        url:'/file/upload',
        data:f,
        method:'post',
        headers:{
          'Content-Type':'multiple/form-data'
        }
      }).then(res => {
        if(res.data.code == 200){
          //上传成功时将头像路径设置到face中
          handleSetFormData('face',res.data.data.url)
          //将文件放入files数组中
          setFiles([{
            url:res.data.data.url
          }])
        }
      })
    }else{
      //如果是删除操作就弹出询问框
      let alert = Modal.alert('提示','正在删除当前头像',[
        {
          text:'确认',
          onPress(){
            //如果确认删除，先调用接口删除服务器上的文件
            http({
              url:'/file/delete',
              method:'get',
              params:{
                path:formData.face
              }
            }).then(res => {
              //删除成功后将files设置为空
              setFiles([])
              //将头像内容设置为空
              handleSetFormData('face','')
              alert.close()
            })
          }
        },{
          text:'取消',
          onPress(){
            alert.close()
          }
        }
      ])

    }

  }
  // 当点击加号时触发的事件
  const handleFaceAdd = (event) => {
    if(files.length == 1){
      Toast.fail('只能上传一张图片',1)
      event.preventDefault()

    }
  }
  const handleSubmit = () => {
    if(formData.nickname==''){
      Toast.fail('昵称不可以为空',1)
      return;
    }
    if(formData.birthday==undefined||!(formData.birthday instanceof Date)){
      Toast.fail('请选择生日',1)
      return;
    }
    if(formData.face==''){
      Toast.fail('请上传头像',1)
      return;
    }
    if(formData.sex==''){
      Toast.fail('请选择性别',1)
      return;
    }
    console.log(formData)
    dispatch({
      type:'me/update',
      payload:formData
    })
  }
  return (
    <div className="me-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
      >个人信息</NavBar>
      <List>
        <List.Item extra={formData.username}>
          账号
        </List.Item>
        <List.Item extra={formData.phone}>
          手机号
        </List.Item>
        <InputItem value={formData.nickname} onChange={handleNickNameChange} style={{textAlign:'right'}} clear>
          昵称
        </InputItem>
        <DatePicker
          mode="date"
          minDate={new Date('1980-01-01')}
          value={formData.birthday}
          onChange={handleBirthdayChange}>
          <List.Item>生日</List.Item>
        </DatePicker>
        <Picker
          cols={1}
          value={[formData.sex]}
          data={[
            {label:'男',value:'1'},
            {label:'女',value:'2'}
          ]}
          onChange={handleSexChange}
          >
          <List.Item>
            性别
          </List.Item>
        </Picker>
        <div className="face-form">
          <div className="label">头像</div>
          <div className="face-picker">
            <ImagePicker
              files={files}
              onChange={handleFaceChange}
              onAddImageClick={handleFaceAdd}
              selectable
              length={2}
              >
            </ImagePicker>
          </div>
        </div>
        <Button  type="primary" onClick={handleSubmit}>提交</Button>
      </List>
    </div>
  )
}
export default connect(({me}) => {
  return {me}
})(UserInfo);
