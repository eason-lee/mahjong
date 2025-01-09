<template>
  <view class="login-container">
    <view class="logo">
      <image src="/static/images/logo.png" mode="aspectFit"></image>
    </view>

    <view class="welcome">
      <text class="title">欢迎使用</text>
      <text class="subtitle">麻将馆预约小程序</text>
    </view>

    <view class="login-box">
      <button 
        class="login-btn"
        @tap="handleLogin"
        :loading="isLoading"
        :disabled="isLoading"
      >
        微信一键登录
      </button>
    </view>

    <view class="error-message" v-if="error">
      {{ error }}
    </view>

    <view class="privacy-policy">
      登录即表示同意
      <text class="link" @tap="showPrivacyPolicy">用户协议和隐私政策</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/config/supabase'

const isLoading = ref(false)
const error = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  try {
    // 1. 先获取用户信息（必须在点击事件中直接调用）
    const userProfileRes = await uni.getUserProfile({ 
      desc: '用于完善用户资料'
    })

    // 2. 获取登录code
    const loginRes = await uni.login()
    if (!loginRes.code) {
      throw new Error('获取登录码失败')
    }

    // 3. 设置加载状态
    isLoading.value = true
    error.value = ''

    const email = `${loginRes.code}@qq.com`
    const password = loginRes.code

    // 4. 先尝试注册
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: userProfileRes.userInfo.nickName,
            avatar_url: userProfileRes.userInfo.avatarUrl,
            wx_code: loginRes.code
          }
        }
      })
    } catch (signUpErr) {
      console.log('注册失败，可能用户已存在:', signUpErr)
    }

    // 5. 无论注册是否成功，都尝试登录
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError) {
      throw loginError
    }

    if (!data?.user) {
      throw new Error('登录失败: 未获取到用户信息')
    }

    // 6. 保存用户信息
    userStore.setUserInfo({
      id: data.user.id,
      nickname: userProfileRes.userInfo.nickName,
      avatar: userProfileRes.userInfo.avatarUrl
    })

    // 7. 跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })

  } catch (err: any) {
    error.value = err.message || '登录失败,请重试'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const showPrivacyPolicy = () => {
  uni.navigateTo({
    url: '/pages/common/privacy-policy'
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #fff;
}

.logo {
  margin: 80rpx 0;
  width: 200rpx;
  height: 200rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.welcome {
  text-align: center;
  margin-bottom: 60rpx;
  
  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.login-box {
  width: 100%;
  margin: 40rpx 0;
}

.login-btn {
  width: 100% !important;
  height: 88rpx;
  line-height: 88rpx;
  background: #07c160;
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
  
  &::after {
    border: none;
  }
}

.error-message {
  color: #ff4d4f;
  font-size: 28rpx;
  margin-top: 20rpx;
}

.privacy-policy {
  font-size: 24rpx;
  color: #999;
  margin-top: 40rpx;
  
  .link {
    color: #07c160;
    display: inline;
  }
}
</style> 