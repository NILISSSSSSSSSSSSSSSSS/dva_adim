import React from 'react'
import { connect } from 'dva'
import MenuList from '../../components/MenuList';
import { Layout } from 'antd';
import MainContent from './components/MainContent';
import Header from './components/Header';
// import Test  from '../../components/Test';

// import { Route, Switch } from 'react-router-dom';
// import vipList from '../vipList/index';
const { Footer, Sider, Content } = Layout;
class main extends React.Component {
  render () {
    return (
      <Layout style={{
        height: '100vh',
      }}>
        <Sider> <MenuList /></Sider>
        <Layout>
          <Header />
          <Content>
            <MainContent />
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout >


    );
  }
}


export default connect()(main)

