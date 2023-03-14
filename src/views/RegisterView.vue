<template>
    <div class="body">
        <div class="container">
        <h1>注册表</h1>
        <form>
            <div class="form-control">
            <input type="text" required name="username" id="username" v-model="username">
            <label>账号：</label>
            </div>
            <div class="form-control">
            <input type="text" required name="nickname" id="nickname" v-model="nickname">
            <label>昵称：</label>
            </div>
            <div class="form-control">
            <input type="password" required name="password" id="password" v-model="password_1">
            <label>密码：</label>
            </div>
            <div class="form-control">
            <input type="password" required name="password2" id="password2" v-model="password_2">
            <label>再次输入密码：</label>
            </div>
            <button class="btn" id="reguser" @click.prevent="register">注册</button>
            <p class="text">已有账号? <router-link to="/login">立即登录</router-link> </p>
        </form>
        </div>
    </div>
</template>
<script>
import http from '@/util/http'
import { ElNotification } from 'element-plus'
export default {
  data () {
    return {
      username: null,
      password_1: null,
      password_2: null,
      nickname: null
    }
  },
  mounted () {
    const labels = document.querySelectorAll('.form-control label')
    labels.forEach(label => { // 标题跳动
      label.innerHTML = label.innerText
        .split('')
        .map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)
        .join('')
    })
  },
  methods: {
    // 注册接口
    register () {
      // 校验完整性
      // 校验表单完整性
      if (!this.username || !this.password_1) {
        ElNotification({
          title: 'warning',
          message: '账号或密码不能为空！',
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
            username: this.username,
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
  width: 300px;
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
