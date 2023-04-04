import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import secondPageView from '@/views/mainView/monitorView/indexView.vue'
import dataV from '@/views/mainView/dataV/index/indexView.vue'
import pageOne from '@/views/mainView/imageSegmentationView/indexView.vue'
import pageOneTwo from '@/views/mainView/pageOne-2.vue'
import AppView from '@/views/mainView/AppView.vue'
import imageProcessingView from '@/views/mainView/imageProcessingView.vue'
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
        path: '/imageProcessing',
        name: 'imageProcessing',
        component: imageProcessingView
      },
      {
        path: '/pageOne',
        name: 'pageOne',
        component: pageOne
      },
      {
        path: '/pageOne-2',
        name: 'pageOne-2',
        component: pageOneTwo
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
