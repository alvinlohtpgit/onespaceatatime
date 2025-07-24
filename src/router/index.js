import { createRouter, createWebHistory } from 'vue-router'
import { kindeService } from '@/services/kinde'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LandingView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/landing',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('../views/CallbackView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: async () => {
        await kindeService.login()
        return false
      }
    },
    {
      path: '/register',
      name: 'register',
      beforeEnter: async () => {
        await kindeService.register()
        return false
      }
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async () => {
        await kindeService.logout()
        return false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await kindeService.isAuthenticated()
    if (!isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
