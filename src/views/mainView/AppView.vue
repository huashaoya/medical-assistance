<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    background-color="#0d1223"
    text-color="#fff"
    active-text-color="#0199ca"
    @select="handleSelect"
  >
    <el-menu-item index="1" style="font-size:20px">-基于癌症治疗的医疗辅助系统-</el-menu-item>
    <el-menu-item index="2">科室监控</el-menu-item>
    <el-menu-item index="3">图像处理</el-menu-item>
    <el-sub-menu index="4">
      <template #title>乳腺癌</template>
      <el-menu-item index="4-1">癌症分析</el-menu-item>
      <el-menu-item index="4-2">癌症追踪</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>血癌</template>
      <el-menu-item index="5-1">癌症分析</el-menu-item>
      <el-menu-item index="5-2">癌症追踪</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>喉癌和下咽癌</template>
      <el-menu-item index="6-1">癌症分析</el-menu-item>
      <el-menu-item index="6-2">癌症追踪</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <router-view></router-view>
</template>

<script>
import http from '@/utils/http'
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
        this.$router.push('/imageProcessing')
      } else if (key === '4-1') {
        this.$router.push({ path: '/pageOne', query: { type: '0' } })
      } else if (key === '5-1') {
        this.$router.push({ path: '/pageOne', query: { type: '1' } })
      } else if (key === '6-1') {
        this.$router.push({ path: '/pageOne', query: { type: '2' } })
      } else {
        this.$router.push('/pageOne-2')
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

<style scoped>
/* 取消菜单下边的白条 */
.el-menu--horizontal{
  border-bottom:0 solid black !important;
}
</style>
