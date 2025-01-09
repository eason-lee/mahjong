<template>
  <view class="container">
    <view class="user-info">
      <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
      <text class="nickname">{{ userInfo.nickname || '未登录' }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  onLoad() {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo) {
      this.userInfo = userInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-info {
  background: #fff;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .avatar {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    margin-bottom: 20rpx;
  }
  
  .nickname {
    font-size: 32rpx;
    color: #333;
  }
}
</style> 