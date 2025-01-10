<template>
  <view class="container">
    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view 
        class="action-item" 
        v-for="action in quickActions" 
        :key="action.text"
        @tap="handleQuickAction(action.text)"
      >
        <image :src="action.icon" class="action-icon" mode="aspectFit" />
        <text class="action-text">{{ action.text }}</text>
      </view>
    </view>

    <!-- 房间列表 -->
    <view class="room-list">
      <view 
        class="room-item" 
        v-for="room in rooms" 
        :key="room.id"
        @tap="goToDetail(room)"
      >
        <!-- 左侧图片 -->
        <image 
          class="room-image"
          :src="room.images[0]" 
          mode="aspectFill"
          @tap.stop="previewImages(room.images)"
        />
        
        <!-- 右侧信息 -->
        <view class="room-info">
          <view class="status-tag-wrapper">
            <text class="status-tag">可预定</text>
          </view>
          <view class="room-header">
            <text class="room-type">{{ room.name }}</text>
          </view>
          
          <view class="tags">
            <text 
              v-for="(tag, index) in room.tags" 
              :key="index"
              class="tag"
            >{{ tag }}</text>
          </view>
          
          <view class="price-section">
            <view class="price-info">
              <view class="price-row">
                <text class="label">现价：</text>
                <text class="current-price">¥{{ room.price }}元/小时</text>
              </view>
              <view class="price-row">
                <text class="label">3小时套餐：</text>
                <text class="package-price">¥{{ room.price * 3 - 10 }}元</text>
              </view>
            </view>
            <button class="book-btn" @tap.stop="goToDetail(room)">预定</button>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-if="!rooms.length">
      <text>暂无可用房间</text>
    </view>

    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'

interface Room {
  id: number
  name: string
  description: string
  area: string
  status: number
  price: number
  images: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

const rooms = ref<Room[]>([])
const loading = ref(false)

const fetchRooms = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 1) // 只获取状态为可用的房间
      .order('created_at', { ascending: false })

    if (error) throw error

    rooms.value = data || []
  } catch (err) {
    console.error('获取房间列表失败:', err)
    uni.showToast({
      title: '获取房间列表失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const goToDetail = (room: Room) => {
  try {
    // 存储房间信息
    uni.setStorageSync('BOOKING_ROOM_INFO', {
      id: room.id,
      name: room.name,
      price: room.price,
      image: room.images[0],
      area: room.area,
      tags: room.tags,
      description: room.description
    })
    
    // 跳转到预订页面
    uni.navigateTo({
      url: '/pages/room/booking',
      fail: (err) => {
        console.error('跳转失败:', err)
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
  } catch (err) {
    console.error('存储房间信息失败:', err)
    uni.showToast({
      title: '系统错误',
      icon: 'none'
    })
  }
}

onMounted(() => {
  fetchRooms()
})

// 下拉刷新
const onPullDownRefresh = async () => {
  await fetchRooms()
  uni.stopPullDownRefresh()
}

// 定义页面生命周期
defineExpose({
  onPullDownRefresh
})

// 添加图片预览功能
const previewImages = (images: string[]) => {
  uni.previewImage({
    urls: images,
    current: images[0]
  })
}

// 快捷操作
const quickActions = [
  { icon: '/static/icons/door.svg', text: '开门' },
  { icon: '/static/icons/renew.svg', text: '续单' },
  { icon: '/static/icons/verify.svg', text: '验券' },
  { icon: '/static/icons/wifi.svg', text: 'WIFI' },
  { icon: '/static/icons/service.svg', text: '客服' }
]

// 处理快捷操作点击
const handleQuickAction = (action: string) => {
  switch (action) {
    case '开门':
      uni.showToast({ title: '开门功能开发中', icon: 'none' })
      break
    case '续单':
      uni.showToast({ title: '续单功能开发中', icon: 'none' })
      break
    case '验券':
      uni.showToast({ title: '验券功能开发中', icon: 'none' })
      break
    case 'WIFI':
      uni.showToast({ title: 'WIFI功能开发中', icon: 'none' })
      break
    case '客服':
      uni.showToast({ title: '客服功能开发中', icon: 'none' })
      break
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background: #f8f8f8;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    
    .action-icon {
      width: 48rpx;
      height: 48rpx;
    }
    
    .action-text {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.room-list {
  .room-item {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    background: #fff;
    padding: 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    
    .room-image {
      width: 240rpx;
      height: 240rpx;
      border-radius: 8rpx;
      flex-shrink: 0;
    }
    
    .room-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 240rpx;
      
      .status-tag-wrapper {
        margin-bottom: 12rpx;
        
        .status-tag {
          display: inline-block;
          font-size: 24rpx;
          color: #fff;
          background: #1db0de;
          padding: 4rpx 16rpx;
          border-radius: 4rpx;
        }
      }
      
      .room-header {
        margin-bottom: 16rpx;
        
        .room-type {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
      }
      
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        margin-bottom: auto;
        
        .tag {
          font-size: 24rpx;
          color: #333;
          background: #e2f4fc;
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
        }
      }
      
      .price-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16rpx;
        
        .price-info {
          display: flex;
          flex-direction: column;
          gap: 8rpx;
          
          .price-row {
            display: flex;
            align-items: center;
            
            .label {
              font-size: 24rpx;
              color: #666;
            }
          }
          
          .current-price {
            font-size: 28rpx;
            color: #333;
            margin-right: 8rpx;
          }
          
          .package-price {
            font-size: 28rpx;
            font-weight: bold;
            color: #ff4d4f;
          }
        }
        
        .book-btn {
          font-size: 28rpx;
          color: #fff;
          background: #1db0de;
          padding: 8rpx 24rpx;
          border-radius: 999rpx;
          border: none;
          min-width: 120rpx;
          
          &::after {
            border: none;
          }
        }
      }
    }
  }
}

.empty {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}

.loading {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>