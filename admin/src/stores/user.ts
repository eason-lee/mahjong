import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({
    id: '',
    username: '',
    avatar: '',
    role: ''
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
  function setUserInfo(info: typeof userInfo.value) {
    userInfo.value = info
  }

  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = {
      id: '',
      username: '',
      avatar: '',
      role: ''
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