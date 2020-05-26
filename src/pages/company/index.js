import { connect } from 'dva'
import moment from 'moment';
import React from 'react';
import { Form, Input, Button, Select, Table, DatePicker, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './style.less'
import EdietCompany from './components/EdietCompany';
import InvestmentInfo from './components/InvestmentInfo';
import apiList from '../../request/api'
const { Option } = Select;
const { RangePicker } = DatePicker;
class company extends React.Component {
  formRef = React.createRef();
  investment = React.createRef();

  state = {
    status: [{ // 状态
      id: 0,
      name: '未发布'
    }, {
      id: 10,
      name: '已发布'
    }],
    tagList: [],
    data: [{
    },],
    loading: false,
    searchForm: {},
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    //编辑2相关
    edietData: {
      title: "编辑",
      isEdiet: true,
      visible: false,
      content: {}
    },
    //投融资相关
    invest: {
      visible: false,
      data: [],
      investment_project_id: ""
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

  // 编辑方式2
  edietgonsFun2 = (type, row) => {
    let newdata = {
      title: !!type ? "编辑" : "新增",
      visible: true,
      isEdiet: !!type ? true : false,
      content: !!type ? JSON.parse(JSON.stringify(row)) : {},
      tagList: this.state.tagList
    }
    this.setState({
      edietData: newdata
    })
  };
  //获取子组件传来的值
  getChildrenMsg = (obj) => {
    let newData = Object.assign({}, this.state.edietData, { visible: false })
    this.setState({
      edietData: newData
    })
    if (obj.isFresh) {
      this.getList()
    }
  };

  //获取投资传来的数据
  getInvestMsg = (obj) => {
    if (obj.isClose) {
      let newData = Object.assign({}, this.state.invest, { visible: false })
      this.setState({
        invest: newData
      })
    }
    if (obj.isFresh) {
      this.getList()
    }
  }
  componentDidMount () {
    // 获取标签列表
    apiList.getFianceTaglist().then(({ data, meta: { pagination: { total } } }) => {
      this.setState({ tagList: data })
      console.log(data)
    })
    this.getList()
  }
  tagSet = () => {
    let { tagList } = this.state
    const children = [];
    for (let item of tagList) {
      children.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
    }
    return children
  }
  //分页
  changePage = (page) => {
    console.log(this.state.pagination)
    let newObj = Object.assign({}, this.state.pagination, {
      page: page,
    })
    this.setState({
      pagination: newObj
    }, () => {
      this.getList()
    })
  }
  sizeChange = (val, ww) => {
    let newObj = Object.assign({}, this.state.pagination, {
      limit: ww,
    })
    this.setState({
      pagination: newObj
    }, () => {
      this.getList()
    })
  }
  //获取表格列表
  getList = () => {
    let { searchForm, pagination, invest } = this.state
    searchForm.start = searchForm.created_date ? searchForm.created_date[0] : null
    searchForm.end = searchForm.created_date ? searchForm.created_date[1] : null

    searchForm.per_page = pagination.limit
    searchForm.page = pagination.page
    for (const item in searchForm) {
      if (!searchForm[item] && searchForm[item] !== 0) {
        delete searchForm[item]
      }
    }
    this.setState({ loading: true })
    apiList.companyList(searchForm).then(({ data, meta: { pagination: { total } } }) => {
      let newPage = Object.assign({}, this.state.pagination, { total: total })
      this.setState({ loading: false, data: data, pagination: newPage })

      // 传递数据给子组件
      if (invest.visible && invest.investment_project_id) {
        const index = data.findIndex(val => val.id === invest.investment_project_id)
        let newInfo = Object.assign({}, invest, { data: data[index].events })
        this.setState({
          invest: newInfo
        })
      }

      console.log(data)
    }).catch(err => {
      this.setState({ loading: false })
    })
  }
  onFinish = (values) => {
    values['created_date'] = values['created_date'] ? [values['created_date'][0].format('YYYY-MM-DD HH:mm:ss'), values['created_date'][1].format('YYYY-MM-DD HH:mm:ss')] : null
    this.setState({ searchForm: values }, () => {
      console.log(values)
      this.getList()
    })

  };
  onReset = () => {
    if (this.formRef.current) {
      this.formRef.current.resetFields()
      this.setState({
        searchForm: {}
      }, () => {
        this.getList()
      })
    }
  }
  //打开投融资弹框
  // 打开投融资弹框
  openInvest (row) {
    let invest = {
      visible: true,
      data: row.events ? JSON.parse(JSON.stringify(row.events)) : [], //
      investment_project_id: row.id
    }
    this.setState({
      invest: invest
    })
  }
  render () {
    let { loading } = this.state
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '标签',
        dataIndex: 'tags',
        render: (value, row, index) => {
          let userMessage
          if (value && value.length !== 0) {
            userMessage = (
              value.map((item, ccindex) => {
                return (<Tag color="cyan" key={item.id}>{item.name}</Tag>)
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
        title: '地区',
        dataIndex: 'state',
        width: 200,
      },
      {
        title: '成立时间',
        dataIndex: 'established_at',
      },
      {
        title: '浏览量',
        dataIndex: 'view_count',
      },
      {
        title: '收藏量',
        dataIndex: 'collect_count',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value, row, index) => {
          return (
            <div>
              {
                value === 0 ? '未发布' : '已发布'
              }
            </div>
          )
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        dataIndex: 'operate',

        width: '413',
        render: (text, row, index) => {
          return (
            <div>
              <a href={'https://news.jianshutech.com/investment/detail?project_id=' + row.id}
                target="_blank"
              >
                <Button
                  className="mr5" >
                  预览
              </Button>
              </a>
              <Button
                type="primary" className="mr5" onClick={() => this.edietgonsFun2(index, row)}>
                编辑
            </Button>
              <Button
                type="primary" onClick={() => this.openInvest(row)}>
                投融资
            </Button>
            </div>
          )
        }
      }
    ]
    return (
      <div>
        <Form className="listSearch" ref={this.formRef} name="horizontal_login"
          layout="inline" onFinish={this.onFinish}>
          <Form.Item name="status" >
            <Select
              placeholder="请选择状态"
              allowClear
            >
              {
                this.state.status.map((item, index) => {
                  return <Option value={item.id} key={item.id}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name="fields" >
            <Select
              mode="multiple"
              placeholder="请选择标签"
            >
              {this.tagSet()}
            </Select>
          </Form.Item>
          <Form.Item
            name="keyword"
          >
            <Input placeholder="名称" />
          </Form.Item>
          <Form.Item className="rangeTime"
            name="created_date"
          >
            <RangePicker placeholder={[' 开始日期', '结束日期']} separator='-' showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button className="mr10"
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              搜索
              </Button>
            <Button
              type="primary"
              onClick={this.onReset}

            >
              重置
             </Button>
          </Form.Item>
        </Form>
        <Button className="add"
          icon={<PlusOutlined />}
          onClick={() => this.edietgonsFun2(0)}
        >
          新增公司
         </Button>
        <div className="mt10">
          <Table
            bordered
            columns={columns}
            dataSource={this.state.data}
            pagination={{ ...this.state.pagination, onChange: this.changePage, onShowSizeChange: this.sizeChange }}
            className={styles.vipTable}
            loading={loading}
            scroll={{ x: 1000, }}
            rowKey={(record, index) => index}
          />
        </div>
        {/* 编辑弹框 */}
        <EdietCompany getChildrenMsg={this.getChildrenMsg} edietData={this.state.edietData} />
        {/* 投融资信息弹框 */}
        <InvestmentInfo ref={this.investment} invest={this.state.invest} getInvestMsg={this.getInvestMsg} />
      </div >
    );
  }
}


export default connect()(company)

