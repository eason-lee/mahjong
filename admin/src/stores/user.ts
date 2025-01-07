import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserState } from '../types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({
    id: '',
    username: '',
    avatar: null as string | null,
    role: 0
  })

  // 设置token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 清除token
  function clearToken() {
    token.value = ''
    localStorage.removeItem('token')
  }

  // 设置用户信息
  function setUserInfo(info: UserState['userInfo']) {
    userInfo.value = info
  }

  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = {
      id: '',
      username: '',
      avatar: null,
      role: 0
    }
  }

  // 登出
  function logout() {
    clearToken()
    clearUserInfo()
  }

  return {
    token,
    userInfo,
    setToken,
    clearToken,
    setUserInfo,
    clearUserInfo,
    logout
  }
}) 