<template>
  <view class="booking-container">
    <view class="header">
      <view class="back-icon" @tap="goBack">返回</view>
      <text class="title">预约</text>
      <view class="more-icon">更多</view>
    </view>

    <view class="room-info">
      <image 
        class="room-image" 
        :src="room.images[0]" 
        mode="aspectFill"
      />
      <view class="room-detail">
        <text class="store-name">门店: {{ room.storeName }}</text>
        <text class="room-name">包间: {{ room.name }}</text>
        <text class="special-tag">特惠包</text>
      </view>
    </view>

    <view class="room-tags">
      <text 
        v-for="tag in room.tags" 
        :key="tag"
        class="tag"
      >{{ tag }}</text>
    </view>

    <view class="booking-mode">
      <button 
        class="mode-btn"
        :class="{ active: mode === 'hourly' }"
        @tap="setMode('hourly')"
      >小时模式</button>
      <button 
        class="mode-btn"
        :class="{ active: mode === 'package' }"
        @tap="setMode('package')"
      >套餐模式</button>
    </view>

    <view class="date-picker">
      <view 
        v-for="date in dates" 
        :key="date.value"
        class="date-item"
        :class="{ active: selectedDate === date.value }"
        @tap="selectDate(date.value)"
      >
        <text>{{ date.label }}</text>
        <text>{{ date.weekday }}</text>
      </view>
    </view>

    <view class="package-list" v-if="mode === 'package'">
      <view 
        v-for="pkg in packages" 
        :key="pkg.id"
        class="package-item"
        :class="{ active: selectedPackage === pkg.id }"
        @tap="selectPackage(pkg.id)"
      >
        <text class="package-name">{{ pkg.name }}</text>
        <text class="package-price">¥{{ pkg.price }}</text>
      </view>
    </view>

    <view class="time-picker">
      <text class="label">时间选择:</text>
      <view class="time-range">
        <input 
          type="time" 
          class="time-input"
          v-model="startTime"
        />
        <text>到</text>
        <input 
          type="time" 
          class="time-input"
          v-model="endTime"
        />
      </view>
    </view>

    <view class="order-summary">
      <view class="summary-item">
        <text>预定时间:</text>
        <text>{{ bookingTime }}</text>
      </view>
      <view class="summary-item">
        <text>预约时长:</text>
        <text>{{ duration }}</text>
      </view>
      <view class="summary-item">
        <text>订单总价:</text>
        <text>¥{{ totalPrice }}</text>
      </view>
      <view class="coupon-info">
        暂无优惠券可用
      </view>
      <view class="summary-item total">
        <text>总计:</text>
        <text>¥{{ finalPrice }}</text>
      </view>
    </view>

    <view class="footer">
      <button class="recharge-btn" @tap="goRecharge">去充值</button>
      <button class="confirm-btn" @tap="confirmOrder">确认下单</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.booking-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  background-color: #07c160;
  color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .back-icon, .more-icon {
    font-size: 28rpx;
  }
}

.room-info {
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
  
  .room-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
  }
  
  .room-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    
    .store-name {
      font-size: 28rpx;
      font-weight: bold;
    }
    
    .room-name {
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .special-tag {
    font-size: 24rpx;
    color: #07c160;
  }
}

.room-tags {
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  
  .tag {
    font-size: 24rpx;
    color: #07c160;
    background-color: rgba(7, 193, 96, 0.1);
    padding: 4rpx 16rpx;
    border-radius: 8rpx;
  }
}

.booking-mode {
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: center;
  gap: 30rpx;
  
  .mode-btn {
    padding: 16rpx 40rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    
    &.active {
      background-color: #07c160;
      color: #fff;
    }
  }
}

.date-picker {
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
  overflow-x: auto;
  
  .date-item {
    width: 160rpx;
    height: 160rpx;
    border: 2rpx solid #eee;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    &.active {
      border-color: #07c160;
      color: #07c160;
    }
  }
}

.package-list {
  background-color: #fff;
  padding: 20rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  
  .package-item {
    border: 2rpx solid #eee;
    border-radius: 12rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    
    &.active {
      border-color: #07c160;
      
      .package-name, .package-price {
        color: #07c160;
      }
    }
  }
}

.time-picker {
  background-color: #fff;
  padding: 20rpx;
  
  .label {
    font-size: 28rpx;
    margin-bottom: 16rpx;
  }
  
  .time-range {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .time-input {
      width: 160rpx;
      height: 60rpx;
      border: 2rpx solid #eee;
      border-radius: 8rpx;
      text-align: center;
    }
  }
}

.order-summary {
  background-color: #fff;
  padding: 20rpx;
  margin-top: 20rpx;
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    margin-bottom: 16rpx;
    
    &.total {
      font-weight: bold;
      color: #ff4d4f;
    }
  }
  
  .coupon-info {
    background-color: rgba(7, 193, 96, 0.1);
    color: #07c160;
    padding: 16rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    margin: 20rpx 0;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  button {
    width: 300rpx;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    
    &.recharge-btn {
      background-color: #f5f5f5;
      color: #07c160;
    }
    
    &.confirm-btn {
      background-color: #07c160;
      color: #fff;
    }
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const mode = ref('package') // 'hourly' | 'package'
const selectedDate = ref('')
const selectedPackage = ref(null)
const startTime = ref('')
const endTime = ref('')

const dates = [
  { label: '12.26', weekday: '今天', value: '2024-12-26' },
  { label: '12.27', weekday: '周三', value: '2024-12-27' },
  { label: '12.28', weekday: '周四', value: '2024-12-28' },
  { label: '12.29', weekday: '周五', value: '2024-12-29' }
]

const packages = [
  { id: 1, name: '5小时套餐', price: 49 },
  { id: 2, name: '4小时套餐', price: 39 },
  { id: 3, name: '3小时套餐', price: 29 }
]

const room = {
  storeName: '朝阳御府店',
  name: 'V111 (一楼) 58麻将',
  images: ['https://example.com/room.jpg'],
  tags: ['独立新风系统', '吸烟区', '茶吧机', '内容丰富']
}

const setMode = (newMode: string) => {
  mode.value = newMode
}

const selectDate = (date: string) => {
  selectedDate.value = date
}

const selectPackage = (packageId: number) => {
  selectedPackage.value = packageId
}

const goBack = () => {
  uni.navigateBack()
}

const goRecharge = () => {
  uni.navigateTo({
    url: '/pages/user/recharge'
  })
}

const confirmOrder = () => {
  // 实现下单逻辑
}

// 计算属性
const bookingTime = computed(() => {
  if (!selectedDate.value || !startTime.value) return '--'
  return `${selectedDate.value} ${startTime.value}`
})

const duration = computed(() => {
  if (mode.value === 'package') {
    const pkg = packages.find(p => p.id === selectedPackage.value)
    return pkg ? `${pkg.name}` : '--'
  }
  return '--'
})

const totalPrice = computed(() => {
  if (mode.value === 'package') {
    const pkg = packages.find(p => p.id === selectedPackage.value)
    return pkg ? pkg.price : 0
  }
  return 0
})

const finalPrice = computed(() => {
  // 这里可以添加优惠券等逻辑
  return totalPrice.value
})
</script>