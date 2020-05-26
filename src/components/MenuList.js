import React from 'react'
import { connect } from 'dva'
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { menuText } from './menuText'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import styles from './MenuList.less'

const { SubMenu } = Menu;

class MenuList extends React.Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  renderMenu = data => {
    console.log(menuText);
    return data.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.path}>
            <PieChartOutlined />
            <Link className={styles.white}
              to={item.path} >
              {item.title}
            </Link>
          </Menu.Item>
        )
      }
      else {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                <AppstoreOutlined />
                <span> {item.title}</span>
              </span>
            }
          >
           {this.renderMenu(item.children)}
          </SubMenu>
        )
      }
    })
  };
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
          {this.renderMenu(menuText)}

        </Menu>
      </div>
    );
  }
}

export default connect()(MenuList)