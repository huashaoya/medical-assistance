<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <RouterLink to="/indexOne"><el-menu-item index="1">三个癌</el-menu-item></RouterLink>
    <RouterLink to="/indexTwo"><el-menu-item index="2">目标检测</el-menu-item></RouterLink>
    <RouterLink to="/indexThree"><el-menu-item index="3">分割</el-menu-item></RouterLink>
  </el-menu>
  <RouterView></RouterView>
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
            message: res.data.data.username + ' 登录',
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
  },
  methods: {
    handleSelect () {

    }
  }
}
</script>
<style>
</style>
