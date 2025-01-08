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
          component: () => import('../views/Rooms.vue'),
          meta: {
            title: '房间管理'
          }
        },
        {
          path: 'rooms/create',
          name: 'room-create',
          component: () => import('../views/RoomForm.vue'),
          meta: {
            title: '创建房间'
          }
        },
        {
          path: 'rooms/:id',
          name: 'room-detail',
          component: () => import('../views/RoomDetail.vue'),
          meta: {
            title: '房间详情'
          }
        },
        {
          path: 'rooms/:id/edit',
          name: 'room-edit',
          component: () => import('../views/RoomForm.vue'),
          meta: {
            title: '编辑房间'
          }
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