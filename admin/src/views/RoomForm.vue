<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { Plus, Delete, ZoomIn } from '@element-plus/icons-vue'
import { RoomStatus } from '../types/room'
import type { CreateRoomParams } from '../types/room'
import { createRoom } from '../api/room'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const formData = reactive<CreateRoomParams>({
  name: '',
  description: '',
  area: '',
  price: 0,
  status: RoomStatus.Available,
  tags: [],
  images: []
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入房间名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度应为 2 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于 0', trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请输入面积', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

// 图片上传相关
const fileList = ref<UploadFile[]>([])
const uploadRef = ref()
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

const handleExceed = () => {
  ElMessage.warning('最多只能上传 5 张图片')
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

const handleUploadChange = (file: UploadFile) => {
  if (file.status === 'ready') {
    formData.images = fileList.value
      .filter(f => f.raw)
      .map(f => f.raw as File)
  }
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url || ''
  dialogVisible.value = true
}

const handleRemove = (file: UploadFile) => {
  const index = fileList.value.indexOf(file)
  if (index !== -1) {
    fileList.value.splice(index, 1)
    formData.images = fileList.value
      .filter(f => f.raw)
      .map(f => f.raw as File)
  }
}

// 标签相关
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()
const tagInputRef = ref()

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.input?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!formData.tags) {
      formData.tags = []
    }
    formData.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const handleClose = (tag: string) => {
  if (formData.tags) {
    formData.tags = formData.tags.filter(t => t !== tag)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await createRoom(formData)
    ElMessage.success('创建成功')
    router.push('/rooms')
  } catch (error: any) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="room-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建房间</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="房间名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入房间名称" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入房间描述"
          />
        </el-form-item>

        <el-form-item label="面积" prop="area">
          <el-input v-model="formData.area" placeholder="请输入房间面积">
            <template #append>㎡</template>
          </el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0"
            :precision="2"
            :step="10"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status">
            <el-option
              :value="RoomStatus.Available"
              label="可用"
            />
            <el-option
              :value="RoomStatus.Maintenance"
              label="维护中"
            />
            <el-option
              :value="RoomStatus.Disabled"
              label="禁用"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-tag
            v-for="tag in formData.tags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="tagInputRef"
            v-model="inputValue"
            class="tag-input"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            + 添加标签
          </el-button>
        </el-form-item>

        <el-form-item label="房间图片">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleUploadChange"
            :before-upload="beforeUpload"
            :limit="5"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <template #default>
              <el-icon><Plus /></el-icon>
              <div class="el-upload__text">
                点击上传图片
              </div>
            </template>
            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><ZoomIn /></el-icon>
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
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" style="max-width: 100%" />
          </el-dialog>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            创建
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.room-form {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-upload--picture-card) {
    width: 150px;
    height: 150px;
    line-height: 150px;
  }

  .tag-input {
    width: 100px;
    margin-left: 8px;
    vertical-align: bottom;
  }

  .button-new-tag {
    margin-left: 8px;
    height: 32px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .mx-1 {
    margin: 0 4px;
  }
}
</style> 