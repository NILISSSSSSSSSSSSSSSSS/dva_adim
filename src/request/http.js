import axios from 'axios'
import {
  getToken,
  setToken
} from '../utils/token'

// import store from '../store/index.js'

// axios 配置
const root = 'http://api-admin.drugeyes.vip:7031'
axios.defaults.timeout = 10000
axios.defaults.baseURL = root
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求之前处理
  config.headers.Authorization = `Bearer ${getToken()}`
  config.headers.Accept = 'application/x.myapp.v1+json'
  return config
}, function (error) {
  // 请求错误处理
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  const token = response.headers.authorization
  if (token) {
    setToken(token)
  }
  return response.data
}, function (error) {
  if (error && error.response && error.response.status === 401) {
    if (error.response.data.error) {
      // Message.error(error.response.data.error)
    } else {
      // router.push('/login')
    }
  }
  // 响应错误处理
  return Promise.reject(error)
})

// GET 请求
export function GET (url, params) {
  return axios.get(url, {
    params: params
  })
}

// POST 请求
export function POST (url, data, params) {
  // params = qs.stringify(params)
  return axios.post(url, data, params)
}
// POST 发送文件
export function POSTFILE (url, data) {
  // params = qs.stringify(params)
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return axios.post(url, data, config)
}

// put 请求
export function PUT (url, data, params) {
  // params = qs.stringify(params)
  // data = qs.stringify(data)
  return axios.put(url, data, params)
}

// delete 请求
export function DELETE (url, data) {
  return axios.delete(url, data)
}

// patch 请求
export function PATCH (url, data) {
  return axios.patch(url, data)
}
