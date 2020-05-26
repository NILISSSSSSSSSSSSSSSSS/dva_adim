import { connect } from 'dva'
import React from 'react';
import { Form, Input, DatePicker, Modal, message, Cascader, Select, Tag } from 'antd';
import moment from 'moment'
import { Area } from '../area'
import CropImg from '../../../components/CropImg'
import apiList from '../../../request/api'
import styles from '../style.less'
import Quill from '../../../components/Quill.js'
const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
interface Props {
}
interface State {
  options: any[],
  loading: boolean,
  defaultVal: {},
  quillText: string,
}

class EdietCompany extends React.Component<Props, State> {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      loading: false,
      defaultVal: 1,
      quillText: "",
    };
  }
  componentDidMount() {
    this.setState({ options: Area })
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const { visible, content, isEdiet } = nextProps.edietData;
    if (visible) {
      if (isEdiet) {
        let initialValues22 = Object.assign({}, content,
          {
            established_at: content.established_at ? moment(content.established_at, 'YYYY-MM-DD HH:mm:ss') : '',
            area: content.city ? [content.country, content.state, content.city] : [content.country, content.state],
            tags: content.tags ? content.tags.map((v) => { return v.id }) : []
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
            id: '',
            name: '',
            website: '',
            intro: '',
            description: '',
            logo: '',
            established_at: '',
            area: [],
            tags: []
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
      established_at: values['established_at'].format('YYYY-MM-DD HH:mm:ss'),
      id: content.id,
    }
    if (values.area) {
      [param.country, param.state, param.city] = [values.area[0], values.area[1], values.area[2]]
    }
    let apiName
    if (isEdiet) {
      apiName = 'updateCompany'
    } else {
      apiName = 'addCompany'
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
  handleChange = value => {
    this.formRef.current.setFieldsValue({ tags: value })
    console.log(value)
  }
  // 富文本编辑器相关
  quillChange = val => {
    console.log("富文本文字：" + val)
  }
  render() {
    const { title, visible, content, tagList } = this.props.edietData;
    const { loading } = this.state;
    const tagRender = props => {
      const { label, closable, onClose } = props;
      return (
        <Tag color="success" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
          {label}
        </Tag>
      );
    }
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
            <Form.Item
              label="名称"
              name="name"
              rules={[{
                required: true, message: '不能为空'
              }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="地区" name="area" rules={[{ type: 'array', required: true, message: '不能为空' }]} >
              <Cascader options={this.state.options} placeholder="请选择" />
            </Form.Item>
            <Form.Item name="established_at" label="成立时间" rules={[{ required: true, message: '请选择时间', }]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
            <Form.Item label="官网" name="website" rules={[{ type: 'url', required: true, message: '请填写正确的官网url' }]} >
              <Input />
            </Form.Item>
            <Form.Item label="简介" name="description" rules={[{ required: true, message: '不能为空' }]} >
              <Input max={200} />
            </Form.Item>
            <Form.Item label="详细介绍" name="intro" >
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item name="logo" label="封面图" >
              {/* 图片裁剪插件 */}
              <CropImg showImg={content.logo} getData={(data) => { this.formRef.current.setFieldsValue({ logo: data }) }} />
            </Form.Item>

            <Form.Item name="tags" label="标签" rules={[{ type: "array", required: true, message: '请输入标签', }]}>
              <Select
                mode="multiple"
                tagRender={tagRender}
                style={{ width: '100%' }}
                onChange={this.handleChange}
              >
                {
                  tagList && (
                    tagList.map((item, index) => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    })
                  )
                }
              </Select>
            </Form.Item>

            <Form.Item label="富文本编辑器" >
              <Quill value={this.state.quillText} />
              {/* <ReactQuill 
                onChange={this.quillChange} /> */}
            </Form.Item>
          </Form>

        </Modal>
      </div>
    );
  }
}
export default connect()(EdietCompany)
