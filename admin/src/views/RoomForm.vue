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
            :on-remove="handleRemove"
            list-type="picture-card"
            :limit="5"
            accept="image/*"
          >
            <template #default>
              <el-icon><Plus /></el-icon>
            </template>
            <template #file="{ file }">
              <div class="upload-item">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt="房间图片"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>

          <!-- 图片预览对话框 -->
          <el-dialog v-model="previewVisible" append-to-body>
            <img w-full :src="previewUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="套餐信息">
          <div class="packages-container">
            <div v-for="(pkg, index) in packages" :key="index" class="package-item">
              <el-card>
                <template #header>
                  <div class="package-header">
                    <span>套餐 {{ index + 1 }}</span>
                    <el-button
                      type="danger"
                      link
                      :icon="Delete"
                      @click="removePackage(index)"
                    >
                      删除
                    </el-button>
                  </div>
                </template>
                
                <el-form
                  ref="packageFormRef"
                  :model="pkg"
                  :rules="packageRules"
                  label-width="100px"
                >
                  <el-form-item label="套餐名称" prop="name">
                    <el-input v-model="pkg.name" placeholder="请输入套餐名称" />
                  </el-form-item>
                  
                  <el-form-item label="使用时长" prop="hours">
                    <el-input-number
                      v-model="pkg.hours"
                      :min="1"
                      :precision="0"
                      :step="1"
                      placeholder="请输入使用时长"
                    >
                      <template #append>小时</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="套餐价格" prop="price">
                    <el-input-number
                      v-model="pkg.price"
                      :min="0"
                      :precision="2"
                      :step="10"
                      placeholder="请输入套餐价格"
                    />
                  </el-form-item>
                  
                  <el-form-item label="套餐描述" prop="description">
                    <el-input
                      v-model="pkg.description"
                      type="textarea"
                      placeholder="请输入套餐描述"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
            
            <div class="package-actions">
              <el-button
                type="primary"
                plain
                :icon="Plus"
                @click="addPackage"
              >
                添加套餐
              </el-button>
              
              <el-button
                v-if="packages.length > 0"
                type="success"
                @click="handlePackages"
              >
                保存套餐信息
              </el-button>
            </div>
          </div>
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
import { Plus, Delete, ZoomIn } from '@element-plus/icons-vue'
import { createRoom, getRoomDetail, updateRoom, getRoomPackages, createRoomPackage, updateRoomPackage, deleteRoomPackage } from '@/api/room'
import type { CreateRoomParams, UpdateRoomParams, Room, RoomPackage } from '@/types/room'
import { RoomStatus } from '@/types/room'
import type { UploadFile } from 'element-plus'
import { deleteImage, uploadImage, uploadImages } from '@/utils/upload'

const route = useRoute()
const router = useRouter()
const formRef = ref()

interface CustomUploadFile extends Omit<UploadFile, 'status'> {
  isNew?: boolean
  status: 'success' | 'ready' | 'uploading' | 'fail'
}

const fileList = ref<CustomUploadFile[]>([])

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

// 套餐相关
interface Package {
  id?: number
  room_id?: number
  name: string
  hours: number
  price: number
  description?: string
  status: number
  created_at?: string
  updated_at?: string
}

const packages = ref<Package[]>([])
const packageFormRef = ref()

const packageRules = {
  name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  hours: [{ required: true, message: '请输入使用时长', trigger: 'blur' }],
  price: [{ required: true, message: '请输入套餐价格', trigger: 'blur' }]
}

