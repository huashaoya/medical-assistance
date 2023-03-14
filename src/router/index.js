import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AppView from '@/views/AppView.vue'
import IndexOne from '@/views/AppView/IndexOne.vue'
import IndexTwo from '@/views/AppView/IndexTwo.vue'
import IndexThree from '@/views/AppView/IndexThree.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: AppView,
    children: [
      {
        path: '/indexOne',
        name: '/indexOne',
        component: IndexOne
      },
      {
        path: '/indexTwo',
        name: '/indexTwo',
        component: IndexTwo
      },
      {
        path: '/indexThree',
        name: '/indexThree',
        component: IndexThree
      },
      {
        path: '/',
        redirect: '/indexOne'
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
