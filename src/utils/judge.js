// 对于数据请求的封装
import axios from 'axios'

// function Http () {
//   return axios({
//   })
// }

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 1000,
  headers: {}
})

export default http
