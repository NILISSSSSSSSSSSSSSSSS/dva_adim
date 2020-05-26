import { connect } from 'dva'
// import moment from 'moment';
import React from 'react';
import { Form, Input, DatePicker, Modal, message, Upload, Switch, Tag } from 'antd';
import moment from 'moment'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
// const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

class EdietVip extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      img: "",
      tagInfo: {
        tags: [],
        inputVisible: false,
        inputValue: '',
      },
      defaultVal: {}
    };
  }
  componentDidMount () {
  };
  componentWillReceiveProps (nextProps, nextContext) {
    const { visible, content } = nextProps.edietData;
    if (visible) {
      let initialValues22 = {
        img: content.img,
        labels: content.labels,
        total_views: content.total_views,
        time: moment(content.time, 'YYYY-MM-DD HH:mm:ss'),
        switch_hot: content.switch_hot === 'true' ? true : false,
      }
      let newTagInfo = Object.assign({}, this.state.tagInfo, { tags: content.labels })
      // 设置初始化默认值（只在第一次渲染有用，不是一第一次渲染则需要用setFieldsValue）
      this.setState({
        defaultVal: initialValues22,
        img: initialValues22.img,
        tagInfo: newTagInfo
      }, () => {
        console.log(this.state.defaultVal)
      })
      // 
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue(initialValues22)
      }

    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  cancel = () => {
    let isFresh = 1
    this.props.getChildrenMsg(isFresh)
  };
  // 标签相关
  closeTag = (index) => {
    let newTagInfo = JSON.parse(JSON.stringify(this.state.tagInfo))
    newTagInfo.tags.splice(index, 1)
    this.setState({
      tagInfo: newTagInfo
    })
  }
  showInput = () => {
    const { tagInfo } = this.state
    tagInfo.inputVisible = true
    this.setState({
      tagInfo: tagInfo
    }, () => {
      this.saveInputRef.focus()
    })
  }
  handleInputConfirm = () => {
    const { tagInfo } = this.state
    if (tagInfo.inputValue) {
      tagInfo.inputVisible = false
      tagInfo.tags.push(tagInfo.inputValue)
      tagInfo.inputValue = ''
      this.setState({
        tagInfo: tagInfo
      });
      this.formRef.current.setFieldsValue({ labels: tagInfo.tags })
    }
  }
  render () {
    const { title, visible, img } = this.props.edietData;
    const { inputVisible, inputValue, tags } = this.state.tagInfo;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const validate1 = (rule, value, callback) => {
      if (!value) {
        return Promise.reject("不能为空")
      }
      else if (value < 0) {
        return Promise.reject("不能为负数")
      } else {
        return Promise.resolve();
      }
    }
    const onFinish = values => {
      let param = {
        ...values,
        labels: this.state.tagInfo.tags,
        img: this.state.img,
        time: values['time'].format('YYYY-MM-DD HH:mm:ss')
      }
      console.log('Success:', JSON.stringify(param));
    };

    // 选择图片相关
    const handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        this.setState({
          img: info.file.response.url,
          loading: false,
        })
      }
    };
    const beforeUpload = file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    }

    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={() => { this.formRef.current.submit() }}
          onCancel={this.cancel}
          okText="确认"
          cancelText="取消"
        >
          <Form initialValues={this.state.defaultVal}  {...layout} ref={this.formRef} name="horizontal_login" onFinish={onFinish} onFinishFailed={errorInfo => { console.log('Failed:', errorInfo) }}>
            <Form.Item
              label="总浏览数"
              name="total_views"
              rules={[{ required: true, trigger: 'blur', validator: validate1 }]}
            >
              <Input placeholder="总浏览数" />
            </Form.Item>
            <Form.Item name="time" label="创建时间" rules={[{ required: true, message: '请选择时间', }]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"

              />
            </Form.Item>
            <Form.Item name="img" label="封面图" rules={[{ required: true, message: '封面图必传', }]}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >

                {this.state.img ? <img src={this.state.img} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item name="labels" label="标签" rules={[{ type: "array", required: true, message: '请填写标签', }]}>
              {
                tags.map((item, index) => {
                  return <Tag closable key={index} onClose={() => { this.closeTag(index) }}>
                    {item}
                  </Tag>
                })
              }
              {inputVisible && (
                <Input
                  ref={input => this.saveInputRef = input}
                  type="text"
                  size="small"
                  className="tag-input"
                  value={inputValue}
                  onChange={e => {
                    const { tagInfo } = this.state
                    tagInfo.inputValue = e.target.value
                    this.setState({
                      tagInfo: tagInfo
                    })
                  }}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag className="site-tag-plus" onClick={this.showInput}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Form.Item>
            <Form.Item name="switch_hot" label="Switch" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default connect()(EdietVip)
