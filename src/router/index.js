import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import secondPageView from '@/views/mainView/monitorView/indexView.vue'
import dataV from '@/views/mainView/dataV/index/indexView.vue'
import pageOne from '@/views/mainView/pageOne.vue'
import AppView from '@/views/mainView/AppView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: AppView,
    children: [
      {
        path: '/',
        name: 'mainPage',
        component: dataV
      },
      {
        path: '/secondPage',
        name: 'secondPage',
        component: secondPageView
      },
      {
        path: '/pageOne',
        name: 'pageOne',
        component: pageOne
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
