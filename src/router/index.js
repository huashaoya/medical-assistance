import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import mainPageView from '@/views/mainPageView.vue'
import secondPageView from '@/views/secondPageView.vue'
import AppView from '@/views/AppView.vue'

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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
