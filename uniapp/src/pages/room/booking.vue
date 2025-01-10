<template>
  <view class="booking-container">
    <!-- 房间信息 -->
    <view class="room-info" v-if="roomInfo">
      <view class="basic-info">
        <image class="room-image" :src="roomInfo.image" mode="aspectFill" />
        <view class="info-content">
          <view class="name-wrap">
            <text class="name">门店: {{ roomInfo.name }}</text>
            <text class="special-tag">特惠包</text>
          </view>
          <text class="room-desc">包间: {{ roomInfo.area }}</text>
        </view>
      </view>
      <view class="tags">
        <text v-for="(tag, index) in roomInfo.tags" :key="index" class="tag">{{ tag }}</text>
      </view>
    </view>

    <!-- 模式切换 -->
    <view class="mode-switch">
      <view 
        class="mode-btn"
        :class="{ active: mode === 'hourly' }"
        @tap="setMode('hourly')"
      >小时模式</view>
      <view 
        class="mode-btn"
        :class="{ active: mode === 'package' }"
        @tap="setMode('package')"
      >套餐模式</view>
    </view>

    <!-- 日期选择 -->
    <view class="date-select">
      <view 
        v-for="date in availableDates" 
        :key="date.value"
        class="date-item"
        :class="{ active: selectedDate === date.value }"
        @tap="selectDate(date.value)"
      >
        <text class="date">{{ date.date }}</text>
        <text class="day">{{ date.day }}</text>
      </view>
    </view>

    <!-- 时间选择 -->
    <view class="time-select">
      <text class="label">时间选择:</text>
      <view class="time-range">
        <picker 
          mode="time" 
          :value="startTime" 
          @change="onStartTimeChange"
          class="time-picker"
        >
          <view class="picker-value">{{ startTime || '请选择' }}</view>
        </picker>
        <text class="separator">到</text>
        <picker 
          mode="time" 
          :value="endTime" 
          @change="onEndTimeChange"
          class="time-picker"
        >
          <view class="picker-value">{{ endTime || '请选择' }}</view>
        </picker>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="label">预定时间:</text>
        <text class="value">{{ formatBookingTime }}</text>
      </view>
      <view class="info-item">
        <text class="label">预约时长:</text>
        <text class="value">{{ duration }}小时</text>
      </view>
      <view class="info-item">
        <text class="label">订单总价:</text>
        <text class="value">¥{{ totalPrice }}</text>
      </view>
      <view class="coupon-info">
        暂无优惠券可用
      </view>
      <view class="total">
        <text class="label">总计:</text>
        <text class="value">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="recharge-btn" @tap="goToRecharge">去充值</button>
      <button class="submit-btn" @tap="submitBooking">确认下单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface RoomInfo {
  id: number
  name: string
  price: number
  image: string
  area: string
  tags: string[]
}

const roomInfo = ref<RoomInfo | null>(null)
const mode = ref<'hourly' | 'package'>('hourly')
const selectedDate = ref('')
const startTime = ref('')
const endTime = ref('')
const duration = ref(1)

// 生成未来5天的日期选项
const availableDates = computed(() => {
  const dates = []
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date()
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayName = i === 0 ? '今天' : dayNames[date.getDay()]
    
    dates.push({
      date: `${month}.${day}`,
      day: dayName,
      value: `${date.getFullYear()}-${month}-${day}`
    })
  }
  
  return dates
})

// 选择日期
const selectDate = (date: string) => {
  selectedDate.value = date
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 设置预订模式
const setMode = (newMode: 'hourly' | 'package') => {
  mode.value = newMode
}

// 计算预订时间
const formatBookingTime = computed(() => {
  if (!startTime.value) return ''
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return `${dateStr} ${startTime.value}`
})

// 计算总价
const totalPrice = computed(() => {
  const basePrice = roomInfo.value?.price || 0
  return basePrice * (duration.value || 1)
})

// 去充值
const goToRecharge = () => {
  uni.showToast({
    title: '充值功能开发中',
    icon: 'none'
  })
}

// 提交预订
const submitBooking = () => {
  if (!startTime.value || !endTime.value) {
    uni.showToast({
      title: '请选择预订时间',
      icon: 'none'
    })
    return
  }

  console.log('预订信息：', {
    roomId: roomInfo.value?.id,
    startTime: startTime.value,
    endTime: endTime.value,
    mode: mode.value,
    duration: duration.value
  })
}

onMounted(() => {
  // 设置导航栏标题
  uni.setNavigationBarTitle({
    title: '预约'
  })
  
  // 获取房间信息
  const info = uni.getStorageSync('BOOKING_ROOM_INFO')
  if (info) {
    roomInfo.value = info
    uni.removeStorageSync('BOOKING_ROOM_INFO')
  } else {
    uni.showToast({
      title: '获取房间信息失败',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
.booking-container {
  min-height: 100vh;
  background: #f7f7f7;
  padding-bottom: 120rpx;
}

.room-info {
  background: #fff;
  padding: 16rpx;
  
  .basic-info {
    display: flex;
    gap: 16rpx;
    margin-bottom: 16rpx;
    
    .room-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 12rpx;
      object-fit: cover;
    }
    
    .info-content {
      flex: 1;
      
      .name-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8rpx;
        
        .name {
          font-size: 28rpx;
          font-weight: bold;
        }
        
        .special-tag {
          font-size: 24rpx;
          color: #1db0de;
        }
      }
      
      .room-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    
    .tag {
      font-size: 24rpx;
      color: #0d7097;
      background: #e2f4fc;
      padding: 4rpx 16rpx;
      border-radius: 4rpx;
    }
  }
}

.mode-switch {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  
  .mode-btn {
    flex: none;
    padding: 12rpx 40rpx;
    font-size: 28rpx;
    border-radius: 999rpx;
    background: #e2f4fc;
    color: #0d7097;
    
    &.active {
      background: #1db0de;
      color: #fff;
    }
    
    &::after {
      border: none;
    }
  }
}

.date-select {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 20rpx;
  background: #fff;
  
  .date-item {
    width: 160rpx;
    height: 160rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2rpx solid #eee;
    border-radius: 8rpx;
    
    &.active {
      border-color: #1db0de;
      background: #e2f4fc;
    }
    
    .date {
      font-size: 28rpx;
      color: #0d7097;
      margin-bottom: 8rpx;
    }
    
    .day {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.time-select {
  padding: 20rpx;
  background: #fff;
  border-top: 2rpx solid #f5f5f5;
  
  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .time-range {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .time-picker {
      flex: 1;
      
      .picker-value {
        height: 80rpx;
        line-height: 80rpx;
        padding: 0 20rpx;
        background: #f8f8f8;
        border-radius: 8rpx;
        font-size: 28rpx;
      }
    }
    
    .separator {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.order-info {
  padding: 20rpx;
  background: #fff;
  margin-top: 20rpx;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .coupon-info {
    margin: 20rpx 0;
    padding: 16rpx;
    background: #e2f4fc;
    color: #0d7097;
    font-size: 26rpx;
    border-radius: 4rpx;
    text-align: center;
  }
  
  .total {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 2rpx solid #eee;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  background: #e2f4fc;
  
  button {
    width: 45%;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 28rpx;
    border-radius: 999rpx;
    
    &::after {
      border: none;
    }
  }
  
  .recharge-btn {
    background: #fff;
    color: #1db0de;
  }
  
  .submit-btn {
    background: #1db0de;
    color: #fff;
  }
}
</style>