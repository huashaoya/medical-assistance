<template>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
  background-color: rgba(0,0,0,0)!important;
}
*::-webkit-scrollbar {
display: none;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
ul,li{
  list-style-type: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
html{
  height: 100vh;
  background: url('@/assets/pageBg.png') center center no-repeat;
}
</style>
