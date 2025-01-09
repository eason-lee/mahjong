import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  nickname: string
  avatar: string
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null
  }),

  getters: {
    isLoggedIn(): boolean {
      return !!this.token
    }
  },

  actions: {
    setToken(token: string) {
      this.token = token
      uni.setStorageSync('token', token)
    },

    setUserInfo(info: UserInfo) {
      this.userInfo = info
      uni.setStorageSync('userInfo', info)
    },

    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  }
}) 