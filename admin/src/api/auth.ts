import request from '../utils/request'
import type { AdminUser } from '../types/user'

interface LoginParams {
  username: string
  password: string
}

interface LoginResult {
  token: string
  user: AdminUser
}

export function login(data: LoginParams) {
  return request<LoginResult>({
    url: '/admin_users',
    method: 'post',
    data: {
      ...data,
      last_login_at: new Date().toISOString()
    }
  })
}

export function register(data: LoginParams) {
  return request<LoginResult>({
    url: '/admin_users',
    method: 'post',
    data: {
      ...data,
      role: 1,
      status: 1,
      last_login_at: new Date().toISOString()
    }
  })
} 