<template>
  <div class="room-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑房间' : '创建房间' }}</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="max-w-3xl mx-auto"
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
            <el-option label="已占用" :value="RoomStatus.Occupied" />
            <el-option label="已禁用" :value="RoomStatus.Disabled" />
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
          <el-button type="primary" @click="handleSubmit">{{ isEdit ? '保存' : '创建' }}</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createRoom, getRoomDetail, updateRoom } from '@/api/room'
import type { CreateRoomParams, UpdateRoomParams, Room } from '@/types/room'
import { RoomStatus } from '@/types/room'
import type { UploadFile } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const fileList = ref<UploadFile[]>([])

const isEdit = computed(() => route.name === 'room-edit')
const defaultTags = ['麻将', 'KTV', '棋牌', '聚会']

const formData = ref<CreateRoomParams & { id?: number }>({
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

// 获取房间详情
const fetchRoomDetail = async (id: number) => {
  try {
    const response = await getRoomDetail(id)
    if (response.data && response.data.length > 0) {
      const room = response.data[0]
      formData.value = {
        id: room.id,
        name: room.name,
        description: room.description,
        area: room.area,
        price: room.price,
        status: room.status,
        tags: room.tags,
        images: []
      }
      
      // 设置已有图片
      fileList.value = room.images.map((url, index) => ({
        name: `image-${index}`,
        url,
        status: 'success'
      }))
    } else {
      ElMessage.error('房间不存在')
      router.back()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取房间详情失败')
    router.back()
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

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 准备要上传的图片文件
    const files = fileList.value.map(file => file.raw).filter(Boolean)
    formData.value.images = files
    
    if (isEdit.value) {
      // 更新房间
      const response = await updateRoom(formData.value as UpdateRoomParams)
      if (response.data && response.data.length > 0) {
        ElMessage.success('更新房间成功')
        router.push('/rooms')
      } else {
        ElMessage.error('更新房间失败')
      }
    } else {
      // 创建房间
      const response = await createRoom(formData.value)
      if (response.data) {
        ElMessage.success('创建房间成功')
        router.push('/rooms')
      } else {
        ElMessage.error('创建房间失败')
      }
    }
  } catch (error: any) {
    console.error(isEdit.value ? '更新房间失败:' : '创建房间失败:', error)
    ElMessage.error(error.message || (isEdit.value ? '更新房间失败' : '创建房间失败'))
  }
}

onMounted(() => {
  if (isEdit.value && route.params.id) {
    fetchRoomDetail(Number(route.params.id))
  }
})
</script>

<style scoped>
.room-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 