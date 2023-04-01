// 对于数据请求的封装
import axios from 'axios'

// function Http () {
//   return axios({
//   })
// }

const http = axios.create({
  baseURL: 'http://106.55.171.221:3002',
  timeout: 1000,
  headers: {}
})

export default http