// 获取房间详情
const fetchRoomDetail = async (id: number) => {
  try {
    const [roomResponse, packagesResponse] = await Promise.all([
      getRoomDetail(id),
      getRoomPackages(id)
    ])
    
    if (roomResponse.data && roomResponse.data.length > 0) {
      const room = roomResponse.data[0]
      formData.value = {
        id: room.id,
        name: room.name,
        description: room.description,
        area: room.area,
        price: room.price,
        status: room.status,
        tags: room.tags || [],
        images: room.images || []
      }
      
      // 设置已有图片
      if (room.images && Array.isArray(room.images)) {
        fileList.value = room.images.map((url: string, index: number) => {
          return {
            uid: -(index + 1),
            name: `image-${index}`,
            url: url,  // 直接使用原始URL
            status: 'success' as const,
            isNew: false
          }
        })
      }
      
      // 设置套餐信息
      if (packagesResponse.data) {
        packages.value = packagesResponse.data
      }
    } else {
      ElMessage.error('房间不存在')
      router.back()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取房间详情失败')
    router.back()
  }
}

// 自定义上传方法
const handleCustomUpload = async (options: any) => {
  try {
    const { file } = options
    console.log('准备上传文件:', file)
    console.log('文件对象:', {
      name: file.name,
      type: file.type,
      size: file.size,
      raw: file.raw
    })
    
    // 确保文件是图片类型
    if (!file.type.startsWith('image/')) {
      throw new Error('只能上传图片文件')
    }

    // 上传图片到 Supabase Storage
    const imageUrl = await uploadImage(file)  // 直接传入 file 而不是 file.raw
    console.log('上传成功，获取到 URL:', imageUrl)
    
    // 添加到文件列表，用于预览
    fileList.value.push({
      uid: Date.now(),
      name: file.name,
      url: imageUrl,
      status: 'success' as const
    })
  } catch (error: any) {
    console.error('上传处理失败:', error)
    ElMessage.error(error.message || '上传图片失败')
  }
}

// 处理图片数据 - 用于表单提交
const handleImages = () => {
  return fileList.value.map(file => file.url)
}

// 处理图片删除
const handleRemove = async (file: CustomUploadFile) => {
  try {
    // 如果有 URL，说明图片已经上传到 Supabase，需要删除
    if (file.url) {
      await deleteImage(file.url)
    }
    const index = fileList.value.indexOf(file)
    if (index !== -1) {
      fileList.value.splice(index, 1)
    }
  } catch (error: any) {
    ElMessage.error(error.message || '删除图片失败')
  }
}

// 图片预览相关
const previewVisible = ref(false)
const previewUrl = ref('')

// 处理图片预览
const handlePreview = (file: CustomUploadFile) => {
  // 如果是新上传的图片，直接使用 url
  // 如果是已有的图片，确保使用完整的 URL
  previewUrl.value = file.url || ''
  previewVisible.value = true
}

// 处理套餐更新
const handlePackages = async () => {
  try {
    const roomId = Number(route.params.id)
    if (!roomId) {
      ElMessage.error('请先保存房间信息')
      return
    }

    // 获取当前套餐列表
    const currentPackages = await getRoomPackages(roomId)
    const existingPackages = currentPackages.data || []
    
    // 删除已移除的套餐
    const deletedPackages = existingPackages.filter(
      existing => !packages.value.some(pkg => pkg.id === existing.id)
    )
    for (const pkg of deletedPackages) {
      if (pkg.id) {
        await deleteRoomPackage(pkg.id)
      }
    }
    
    // 更新或创建套餐
    for (const pkg of packages.value) {
      if (pkg.id) {
        // 更新现有套餐
        await updateRoomPackage(pkg)
      } else {
        // 创建新套餐
        await createRoomPackage({
          ...pkg,
          room_id: roomId
        })
      }
    }
    
    ElMessage.success('套餐信息保存成功')
    // 重新加载套餐列表
    const response = await getRoomPackages(roomId)
    packages.value = response.data || []
  } catch (error: any) {
    console.error('保存套餐失败:', error)
    ElMessage.error(error.message || '保存套餐失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 处理图片数据 - 直接使用已上传图片的 URL
    formData.value.images = handleImages()
    
    if (isEdit.value) {
      // 更新房间
      const { packages: _, ...roomData } = formData.value
      const response = await updateRoom(roomData as UpdateRoomParams)
      if (response.data && response.data.length > 0) {
        ElMessage.success('更新房间成功')
        router.push('/rooms')
      } else {
        ElMessage.error('更新房间失败')
      }
    } else {
      // 创建房间
      const { packages: _, ...roomData } = formData.value
      const response = await createRoom(roomData)
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

// 添加套餐
const addPackage = () => {
  packages.value.push({
    name: '',
    hours: 1,
    price: 0,
    description: '',
    status: 1,
    room_id: Number(route.params.id)
  })
}

// 删除套餐
const removePackage = (index: number) => {
  packages.value.splice(index, 1)
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

.upload-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.upload-item:hover .el-upload-list__item-actions {
  opacity: 1;
}

.el-upload-list__item-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
  cursor: default;
}

.el-upload-list__item-preview,
.el-upload-list__item-delete {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s;
}

.el-upload-list__item-preview:hover,
.el-upload-list__item-delete:hover {
  transform: scale(1.2);
}

.el-upload-list__item-delete {
  color: #f56c6c;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 150px;
}

:deep(.el-upload-list__item-thumbnail) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.packages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.package-item {
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.package-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}
</style> 