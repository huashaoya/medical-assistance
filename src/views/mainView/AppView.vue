<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <el-menu-item index="1">主页面</el-menu-item>
    <el-menu-item index="2">监控页</el-menu-item>
    <el-menu-item index="3">乳腺癌</el-menu-item>
    <el-menu-item index="4">血癌</el-menu-item>
    <el-menu-item index="5">喉癌和下咽癌</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>
<script>
import http from '@/util/http'
import { ElNotification } from 'element-plus'
export default {
  data () {
    return {
      token: window.localStorage.getItem('token'),
      activeIndex: '1'
    }
  },
  mounted () {
    this.checkToken()
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
      if (key === '1') {
        this.$router.push('/')
      } else if (key === '2') {
        this.$router.push('/secondPage')
      } else if (key === '3') {
        this.$router.push('/pageOne')
      }
    },
    checkToken () { // 校验token
      if (!this.token) {
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
}
</script>
<style>
</style>
