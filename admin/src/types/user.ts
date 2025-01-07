export interface AdminUser {
  id: string
  username: string
  nickname?: string
  phone?: string
  avatar?: string
  role: number
  status: number
  last_login_at?: string
  merchant_id?: number
  created_at?: string
  updated_at?: string
}

export interface UserState {
  token: string
  userInfo: {
    id: string
    username: string
    avatar: string | null
    role: number
  }
} 