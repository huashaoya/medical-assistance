<template>
  <div class="body">
    <div class="container">
      <h1>基于深度学习的医疗辅助系统</h1>
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

        <p class="text">还没有注册账号? <router-link to="/register">立即注册</router-link> </p>
      </form>
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
      // 校验表单完整性
      if (!this.username || !this.password) {
        ElNotification({
          title: 'warning',
          message: '账号或密码不能为空！',
          type: 'warning'
        })
      } else {
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
}

</script>
<style scoped>

.body {
  background-color: #2d3a4e;
  color: #fff;
  font-family: 'Muli', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}

.container {
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20px 40px;
  border-radius: 5px;
}

.container h1 {
  text-align: center;
  margin-bottom: 30px;
}

.container a {
  text-decoration: none;
  color: lightblue;
}

.btn {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  background: lightblue;
  padding: 15px;
  font-family: inherit;
  font-size: 16px;
  border: 0;
  border-radius: 5px;
}

.btn:focus {
  outline: 0;
}

.btn:active {
  transform: scale(0.98);
}

.text {
  margin-top: 30px;
}

.form-control {
  position: relative;
  margin: 20px 0 40px;
  width: 416px;
}

.form-control input {
  background-color: transparent;
  border: 0;
  border-bottom: 2px #fff solid;
  display: block;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  color: #fff;
}

.form-control input:focus,
.form-control input:valid {
  outline: 0;
  border-bottom-color: lightblue;
}

.form-control label {
  position: absolute;
  top: 15px;
  left: 0;
  pointer-events: none;
}

</style>

<style>
.form-control label span {
  display: inline-block;
  font-size: 18px;
  min-width: 5px;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.form-control input:focus + label span,
.form-control input:valid + label span {
  color: lightblue;
  transform: translateY(-30px);
}
</style>
