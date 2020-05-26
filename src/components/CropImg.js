import { connect } from 'dva'
// import moment from 'moment';
import React from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Button, Upload, Modal, Spin, message } from 'antd'
import apiList from '../request/api'
class CropImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: '',
      showImg: "",
      visible: false,
      loading: false
    };
  }
  componentDidMount () {
    this.setState({
      showImg: this.props.showImg
    })
  };
  componentWillReceiveProps (nextProps, nextContext) {
    const { showImg } = nextProps
    this.setState({
      showImg
    })
  }
  // 选择图片相关
  beforeUpload = (file, fileList) => {
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      this.$message.error('上传文件大小不能超过 5MB!')
      return false
    }
    const fr = new FileReader()
    fr.onload = e => {
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.setState({
        src: fr.result,
        visible: true
      })
    }
    fr.readAsDataURL(file)
    return false
  };


  cropImage = () => {
    if (this.cropper.getCroppedCanvas() === 'null') {
      return false
    }
    else {
      this.cropper.getCroppedCanvas().toBlob((data) => {
        this.setState({ loading: true })
        const param = new FormData()
        param.append('image', data)
        param.append('type', 'cover')
        apiList.updateInfoImage(param).then((res) => {
          console.log(res)
          this.props.getData(res.data.url)
          this.setState({
            showImg: res.data.url,
            visible: false,
            loading: false
          })

        }).catch(err => {
          this.setState({ loading: false })
          message.info(err.message);
        })
      })

    }
  }

  render () {
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { loading } = this.state
    return (
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action=""
          beforeUpload={this.beforeUpload}
        >

          {this.state.showImg ? <img src={this.state.showImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        <Modal
          title='裁剪图片'
          visible={this.state.visible}
          onOk={this.cropImage}
          onCancel={() => { this.setState({ visible: false }) }}
          confirmLoading={loading}
          okText="确认"
          cancelText="取消"
        >
          <Cropper className="cropperBox"
            src={this.state.src}
            ref={cropper => {
              this.cropper = cropper;
            }}
            viewMode={1}
            zoomable={false}
            aspectRatio={1} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
            guides={false}
            preview=".cropper-preview"
          />
          <div className="preview-container">
            <div className="cropper-preview" />
          </div>
        </Modal>
      </div>
    );
  }
}
export default connect()(CropImg)
