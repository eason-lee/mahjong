<template>
  <div class="room-edit">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="max-w-3xl mx-auto"
      v-loading="loading"
    >
      <el-form-item label="房间名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入房间名称" />
      </el-form-item>

      <el-form-item label="房间描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入房间描述"
        />
      </el-form-item>

      <el-form-item label="房间面积" prop="area">
        <el-input v-model="formData.area" placeholder="请输入房间面积">
          <template #append>平方米</template>
        </el-input>
      </el-form-item>

      <el-form-item label="房间价格" prop="price">
        <el-input-number
          v-model="formData.price"
          :min="0"
          :precision="2"
          :step="10"
          placeholder="请输入房间价格"
        />
      </el-form-item>

      <el-form-item label="房间状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择房间状态">
          <el-option label="可用" :value="RoomStatus.Available" />
          <el-option label="维护中" :value="RoomStatus.Maintenance" />
          <el-option label="已预订" :value="RoomStatus.Reserved" />
        </el-select>
      </el-form-item>

      <el-form-item label="房间标签" prop="tags">
        <el-select
          v-model="formData.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入房间标签"
        >
          <el-option
            v-for="tag in defaultTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="房间图片" prop="images">
        <el-upload
          v-model:file-list="fileList"
          :http-request="handleCustomUpload"
          list-type="picture-card"
          :limit="5"
          accept="image/*"
          :auto-upload="false"
          :on-remove="handleRemove"
        >
          <template #default>
            <el-icon><Plus /></el-icon>
          </template>
          <template #file="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt="房间图片"
            />
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">更新</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getRoom, updateRoom } from '@/api/room'
import type { UpdateRoomParams, Room } from '@/types/room'
import { RoomStatus } from '@/types/room'
import type { UploadFile } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const fileList = ref<UploadFile[]>([])
const loading = ref(false)
const submitting = ref(false)

const defaultTags = ['麻将', 'KTV', '棋牌', '聚会']

const formData = ref<UpdateRoomParams>({
  id: Number(route.params.id),
  name: '',
  description: '',
  area: '',
  price: 0,
  status: RoomStatus.Available,
  tags: [],
  images: []
})

const rules = {
  name: [{ required: true, message: '请输入房间名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入房间价格', trigger: 'blur' }],
  area: [{ required: true, message: '请输入房间面积', trigger: 'blur' }]
}

// 加载房间数据
const loadRoom = async () => {
  try {
    loading.value = true
    const room = await getRoom(Number(route.params.id))
    if (!room) {
      ElMessage.error('房间不存在')
      router.back()
      return
    }

    // 更新表单数据
    formData.value = {
      id: room.id,
      name: room.name,
      description: room.description || '',
      area: room.area || '',
      price: room.price,
      status: room.status,
      tags: room.tags || [],
      images: []
    }

    // 显示已有图片
    if (room.images && Array.isArray(room.images)) {
      fileList.value = room.images.map((url: string) => ({
        name: url.split('/').pop() || '',
        url,
        status: 'success'
      }))
    }
  } catch (error: any) {
    console.error('加载房间数据失败:', error)
    ElMessage.error(error.message || '加载房间数据失败')
  } finally {
    loading.value = false
  }
}

// 自定义上传方法，仅用于预览
const handleCustomUpload = async (options: any) => {
  const { file } = options
  const url = URL.createObjectURL(file.raw)
  fileList.value.push({
    name: file.name,
    url,
    raw: file.raw
  })
}

// 处理图片移除
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex(item => item.url === file.url)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 准备图片文件
    const newFiles = fileList.value
      .filter(file => file.raw)
      .map(file => file.raw)
    
    // 保留已有的图片 URL
    const existingImages = fileList.value
      .filter(file => !file.raw)
      .map(file => file.url)
    
    // 更新房间
    await updateRoom({
      ...formData.value,
      images: newFiles,
      existingImages
    })
    
    ElMessage.success('更新房间成功')
    router.push('/rooms')
  } catch (error: any) {
    console.error('更新房间失败:', error)
    ElMessage.error(error.message || '更新房间失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadRoom()
})
</script>

<style scoped>
.room-edit {
  padding: 20px;
}
</style> 