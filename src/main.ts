import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import dataV from '@jiaminghi/data-view'

// 引入全局css
import './assets/scss/style.scss'
// 引入图表（所有图标见 icon 目录下的 demo_index.html）
import './assets/icon/iconfont.css'
// 引入 全局注册组件
import PublicComponent from '@/components/componentInstall'

createApp(App).use(PublicComponent).use(dataV).use(store).use(router).use(ElementPlus).mount('#app')
