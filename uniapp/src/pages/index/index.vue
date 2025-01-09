<template>
  <view class="container">
    <view class="header">
      <text class="fa-solid fa-ellipsis-vertical"></text>
    </view>
    
    <view class="quick-actions">
      <view v-for="(action, index) in quickActions" :key="index"
        class="action-item">
        <image :src="action.icon" class="action-icon" mode="aspectFit"/>
        <text class="action-text">{{action.text}}</text>
      </view>
    </view>

    <view class="room-list">
      <view v-for="(room, index) in rooms" :key="index"
        class="room-item">
        <image class="room-image"
          :src="room.image" mode="aspectFill"/>
        <view class="room-info">
          <text class="status-tag">可预定</text>
          <view class="room-header">
            <text class="room-type">{{room.type}}</text>
            <text class="room-number">{{room.number}}</text>
          </view>
          <view class="tags">
            <text v-for="(tag, tagIndex) in room.tags" :key="tagIndex"
              class="tag">
              {{tag}}
            </text>
          </view>
          <view class="price-section">
            <view>
              <text class="current-price">¥{{room.price}}/小时</text>
              <text class="original-price">¥{{room.originalPrice}}</text>
              <text class="package-info">{{room.packageInfo}}</text>
            </view>
            <button class="book-btn" @tap="bookRoom(room)">预定</button>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const quickActions = [
  { icon: '/static/icons/door.svg', text: '开门' },
  { icon: '/static/icons/renew.svg', text: '续单' },
  { icon: '/static/icons/verify.svg', text: '验券' },
  { icon: '/static/icons/wifi.svg', text: 'WIFI' },
  { icon: '/static/icons/service.svg', text: '客服' }
]


const rooms = ref([
  {
    type: '豪华包',
    number: 'V777（二楼）52玉石麻将（独立卫生间）',
    image: 'https://tools-api.webcrumbs.org/image-placeholder/80/80/office/1',
    price: '23.00',
    originalPrice: '69.00',
    packageInfo: '3小时套餐',
    tags: ['吸烟灯', '茶几饮水', '独立卫生间', '一次性拖鞋', '饮水机', '茶台', '6-8人', 'WIFI', '独立排风系统', '麻将机']
  },
  {
    type: '豪华包',
    number: 'V888（二楼）52玉石麻将茶桌',
    image: 'https://tools-api.webcrumbs.org/image-placeholder/80/80/office/2',
    price: '23.00',
    originalPrice: '69.00',
    packageInfo: '3小时套餐',
    tags: ['吸烟灯', '电子饮水', '独立空调', '茶几饮水', '玉石麻将', '茶台', '6-8人', 'WIFI', '独立排风系统']
  },
  {
    type: '中包',
    number: 'V555（一楼）52玉石麻将',
    image: 'https://tools-api.webcrumbs.org/image-placeholder/80/80/office/3',
    price: '18.00',
    originalPrice: '49.00',
    packageInfo: '清晨+01:51结束',
    tags: ['吸烟灯', '电子饮水', '独立空调', '茶几饮水', '玉石麻将', '茶台', 'WIFI', '独立排风系统']
  }
])

const bookRoom = (room: any) => {
  uni.navigateTo({
    url: `/pages/room/booking?roomId=${room.id}`
  })
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx;
  background-color: #22c55e;
  color: #ffffff;
}

.header .title {
  font-size: 36rpx;
  font-weight: bold;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16rpx;
  padding: 16rpx;
  background-color: #22c55e;
  color: #ffffff;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-item .label {
  font-size: 28rpx;
  margin-top: 4rpx;
}

.room-list {
  padding: 16rpx;
}

.room-item {
  display: flex;
  gap: 16rpx;
  background-color: #ffffff;
  padding: 16rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e0e0e0;
  margin-bottom: 16rpx;
}

.room-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 24rpx;
}

.room-info {
  flex: 1;
}

.status-tag {
  display: inline-block;
  font-size: 24rpx;
  color: #ffffff;
  background-color: #22c55e;
  padding: 4rpx 8rpx;
  border-radius: 999rpx;
}

.room-header {
  display: flex;
  justify-content: space-between;
  margin: 8rpx 0;
}

.room-type {
  font-weight: bold;
  color: #333333;
}

.room-number {
  color: #22c55e;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4rpx;
  margin-bottom: 8rpx;
}

.tag {
  font-size: 24rpx;
  color: #666666;
  background-color: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-price {
  display: block;
  color: #22c55e;
  font-weight: bold;
}

.original-price {
  font-size: 24rpx;
  color: #999999;
  text-decoration: line-through;
}

.package-info {
  font-size: 24rpx;
  color: #ff4d4f;
}

.book-btn {
  background-color: #22c55e;
  color: #ffffff;
  padding: 8rpx 16rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 16rpx;
  background-color: #f5f5f5;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-item .label {
  font-size: 24rpx;
  margin-top: 4rpx;
}

.icon {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 48rpx;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.action-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 8rpx;
}

.action-text {
  font-size: 24rpx;
  color: #ffffff;
}
</style>