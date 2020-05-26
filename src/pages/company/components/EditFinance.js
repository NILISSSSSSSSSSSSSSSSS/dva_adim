import { connect } from 'dva'
import React from 'react';
import { Form, Input, DatePicker, Modal, message, Cascader, Select, Tag } from 'antd';
import moment from 'moment'
import apiList from '../../../request/api'
import styles from '../style.less'
const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

class EditFinance extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      loading: false,
      defaultVal: {},
      round: [{
        name: '尚未获投'
      }, {
        name: '种子轮'
      }, {
        name: '天使轮'
      }, {
        name: 'Pre-A轮'
      }, {
        name: 'A轮'
      }, {
        name: 'A+轮'
      }, {
        name: 'Pre-B轮'
      }, {
        name: 'B轮'
      }, {
        name: 'B+轮'
      }, {
        name: 'C轮'
      }, {
        name: 'C+轮'
      }, {
        name: 'D轮'
      }, {
        name: 'D+轮'
      }, {
        name: 'E轮'
      }, {
        name: 'F轮-上市前'
      }, {
        name: '已上市'
      }, {
        name: '新三板'
      }, {
        name: '战略投资'
      }, {
        name: '已被收购'
      }],
    };
  }
  componentDidMount () {
  };

  componentWillReceiveProps (nextProps, nextContext) {
    const { visible, content, isEdiet } = nextProps.edietData;
    if (visible) {
      if (isEdiet) {
        let newInvestors
        if (content.investors) {
          newInvestors = content.investors.join(",")
          newInvestors = newInvestors.replace(/,/g, '\n')
        }
        else {
          newInvestors = ''
        }

        let initialValues22 = Object.assign({}, content,
          {
            invested_at: content.invested_at ? moment(content.invested_at, 'YYYY-MM-DD HH:mm:ss') : '',
            investors: newInvestors
          })
        // 设置初始化默认值（只在第一次渲染有用，不是一第一次渲染则需要用setFieldsValue）
        this.setState({
          defaultVal: initialValues22,
        })
        // 
        if (this.formRef.current) {
          this.formRef.current.setFieldsValue(initialValues22)
        }
      }
      else {
        if (this.formRef.current) {
          this.formRef.current.setFieldsValue({
            invested_at: "",
            round: "",
            amount: "",
            investors: ""
          })
        }
      }
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  close = (val) => {
    this.props.getChildrenMsg({ isFresh: val })
  }

  onFinish = values => {
    console.log(values)
    const { isEdiet, content } = this.props.edietData;
    let param = {
      ...values,
      invested_at: values['invested_at'].format('YYYY-MM-DD HH:mm:ss'),
      id: content.id,
      investors: values.investors.split('\n'),
      investment_project_id: content.investment_project_id
    }

    let apiName
    if (isEdiet) {
      apiName = 'updateFinanceInfo'
    } else {
      apiName = 'addFinanceInfo'
    }
    this.setState({ loading: true })
    apiList[apiName](param).then(data => {
      this.setState({ loading: false })
      this.close(true)
      message.success('成功');
    }).catch(err => {
      this.setState({ loading: false })
      message.error(err.message);
    })
    console.log('Success:', JSON.stringify(param));
  };
  render () {
    const { title, visible, content } = this.props.edietData;
    const { loading, round } = this.state;
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={() => { this.formRef.current.submit() }}
          onCancel={(() => { this.close(false) })}
          confirmLoading={loading}
          okText="确认"
          cancelText="取消"
          width="700px"
          className={styles.dialogo}
        >
          <Form initialValues={this.state.defaultVal}  {...layout} ref={this.formRef} name="horizontal_login" onFinish={this.onFinish} onFinishFailed={errorInfo => { console.log('Failed:', errorInfo) }}>
            <Form.Item name="invested_at" label="成立时间" rules={[{ required: true, message: '成立时间', }]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
            <Form.Item label="轮次" name="round" rules={[{ required: true, message: '请填写轮次' }]} >
              <Select
                style={{ width: '100%' }}
              >
                {
                  round && (
                    round.map((item, index) => {
                      return <Option value={item.name} key={item.name}>{item.name}</Option>
                    })
                  )
                }
              </Select>
            </Form.Item>

            <Form.Item label="投资金额" name="amount" rules={[{ required: true, message: '不能为空' }]} >
              <Input max={200} />
            </Form.Item>
            <Form.Item label="投资方" name="investors" >
              <Input.TextArea rows={5} />
            </Form.Item>

          </Form>

        </Modal>
      </div>
    );
  }
}
export default connect()(EditFinance)
