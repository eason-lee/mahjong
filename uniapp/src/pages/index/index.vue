<template>
  <view class="container">
    <view class="room-list">
      <view 
        class="room-item" 
        v-for="room in rooms" 
        :key="room.id"
        @tap="goToDetail(room.id)"
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
              <text class="current-price">¥{{ room.price }}/小时</text>
              <text class="original-price">¥{{ room.price * 3 }}</text>
              <text class="package-info">3小时套餐</text>
            </view>
            <button class="book-btn" @tap.stop="goToDetail(room.id)">预定</button>
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

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/room/detail?id=${id}`
  })
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
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background: #f8f8f8;
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
          background: #07c160;
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
          color: #666;
          background: #f5f5f5;
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
          .current-price {
            font-size: 32rpx;
            font-weight: bold;
            color: #f60;
            margin-right: 8rpx;
          }
          
          .original-price {
            font-size: 24rpx;
            color: #999;
            text-decoration: line-through;
            margin-right: 8rpx;
          }
          
          .package-info {
            font-size: 24rpx;
            color: #f60;
          }
        }
        
        .book-btn {
          font-size: 28rpx;
          color: #fff;
          background: #07c160;
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