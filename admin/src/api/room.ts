import request from '../utils/request'
import { uploadImages, deleteImage } from '../utils/upload'
import type { Room, CreateRoomParams, UpdateRoomParams, RoomStatus } from '../types/room'

// 获取房间列表
export async function getRooms(params?: {
  status?: RoomStatus
  name?: string
  area?: string
  price?: number
  tags?: string[]
}) {
  const { data } = await request.get('/rooms', { params })
  return data as Room[]
}

// 获取单个房间详情
export async function getRoom(id: number) {
  const { data } = await request.get(`/rooms?id=eq.${id}`)
  return data[0] as Room
}

// 创建房间
export async function createRoom(params: CreateRoomParams) {
  let imageUrls: string[] = []
  
  try {
    // 如果有图片，先上传图片
    if (params.images && params.images.length > 0) {
      imageUrls = await uploadImages(params.images, 'rooms')
    }

    const { data } = await request.post('/rooms', {
      ...params,
      images: imageUrls,
      status: params.status || RoomStatus.Available,
      description: params.description || '',
      area: params.area || '',
      tags: params.tags || []
    }, {
      headers: {
        'Prefer': 'return=representation',
        'Content-Profile': 'public',
        'Content-Type': 'application/json'
      }
    })

    return data[0] as Room
  } catch (error: any) {
    console.error('创建房间出错:', error)
    // 如果创建失败，删除已上传的图片
    if (imageUrls.length > 0) {
      await Promise.all(imageUrls.map(url => deleteImage(url)))
    }
    throw new Error(error.message || '创建房间失败')
  }
}

// 更新房间
export async function updateRoom({ id, ...params }: UpdateRoomParams) {
  try {
    let imageUrls: string[] = []
    
    // 如果有新图片，先上传图片
    if (params.images && params.images.length > 0) {
      imageUrls = await uploadImages(params.images, 'rooms')
      
      // 获取原有图片
      const oldRoom = await getRoom(id)
      
      // 删除原有图片
      if (oldRoom?.images) {
        await Promise.all((oldRoom.images as string[]).map(url => deleteImage(url)))
      }
    }

    const { data } = await request.patch(`/rooms?id=eq.${id}`, {
      ...params,
      ...(imageUrls.length > 0 ? { images: imageUrls } : {})
    }, {
      headers: {
        'Prefer': 'return=representation'
      }
    })

    return data[0] as Room
  } catch (error: any) {
    console.error('更新房间出错:', error)
    throw new Error(error.message || '更新房间失败')
  }
}

// 删除房间
export async function deleteRoom(id: number) {
  try {
    // 获取房间信息
    const room = await getRoom(id)

    // 删除房间
    await request.delete(`/rooms?id=eq.${id}`)

    // 删除相关图片
    if (room?.images) {
      await Promise.all((room.images as string[]).map(url => deleteImage(url)))
    }
  } catch (error: any) {
    console.error('删除房间出错:', error)
    throw new Error(error.message || '删除房间失败')
  }
}

// 更新房间状态
export async function updateRoomStatus(id: number, status: RoomStatus) {
  try {
    await request.patch(`/rooms?id=eq.${id}`, { status })
  } catch (error: any) {
    console.error('更新房间状态出错:', error)
    throw new Error(error.message || '更新房间状态失败')
  }
} 