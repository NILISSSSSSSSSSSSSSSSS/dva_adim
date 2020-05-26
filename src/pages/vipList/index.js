import { connect } from 'dva'
import moment from 'moment';
import React from 'react';
import { Form, Input, Button, Select, Table, Tag, Switch, Popconfirm, DatePicker } from 'antd';
import styles from './vipList.less'
import EdietVip from './components/EdietVip';
import apiList from '../../request/api'

const { Option } = Select;
class vipList extends React.Component {
  formRef = React.createRef();
  state = {
    data: [{
      "id": 766797,
      "img": "http://192.168.0.12:8888/api_static/quick/fe5e60638c33453ba01379ec690e84e7.jpg",
      "labels": ["航天航空", '火箭'],
      "title": "\u4e3a\u4ec0\u4e48\u6362\u53d1\u8fd8\u4e0d\u5982\u91cd\u65b0\u8bbe\u8ba1\u4e00\u67b6\u65b0\u673a\u6765\u7684\u75db\u5feb\uff1f",
      "regional": "\u5168\u7403",
      "source": "",
      "total_views": 10,
      "time": "2020-04-17 16:15:49",
      "switch_hot": "true"
    }, {
      "id": 766795,
      "img": "http://192.168.0.12:8888/api_static/quick/fe5e60638c33453ba01379ec690e84e7.jpg",
      "labels": ["轮船", '火箭'],
      "title": "\u5178\u578b\u822a\u7a7a\u7528\u949b\u5408\u91d1\u6027\u80fd\u5bf9\u6bd4",
      "regional": "\u4e2d\u56fd",
      "source": "",
      "total_views": 32,
      "time": "2020-04-13 10:27:31",
      "switch_hot": "true"
    }, {
      "id": 766794,
      "img": "http://192.168.0.12:8888/api_static/quick/fe5e60638c33453ba01379ec690e84e7.jpg",
      "labels": ["大炮", '火箭'],
      "title": "\u5178\u578b\u822a\u7a7a\u7528\u94dd\u5408\u91d1\u6027\u80fd\u5bf9\u6bd4",
      "regional": "\u4e2d\u56fd",
      "source": "",
      "total_views": 151,
      "time": "2020-03-31 10:16:49",
      "switch_hot": "false"
    },],
    copyData: [],
    ediet: false,
    pagination: {
      pageSize: 10,
      current: 1
    },
    //编辑2相关
    edietData: {
      title: "编辑",
      isEdiet: true,
      visible: false,
      content: {}
    }
  };
  onChangeRobotAutoSend = value => {
    console.log(value)
  };
  // 编辑方式1
  fileChange = (e, index, type) => {
    let newData = [...this.state.data];

    if (['total_views'].includes(type)) {
      newData[index][type] = e.target.value;
    }
    if (type === 'time') {
      newData[index][type] = e ? moment(e).format("YYYY-MM-DD HH:mm").valueOf() : null;
    }
    else if (['regional'].includes(type)) {
      newData[index][type] = e;
    }
    this.setState({
      data: newData
    })
    console.log(this.state.data)
  };
  edietFun = index => {
    let newData = [...this.state.data];
    newData[index].ediet = true;
    this.setState({
      data: newData
    })
  }
  edietSure = index => {
    let newData = [...this.state.data];
    newData[index].ediet = false;
    this.setState({
      data: newData,
      copyData: JSON.parse(JSON.stringify(newData))
    })
    console.log(this.state.data);
  };
  cancelEdiet = index => {
    console.log(this.state.copyData)
    this.setState({
      data: JSON.parse(JSON.stringify(this.state.copyData)),
    })
  };
  // 编辑方式2
  edietFun2 = (index, type) => {
    let newdata = {
      title: !!type ? "编辑" : "新增",
      visible: true,
      isEdiet: !!type ? true : false,
      content: !!type ? JSON.parse(JSON.stringify(this.state.data[index])) : {}
    }
    this.setState({
      edietData: newdata
    })
  };
  //获取子组件传来的值
  getChildrenMsg = () => {
    let newData = { ...this.state.edietData };
    newData.visible = false;
    this.setState({
      edietData: newData
    })
  };
  del = index => {
    let newData = [...this.state.data];
    newData.splice(index, 1);
    this.setState({
      data: newData,
      copyData: JSON.parse(JSON.stringify(newData))
    })
  };
  componentDidMount () {
    apiList.infoBanner().then(res => {
      console.log(res)
    })
  };
  render () {
    const onFinish = () => {

    };

    const columns = [
      {
        title: '资讯轮播开关', dataIndex: 'switch_hot', render: (text, record, index) => {
          return <Switch defaultChecked={text === 'true' ? true : false} onChange={this.onChangeRobotAutoSend} />
        },
      },
      {
        title: '标签', dataIndex: 'labels', render: (text, record, index) => {
          return <div>
            {
              text.map((cc, ccindex) => {
                return (<Tag color="cyan" key={cc}>{cc}</Tag>)
              })
            }
          </div>
        },
      },

      {
        title: '总浏览数', dataIndex: 'total_views', render: (time, record, index) => {
          if (record.ediet) {
            return (
              <div>
                <Input placeholder="用户名" value={time} onChange={(value) => { this.fileChange(value, index, 'total_views') }} />
              </div>
            )
          }
          else {
            return (
              <span >
                {time}
              </span>
            )
          }
        },
      },

      {
        title: '封面图', dataIndex: 'img', render: (img, rowData, index) => {
          return (
            <span>
              <img src={img} alt="" className={styles.imgSet} />
            </span>
          )
        },
      },
      {
        title: '创建时间', dataIndex: 'time', render: (time, row, index) => {
          if (row.ediet) {
            return (
              <div>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" value={time && moment(time)} onChange={(value) => { this.fileChange(value, index, 'time') }} />
              </div>
            )
          }
          else {
            return (
              <span >
                {time}
              </span>
            )
          }
        },
      },
      {
        title: '地域', dataIndex: 'regional',
        render: (text, record, index) => {
          if (record.ediet) {
            return (
              <div>
                <Select
                  placeholder="请选择地域"
                  allowClear
                  name={'select' + index} value={text} onChange={(value) => { this.fileChange(value, index, 'regional') }}>
                  <Option value="全球">全球</Option>
                  <Option value="中国">中国</Option>
                  <Option value="韩国">韩国</Option>
                </Select>
              </div>
            )
          }
          else {
            return (
              <span >
                {text}
              </span>
            )
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          if (record.ediet) {
            return (
              <div className="operateWrap" >

                <Button
                  type="primary" onClick={() => this.edietSure(index)}>
                  确认
              </Button>
                <Button
                  type="primary" danger onClick={() => this.cancelEdiet(index)}>
                  取消
              </Button>
              </div>
            )
          }
          else {
            return (
              <div className={styles.operateWrap}  >
                <Button
                  type="primary" onClick={() => this.edietFun(index)}>
                  编辑
              </Button>
                <Button
                  type="primary" onClick={() => this.edietFun2(index, 1)}>
                  编辑弹框方式
              </Button>
                <Popconfirm placement="topLeft" title='删除' onConfirm={() => this.del(index)} okText="Yes" cancelText="No">
                  <Button danger >删除</Button>
                </Popconfirm>
              </div>
            )
          }
        }
      }
    ]
    return (
      <div>
        <Form ref={this.formRef} name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item
            name="用户名"
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="ss" label="模块" rules={[{ required: true }]}>
            <Select
              placeholder="请选择模块"
              allowClear
            >
              <Option value="male">A</Option>
              <Option value="female">B</Option>
              <Option value="other">C</Option>
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
              >
                查询
              </Button>
            )}
          </Form.Item>
        </Form>
        <div className="mt10">
          <Table
            bordered
            columns={columns}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            className={styles.vipTable}
            rowKey={(record, index) => index}
          />
        </div>
        {/* 编辑弹框 */}
        <EdietVip getChildrenMsg={() => { this.getChildrenMsg() }} edietData={this.state.edietData} />>
      </div>
    );
  }
}


export default connect()(vipList)

