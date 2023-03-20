import http from '@/util/http'
import { ElNotification } from 'element-plus'

export default {
  data () {
    return {
      username: null,
      password: null
    }
  },
  mounted () {
    // 标题跳动
    const labels = document.querySelectorAll('.form-control label')
    labels.forEach(label => {
      label.innerHTML = label.innerText
        .split('')
        .map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)
        .join('')
    })
  },
  methods: {
    login () {
      // 请求登录接口
      http({
        method: 'post',
        url: '/api/login',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          username: this.username,
          password: this.password,
          time_1: new Date().getTime()
        }
      }).then(res => {
        if (res.data.status === 0) { // 登录成功
          ElNotification({
            title: 'Success',
            message: '登录成功,欢迎访问',
            type: 'success'
          })
          window.localStorage.setItem('token', res.data.token)
          this.$router.push('/')
        } else {
          ElNotification({
            title: 'warning',
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}

// let turnBtn = document.querySelector('#page-turning')
// let container = document.querySelector('.container')

// turnBtn.onclick = function () {
//     container.style = 'transform: rotateY(180deg)'
// }
