<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'
import { login, register } from '../api/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  email: '',
  password: ''
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ]
})

const showPassword = ref(false)

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  formData.email = ''
  formData.password = ''
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const params = {
      email: formData.email,
      password: formData.password
    }
    
    const { token, user } = await (isLogin.value ? login(params) : register(params))
    
    if (!token || !user || !user.id) {
      throw new Error('登录失败，请稍后重试')
    }
    
    userStore.setToken(token)
    userStore.setUserInfo({
      id: user.id,
      username: user.email || '',
      avatar: null,
      role: 1
    })
    
    ElMessage.success(isLogin.value ? '登录成功' : '注册成功')
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || (isLogin.value ? '登录失败' : '注册失败'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">{{ isLogin ? '登录账户' : '创建账户' }}</h2>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="email">
          <el-input
            v-model="formData.email"
            :prefix-icon="User"
            placeholder="请输入邮箱"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            :prefix-icon="Lock"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            size="large"
          >
            <template #suffix>
              <el-icon
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <View v-if="showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="submit-btn"
            size="large"
            @click="handleSubmit"
          >
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
        </el-form-item>

        <div class="toggle-mode">
          <el-button
            link
            type="primary"
            @click="toggleAuthMode"
          >
            {{ isLogin ? '没有账户？立即注册' : '已有账户？立即登录' }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  
  .login-box {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    .title {
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      color: #1a1a1a;
    }
    
    .login-form {
      .submit-btn {
        width: 100%;
        margin-top: 10px;
      }
      
      .toggle-mode {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}

:deep(.el-input__wrapper) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

:deep(.el-input__inner) {
  height: 42px;
}

:deep(.el-form-item__error) {
  padding-top: 4px;
}

:deep(.el-button--primary) {
  height: 42px;
  font-size: 16px;
}
</style> 