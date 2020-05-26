import React  from 'react'
import { connect } from 'dva'
import { Form, Input, Button,message } from 'antd';


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class Login extends React.Component {
  formRef = React.createRef();
  onFinish = values => {
    console.log(values);
    message.info('登录成功');
    console.log(this.props);
    this.props.history.push('/')
  };
  onReset = () => {
    this.formRef.current.resetFields();
  };
  checkUser = (rule, value, callback) => {
     if(!value && value!==0){
      return Promise.reject('不能为空');
     }
	   if(value.length>5){
      return Promise.reject('不能大于5');
     }
	   else{
      return Promise.resolve();
     }
	
  };
  checkConfirmPass = (rule, value, callback) => {
    let newPass=this.formRef.current.getFieldValue('pass');
    console.log(this.formRef.current.getFieldValue('pass'))
    if(!value && value!==0){
     return Promise.reject('密码不能为空');
    }
    if(value!==newPass){
     return Promise.reject('必须等于输入的密码');
    }
    else{
     return Promise.resolve();
    }
 
 };
  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <Form.Item
          name="userName"
          label="用户名"
          rules={[
            { required: true, validator: this.checkUser, trigger: 'blur' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="pass"
          label="密码"
          rules={[
            {
              required: true,message: '请输入密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPass"
          label="确认密码"
          rules={[
            { required: true, validator: this.checkConfirmPass, trigger: 'blur' }
          ]}
        >
          <Input />
        </Form.Item>
     
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
        
        </Form.Item>
      </Form>
    );
  }
}


export default connect()(Login)
