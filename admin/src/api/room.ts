import request from '../utils/request'
import type { Room, RoomPackage, CreateRoomParams, UpdateRoomParams } from '../types/room'
import { RoomStatus } from '../types/room'

// 获取房间列表
export const getRooms = (params?: { id?: number }) => {
  const query = params?.id ? `?id=eq.${params.id}` : ''
  return request.get<Room[]>(`/rooms${query}`)
}

// 获取房间详情
export const getRoomDetail = (id: number) => {
  return getRooms({ id })
}

// 获取房间套餐列表
export const getRoomPackages = (roomId: number) => {
  return request.get<RoomPackage[]>(`/rooms?id=eq.${roomId}&select=packages(*)`)
}

// 创建房间
export const createRoom = (params: CreateRoomParams) => {
  return request.post<Room>('/rooms', params)
}

// 更新房间
export const updateRoom = (params: UpdateRoomParams) => {
  const { id, ...updateData } = params
  return request.patch<Room[]>(`/rooms?id=eq.${id}`, updateData, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
}

// 删除房间
export const deleteRoom = (id: number) => {
  return request.delete(`/rooms/${id}`)
}

// 更新房间状态
export const updateRoomStatus = (id: number, status: RoomStatus) => {
  return request.patch(`/rooms/${id}/status`, { status })
} 