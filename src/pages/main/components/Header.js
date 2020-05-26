import React from 'react'
import { connect } from 'dva'

import { Layout, Menu, Dropdown, Button, Avatar } from 'antd';
import { DownOutlined } from '@ant-design/icons';


const { Header } = Layout
class HeaderCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount () {
    console.log(this.props.userInfo)
    // this.props.dispatch({ type: 'workOrder/getTodoList', payload: values })
  }
  update = () => {
    this.props.dispatch({ type: 'user/getUserInfo', payload: { userInfo: { name: "小孩", age: 12 } } })
  }
  render () {
    console.log(this.props)
    const { userInfo } = this.props;  //在这可用'this.props'读取
    console.log(userInfo)
    const menu = (
      <Menu>
        <Menu.Item>
          <Button>
            退出
        </Button>
          <Button onClick={this.update}>
            修改
        </Button>
        </Menu.Item>


      </Menu>
    );
    return (
      <Header>
        <div className="fr">
          <Dropdown overlay={menu}>
            <div>
              <Avatar src={userInfo.avater} />
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {userInfo.name} <DownOutlined />
              </a>
            </div>
          </Dropdown>
        </div>
      </Header>
    );
  }
}
export default connect(({ user, example, loading }) => {
  return {
    userInfo: user.userInfo,
    exampleList: example.exampleList
  }
})(HeaderCom)

