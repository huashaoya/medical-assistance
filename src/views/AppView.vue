<template>
    <h1>主页面</h1>
    {{ token }}
</template>
<script>
import http from '@/util/http'
import { ElNotification } from 'element-plus'
export default {
  data () {
    return {
      token: window.localStorage.getItem('token')
    }
  },
  mounted () {
    if (!this.token) { // 校验token
      this.$router.push('/login')
    } else {
      http({
        method: 'post',
        url: '/my/userinfo',
        headers: {
          authorization: this.token
        }
      }).then(res => {
        console.log(res)
        if (res.data.status === 0) {
          ElNotification({
            title: 'Welcome',
            message: res.data.data.nickname + ' 登录',
            type: 'success'
          })
        } else {
          ElNotification({
            title: 'warning',
            message: res.data.msg + '请重新登录',
            type: 'warning'
          })
          this.$router.push('./login')
        }
      })
    }
  }
}
</script>
<style>
</style>
