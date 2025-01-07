import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: () => import('../views/Rooms.vue')
        },
        {
          path: 'rooms/create',
          name: 'roomCreate',
          component: () => import('../views/RoomForm.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  
  // 需要登录但未登录时，重定向到登录页
  if (to.meta.requiresAuth && !userStore.token) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
  
  // 已登录时访问登录页，重定向到首页
  if (to.path === '/login' && userStore.token) {
    return '/'
  }
})

export default router 