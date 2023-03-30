import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import mainPageView from '@/views/mainView/mainPageView.vue'
import secondPageView from '@/views/mainView/secondPageView.vue'
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
        component: mainPageView
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
    path: '/register',
    name: 'register',
    component: RegisterView
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
