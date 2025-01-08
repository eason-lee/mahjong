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
  return request.get<RoomPackage[]>(`/room_packages?room_id=eq.${roomId}`, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
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

// 创建套餐
export const createRoomPackage = (params: RoomPackage) => {
  return request.post<RoomPackage>('/room_packages', params, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
}

// 更新套餐
export const updateRoomPackage = (params: RoomPackage) => {
  const { id, ...updateData } = params
  return request.patch<RoomPackage[]>(`/room_packages?id=eq.${id}`, updateData, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
}

// 删除套餐
export const deleteRoomPackage = (id: number) => {
  return request.delete(`/room_packages?id=eq.${id}`, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
} 