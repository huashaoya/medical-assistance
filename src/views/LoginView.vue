<template>
  <div class="body">
    <!-- 背景 -->
    <div class="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <!-- 标题 -->
    <h1 class="headline-text">基于深度学习的医疗辅助系统</h1>
    <!-- 中间栏背景 -->

    <!-- 登陆注册界面 -->

    <div class="contain mx-auto">
      <!-- <input class="checkbox" type="checkbox" id="back" name="back">
      <label for="back" style="font-size: 2em;">立即注册 立即登陆</label> -->
      <div class="container" :class="{ active: isActive }">

        <div class="container-font">
          <div class="contain-center">
            <h1>登陆界面</h1>
            <form>
              <div class="form-control">
                <input type="text" required name="username" id="username" v-model="username">
                <label>账号：</label>
              </div>

              <div class="form-control">
                <input type="password" required name="password" id="password" v-model="password">
                <label>密码：</label>
              </div>

              <button class="btn" id="login" @click.prevent="login">登录</button>

              <p class="text">还没有注册账号?
                <span @click="pageTurning">立即注册</span>
              </p>
            </form>
          </div>
        </div>

        <div class="container-back">
          <div class="contain-center">
            <h1>注册表</h1>
            <form>
              <div class="form-control">
                <input type="text" required  v-model="username_register">
                <label>账号：</label>
              </div>
              <div class="form-control">
                <input type="text" required   v-model="nickname">
                <label>昵称：</label>
              </div>
              <div class="form-control">
                <input type="password" required  v-model="password_1">
                <label>密码：</label>
              </div>
              <div class="form-control">
                <input type="password" required   v-model="password_2">
                <label>再次输入密码：</label>
              </div>
              <button class="btn" id="reguser" @click.prevent="register">注册</button>
              <p class="text">已有账号?
                <span @click="pageTurning">立即登录</span>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script scoped>
import http from '@/util/http'
import { ElNotification } from 'element-plus'

export default {
  data () {
    return {
      username: null,
      password: null,
      isActive: false,
      username_register: null,
      password_1: null,
      password_2: null,
      nickname: null
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
    pageTurning () {
      if (this.isActive) {
        this.isActive = false
      } else {
        this.isActive = true
      }
    },

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
    },
    // 注册接口
    register () {
      // 校验完整性
      if (this.password_1 == null || this.password_2 == null) {
        ElNotification({
          title: 'warning',
          message: '密码不能为空',
          type: 'warning'
        })
      } else if (this.password_1 !== this.password_2) {
        ElNotification({
          title: 'warning',
          message: '两次输入密码不一致',
          type: 'warning'
        })
      } else {
        http({
          method: 'post',
          url: '/api/reguser',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            username: this.username_register,
            password: this.password_1,
            nickname: this.nickname,
            time_r: new Date().getTime()
          }
        }).then(res => {
          if (res.data.status === 0) {
            ElNotification({
              title: 'Success',
              message: '注册成功',
              type: 'success'
            })
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
}

// let turnBtn = document.querySelector('#page-turning')
// let container = document.querySelector('.container')

// turnBtn.onclick = function () {
//   container.style = 'transform: rotateY(180deg)'
// }
</script>
<!-- <script src="./JS/LoginView.js"></script> -->
<style src="./CSS/LoginView.css"></style>
