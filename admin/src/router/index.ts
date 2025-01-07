import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/rooms',
        name: 'Rooms',
        component: () => import('../views/Rooms.vue'),
        meta: { title: '房间管理' }
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: '/statistics',
        name: 'Statistics',
        component: () => import('../views/Statistics.vue'),
        meta: { title: '数据统计' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - 棋牌室管理系统`
  
  // 检查是否需要登录
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    // 如果已登录且访问登录页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router 