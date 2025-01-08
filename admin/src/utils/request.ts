import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import { useUserStore } from '../stores/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    
    if (userStore.token) {
      // 使用用户的 token 进行认证
      config.headers.Authorization = `Bearer ${userStore.token}`
      config.headers.apikey = import.meta.env.VITE_SUPABASE_KEY
    } else {
      // 未登录时重定向到登录页
      router.push('/login')
      return Promise.reject(new Error('请先登录'))
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Response error:', error.response)
    console.error('Error config:', error.config)
    
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else if (error.response?.status === 403) {
      ElMessage.error('没有权限执行此操作')
      console.error('权限错误详情:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      })
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request 