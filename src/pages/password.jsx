import  React,{useState,useEffect} from 'react'
import { NavBar,Icon,List,InputItem,Button,WhiteSpace,Toast } from 'antd-mobile'
import './password.less'
import { getCode,changePass } from '@/api/user-api.js'

function Password(props){
  const [codeBtnText,setCodeBtnText] = useState('验证码')
  const [codeDisabled,setCodeDisabled] = useState(false)
  const [phone,setPhone] = useState('')
  const [password,setPassword] = useState('')
  const [code,setCode] = useState('')
  const [loading,setLoading] = useState(false)


  useEffect(()=>{
    let userInfo = JSON.parse(sessionStorage.userInfo)
    setPhone(userInfo.phone)
  },[])

  const handlePasswordChange = (v) => {
    setPassword(v)
  }
  const handleCodeChange = (v) => {
    setCode(v)
  }


  const handleSubmit = async () => {
    let phoneRegx = /^1[3456789]\d{9}$/
    if(phone.trim().length == 0){
      Toast.fail('请输入手机号码',2)
      return
    }
    if(!phoneRegx.test(phone)){
      Toast.fail('手机号码格式不正确',2)
      return
    }

    if(password.trim().length == 0){
      Toast.fail('请输入密码',2)
      return
    }
    if(code.trim().length == 0){
      Toast.fail('请输入验证码',2)
      return
    }
    let res = await changePass({
      phone,
      code,
      password
    })
    if(res.data.code == 200){
      Toast.success('修改成功,请重新登录',1)
      sessionStorage.clear()
      props.history.push('/login')
    }
  }

  const handleSendCode = async () => {
    let phoneRegx = /^1[3456789]\d{9}$/
    //校验手机号码
    if(phone.trim().length == 0){
      Toast.fail('请输入手机号码',2)
      return
    }
    if(!phoneRegx.test(phone)){
      Toast.fail('手机号码格式不正确',2)
      return
    }

    //调用发送短信接口
    let res = await getCode()
    if(res.data.code == 200){
      Toast.success('您的验证码是'+res.data.data.code,4)
      //发送成功后执行倒计时
      runInterval();
    }

  }
  //执行倒计时逻辑
  const runInterval = () => {
    //设置按钮不可点击
    setCodeDisabled(true);
    // 设置倒计时60秒
    let seconds = 60
    // 设置按钮文字为倒计时内容
    setCodeBtnText(seconds+'')
    let res = setInterval(() => {
      // 如果没到时间就继续查秒并更新视图
      if(seconds>1){
        seconds--;
        setCodeBtnText(seconds+'')
        // 到时间就把按钮改成重新发送，并让按钮可用并停止定时器
      }else{
        setCodeBtnText('重新发送')
        setCodeDisabled(false);
        clearInterval(res)
      }
    },1000)
  }
  return (
    <div>
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => props.history.go(-1)}
      >修改密码</NavBar>
      <List>
        <List.Item  extra={phone} >
          手机号
        </List.Item >
        <InputItem type="password" value={password} onChange={handlePasswordChange}  placeholder="请输入账号" clear>
          密码
        </InputItem>
        <InputItem
          className="p-code"
          value={code}
          onChange={handleCodeChange}
          extra={
            <Button size="small"
              type="primary"
              disabled={codeDisabled}
              onClick={handleSendCode}
              inline
              >{codeBtnText}</Button>
          }
          placeholder="请输入验证码"
          clear>
          验证码
        </InputItem>
      </List>
      <WhiteSpace size="md"></WhiteSpace>
      <Button type="primary" loading={loading} onClick={handleSubmit}>提交</Button>
    </div>

  )
}
export default Password;
