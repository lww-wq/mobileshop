import React,{useState,useEffect} from 'react'
import { connect } from 'dva'
import { NavBar ,Icon ,WhiteSpace,List,Picker,TextareaItem,Button,Toast} from 'antd-mobile'
import {position} from '@/data/position.js'
function AddressEdit(props){
  const {address,me,dispatch} = props
  useEffect(() => {
    (async ()=>{
      console.log('address loaded')
      let id = props.history.location.query.id
      await dispatch({
        type:'me/getUserInfo'
      })
      await dispatch({
        type:'address/findById',
        payload:id
      })
    })()
  },[])

  useEffect(() => {
    console.log(address.formData)
    setPickerValue([address.formData.provinceId,
      address.formData.cityId,address.formData.areaId])
    setFormData(address.formData)
  },[address.formData])
  //定义本页的表单对象用来绑定表单组件
  const [formData,setFormData] = useState({})
  const [pickerValue,setPickerValue] = useState([])
  //定义快捷设置formData中key的函数
  const handleSetFormData = (key,value) => {
    formData[key] = value;
    setFormData({...formData})
  }
  // picker发生变化时触发
  const handlePickerChange = (value) => {
    //设置picker的值
    setPickerValue(value)
    //设置省市区的编码
    handleSetFormData('provinceId',value[0])
    handleSetFormData('cityId',value[1])
    handleSetFormData('areaId',value[2])
  }
  const handleAddressChange = v => {
    handleSetFormData('address',v)
  }


  const  handleSubmit = () => {
    if(formData.provinceId == undefined||formData.provinceId ==''){
      Toast.fail('请选择地区',1)
      return;
    }
    if(formData.cityId == undefined||formData.cityId ==''){
      Toast.fail('请选择地区',1)
      return;
    }
    if(formData.areaId == undefined||formData.areaId ==''){
      Toast.fail('请选择地区',1)
      return;
    }
    if(formData.address == undefined||formData.address ==''){
      Toast.fail('请输入详细地址',1)
      return;
    }
    dispatch({
      type:'address/update',
      payload:formData
    })
  }

  return (
    <div className="address-page">
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
      >编辑收货地址</NavBar>
      <List>
        <List.Item
          extra={me.userInfo.nickname}>
          姓名
        </List.Item>
        <List.Item
          extra={me.userInfo.phone}>
          电话
        </List.Item>
      </List>
      <Picker
        data={position}
        cols={3}
        value={pickerValue}
        onChange={handlePickerChange}>
        <List.Item
          extra={me.userInfo.nickname}>
          地区
        </List.Item>
      </Picker>
      <TextareaItem
        title="详细地址"
        value={formData.address}
        rows={2}
        onChange={handleAddressChange}
        placeholder="请输入详细地址"
        count={100}
        >
      </TextareaItem>
      <Button type="primary" onClick={handleSubmit}>提交</Button>
    </div>
  )
}
export default connect(({address,me}) => {
  return {address,me}
})(AddressEdit)
