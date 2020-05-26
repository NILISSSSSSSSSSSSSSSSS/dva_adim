import { connect } from 'dva'
import React from 'react';
import { Modal, Button, Table, message, Popconfirm } from 'antd';
import apiList from '../../../request/api'
import styles from '../style.less'
import EditFinance from './EditFinance';

class InvestmentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      edietData: {
        title: "编辑",
        isEdiet: true,
        visible: false,
        content: {}
      },
    };
  }
  componentDidMount () {

  };

  componentWillReceiveProps (nextProps, nextContext) {

  }
  close = (val) => {
    this.props.getInvestMsg({ isFresh: val, isClose: true })
  }
  //获取子组件传来的值
  getChildrenMsg = (obj) => {
    let newData = Object.assign({}, this.state.edietData, { visible: false })
    this.setState({
      edietData: newData
    })
    if (obj.isFresh) {
      console.log(this.parent)
      this.props.getInvestMsg({ isFresh: true, isClose: false })
    }
  };
  edietgonsFun2 = (type, row) => {
    row.investment_project_id = this.props.invest.investment_project_id
    let newdata = {
      title: !!type ? "编辑" : "新增",
      visible: true,
      isEdiet: !!type ? true : false,
      content: row,
    }
    this.setState({
      edietData: newdata
    })
  };
  del = row => {
    apiList.deleteFinanceInfo({ id: row.id }).then(data => {
      this.props.getInvestMsg({ isFresh: true, isClose: false })
      message.success('成功');
    }).catch(err => {
      message.error(err.message);
    })
  }
  render () {
    const { visible, data } = this.props.invest;
    const { loading } = this.state;
    const columns = [
      {
        title: '融资时间',
        key: 'invested_at',
        dataIndex: 'invested_at',
      },
      {
        title: '轮次',
        key: 'round',
        dataIndex: 'round',
      },
      {
        title: '融资金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '投资方',
        dataIndex: 'investors',
        key: 'investors',
        render: (value, row, index) => {
          let userMessage
          if (value && value.length !== 0) {
            userMessage = (
              value.map((item, ccindex) => {
                return item
              })
            )
          }
          else {
            userMessage = '--'
          }
          return (
            <div>
              {
                userMessage
              }
            </div>
          )
        },
      },
      {
        title: '收录时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },

      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, row, index) => {
          return (
            <div>
              <Button
                type="primary" onClick={() => this.edietgonsFun2(1, row)}>
                编辑
            </Button>
              <Popconfirm placement="topLeft" title='删除' onConfirm={() => this.del(row)} okText="Yes" cancelText="No">
                <Button danger >删除</Button>
              </Popconfirm>

            </div>
          )
        }
      }
    ]
    return (
      <div>
        <Modal
          title='投融资信息'
          visible={visible}
          onCancel={(() => { this.close(false) })}
          confirmLoading={loading}
          okText="确认"
          cancelText="取消"
          width="1100px"
          className={styles.dialogo}
        >
          <Button className="add" onClick={() => this.edietgonsFun2(0, {})}>
            新增信息
              </Button>
          <div className="mt10">
            <Table
              bordered
              columns={columns}
              dataSource={data}
              className={styles.vipTable}
              loading={loading}
              scroll={{ x: 1000, }}
              rowKey={(record, index) => index}
            />
          </div>
          {/* 编辑弹框 */}
          <EditFinance getChildrenMsg={this.getChildrenMsg} edietData={this.state.edietData} />
        </Modal>
      </div>
    );
  }
}
export default connect()(InvestmentInfo)
