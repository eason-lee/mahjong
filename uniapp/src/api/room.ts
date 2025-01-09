import request from '@/utils/request'

export interface Room {
  id: number
  name: string
  description: string
  capacity: number
  hourlyRate: number
  area: number
  status: number
  tags: string[]
  images: string[]
}

export const roomApi = {
  // 获取可用房间列表
  getList() {
    return request.get<Room[]>('/miniapp/room/list')
  },

  // 获取房间详情
  getDetail(id: number) {
    return request.get<Room>(`/miniapp/room/${id}`)
  }
} 