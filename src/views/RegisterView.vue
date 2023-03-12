<template>
    <div class="body">
        <div class="container">
        <h1>注册表</h1>
        <form>
            <div class="form-control">
            <input type="text" required name="username" id="username">
            <label>账号：</label>
            </div>
            <div class="form-control">
            <input type="text" required name="nickname" id="nickname">
            <label>昵称：</label>
            </div>
            <div class="form-control">
            <input type="password" required name="password" id="password">
            <label>密码：</label>
            </div>
            <div class="form-control">
            <input type="password" required name="password2" id="password2">
            <label>再次输入密码：</label>
            </div>
            <button class="btn" id="reguser">注册</button>
            <p class="text">已有账号? <router-link to="/login">立即登录</router-link> </p>
        </form>
        </div>
    </div>
</template>
<script>
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
