export interface Room {
  id: number
  name: string
  description: string
  area: string
  status: RoomStatus
  price: number
  images: string[]
  tags: string[]
  packages?: RoomPackage[]
  created_at?: string
  updated_at?: string
}

export interface RoomPackage {
  id?: number
  room_id?: number
  name: string
  hours: number
  price: number
  description?: string
  status: number
  created_at?: string
  updated_at?: string
}

export enum RoomStatus {
  Disabled = 0,  // 禁用
  Available = 1, // 可用
  Occupied = 2,  // 已占用
  Maintenance = 3 // 维护中
}

export interface CreateRoomParams {
  name: string
  description?: string
  area?: string
  price: number
  status?: RoomStatus
  images?: (File | string)[]
  tags?: string[]
  packages?: RoomPackage[]
}

export interface UpdateRoomParams extends Partial<CreateRoomParams> {
  id: number
  packages?: RoomPackage[]
} 