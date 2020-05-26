import {
  GET, POST, PATCH, DELETE, POSTFILE
} from '../http'

const infoNews = {
  updateInfoImage: (data) => POSTFILE('/api/common/images', data), //  统一上传图片接口
  infoBanner: (data) => GET('/api/news/banners', data), // 获取banner列表

  // 投融资数据
  getFianceTaglist: (data) => GET('/api/investments/fields?include=corporations', data), //  获取投融资标签列表
  addFianceTag: (data) => POST('/api/investments/fields', data), //  新增投融资标签
  edietFianceTag: (data) => PATCH(`/api/investments/fields/${data.id}`, data), //  编辑投融资标签
  delFianceTag: (data) => DELETE(`/api/investments/fields/${data.id}`, data), //  删除投融资标签

  companyList: (data) => GET('/api/investments/projects?include=tags,events', data), //  投融资公司列表
  addCompany: (data) => POST('/api/investments/projects', data), //  新增公司
  updateCompany: (data) => PATCH(`/api/investments/projects/${data.id}`, data), //  更新公司
  deleteCompany: (data) => DELETE(`/api/investments/projects/${data.id}`, data), //  删除公司

  addFinanceInfo: (data) => POST('/api/investments/events', data), //  新增投融资
  updateFinanceInfo: (data) => PATCH(`/api/investments/events/${data.id}`, data), //  更新投融资
  deleteFinanceInfo: (data) => DELETE(`/api/investments/events/${data.id}`, data) //  删除投融资
}
export default infoNews
