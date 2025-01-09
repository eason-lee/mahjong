import { SUPABASE_URL } from '@/config'
import { useUserStore } from '@/stores/user'

const request = {
  get<T>(url: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token')
      
      uni.request({
        url: SUPABASE_URL + url,
        data,
        method: 'GET',
        header: {
          'X-Token': token,
          'Content-Type': 'application/json'
        },
        success: (res: any) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else if (res.statusCode === 401) {
            const userStore = useUserStore()
            userStore.logout()
            uni.reLaunch({ 
              url: '/pages/login/login'
            })
            reject(new Error('请先登录'))
          } else {
            reject(new Error(res.data?.message || '请求失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  post<T>(url: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token')
      
      uni.request({
        url: SUPABASE_URL + url,
        data,
        method: 'POST',
        header: {
          'X-Token': token,
          'Content-Type': 'application/json'
        },
        success: (res: any) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else if (res.statusCode === 401) {
            const userStore = useUserStore()
            userStore.logout()
            uni.reLaunch({ 
              url: '/pages/login/login'
            })
            reject(new Error('请先登录'))
          } else {
            reject(new Error(res.data?.message || '请求失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

export default request 