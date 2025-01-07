import { supabase } from '../utils/supabase'
import type { AdminUser } from '../types/user'

interface LoginParams {
  username: string
  password: string
}

interface LoginResult {
  token: string
  user: AdminUser
}

export async function login({ username, password }: LoginParams): Promise<LoginResult> {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: username,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!session) {
    throw new Error('登录失败')
  }

  const user = session.user

  return {
    token: session.access_token,
    user: {
      id: user.id,
      username: user.email || '',
      role: 1,
      status: 1,
      last_login_at: user.last_sign_in_at || undefined
    }
  }
}

export async function register({ username, password }: LoginParams): Promise<LoginResult> {
  const { data: { session }, error } = await supabase.auth.signUp({
    email: username,
    password,
    options: {
      data: {
        username,
        role: 1,
        status: 1
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!session) {
    throw new Error('注册失败')
  }

  const user = session.user

  return {
    token: session.access_token,
    user: {
      id: user.id,
      username: user.email || '',
      role: 1,
      status: 1,
      last_login_at: user.last_sign_in_at || undefined
    }
  }
} 