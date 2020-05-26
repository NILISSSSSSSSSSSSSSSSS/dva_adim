import { connect } from 'dva'
import React from 'react';
import { Form, Input, DatePicker, Modal, message, Cascader, Select, Tag } from 'antd';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import apiList from '../request/api'


function imageHandler () {
  console.log(this)
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();
  input.onchange = () => {
    const file = input.files[0];
    const fd = new FormData();
    fd.append('image', file);
    fd.append('type', 'cover')
    apiList.updateInfoImage(fd).then((res) => {
      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, 'image', res.data.url);

    }).catch(err => {
      message.info(err.message);
    })
  }
}

class Quill extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      quillText: "",
      reactQuillRef: null, // ReactQuill component
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],

          handlers: {
            image () {
              imageHandler.call(this);
            },
          },
        },
      },
      formats: [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
      ]
    }
  }
  componentDidMount () {
    this.setState({ quillText: this.props.value });
  };
  handleChange = (value) => {
    console.log(value)
    this.setState({ quillText: value });
  }
  render () {
    const { quillText, modules, formats } = this.state
    return (
      <div>
        <ReactQuill
          theme="snow"
          value={quillText}
          onChange={this.handleChange}
          modules={modules}
          formats={formats}
          ref={this.formRef}
        />
      </div>
    );
  }
}
export default connect()(Quill)
